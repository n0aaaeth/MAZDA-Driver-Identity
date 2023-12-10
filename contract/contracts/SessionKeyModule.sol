// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.12;

import { IAutomate } from "./interfaces/IAutomate.sol";
import { IOpsProxyFactory } from "./interfaces/IOpsProxyFactory.sol";
import { ISafe } from "./interfaces/ISafe.sol";
import { IMultiSend } from "./interfaces/IMultiSend.sol";
import {
    ERC2771Context
} from "@gelatonetwork/relay-context/contracts/vendor/ERC2771Context.sol";
import "./libs/BytesLib.sol";

contract SessionKeyModule is ERC2771Context {
    using BytesLib for bytes;

    struct TxSpec {
        address to;
        bytes4 selector;
        bool hasValue;
        ISafe.Operation operation;
    }

    struct Tx {
        address to;
        bytes data;
        uint256 value;
        ISafe.Operation operation;
    }

    struct SessionGate {
        uint256 end;
        address user;
        address tempPublicKey;
    }

    address private constant MULTISEND = 0x105F043052959511a2164a863C8092A1a3464480;

    mapping(bytes32 => address) public whitelistedTransactions;

    mapping(bytes32 => SessionGate) public sessionKeys;

    event SetSessionKey(bytes32 indexed sessionKey);

    constructor(address _trustedForwarder) ERC2771Context(_trustedForwarder) {}

    function createSessionKey(
        string memory _sessionKeyId,
        uint256 _duration,
        address _tempPublicKey
    ) external {
        bytes32 sessionKey = keccak256(abi.encodePacked(_sessionKeyId));

        sessionKeys[sessionKey] = SessionGate(
            block.timestamp + _duration,
            _msgSender(),
            _tempPublicKey
        );

        emit SetSessionKey(sessionKey);
    }

    function whitelistTransaction(TxSpec[] calldata _txs) external {
        bytes32 txHash = encodeTx(msg.sender, _txs);
        require(
            whitelistedTransactions[txHash] == address(0),
            "SessionKeyModule: Transaction not whitelisted"
        );

        whitelistedTransactions[txHash] = msg.sender;
    }

    function removeWhitelistedTransaction(TxSpec[] calldata _txs) external {
        bytes32 txHash = encodeTx(msg.sender, _txs);
        require(
            whitelistedTransactions[txHash] == msg.sender,
            "SessionKeyModule: Transaction not whitelisted"
        );

        delete whitelistedTransactions[txHash];
    }

    function executeWithSessionKey(
        string memory _sessionKeyId,
        Tx[] calldata _txs
    ) external {
        bytes32 sessionKey = keccak256(abi.encodePacked(_sessionKeyId));
        SessionGate memory gate = sessionKeys[sessionKey];

        require(
            gate.user != address(0),
            "SessionKeyModule: Session not initialized"
        );
        require(
            gate.tempPublicKey == _msgSender(),
            "SessionKeyModule: Temporary key not allowed"
        );
        require(
            gate.end >= block.timestamp,
            "SessionKeyModule: Temporary key expired"
        );

        _onlyWhitelistedTransactions(gate.user, _convertTxToTxSpec(_txs));

        Tx memory execTx = _getExecTx(_txs);

        (bool success, bytes memory returnData) = ISafe(gate.user)
            .execTransactionFromModuleReturnData(
                execTx.to,
                execTx.value,
                execTx.data,
                execTx.operation
            );

        if (!success) {
            returnData.revertWithError("SessionKeyModule: Execution failed");
        }
    }

    function _getExecTx(Tx[] calldata _txs) private pure returns (Tx memory) {
        if (_txs.length > 1) {
            bytes memory multiSendData;

            for (uint256 i; i < _txs.length; i++) {
                Tx memory tx = _txs[i];
                multiSendData = abi.encodePacked(
                    multiSendData,
                    uint8(tx.operation),
                    tx.to,
                    tx.value,
                    tx.data.length,
                    tx.data
                );
            }

            return Tx({
                to: MULTISEND,
                value: 0,
                data: abi.encodeWithSelector(
                    IMultiSend.multiSend.selector,
                    multiSendData
                ),
                operation: ISafe.Operation.DelegateCall
            });
        } else {
            Tx memory tx = _txs[0];
            return Tx({
                to: tx.to,
                value: tx.value,
                data: tx.data,
                operation: tx.operation
            });
        }
    }

    function _convertTxToTxSpec(Tx[] calldata _txs) private pure returns (TxSpec[] memory) {
        TxSpec[] memory specs = new TxSpec[](_txs.length);

        for (uint256 i = 0; i < _txs.length; i++) {
            specs[i] = TxSpec({
                to: _txs[i].to,
                selector: _txs[i].data.memorySliceSelector(),
                hasValue: _txs[i].value > 0,
                operation: _txs[i].operation
            });
        }

        return specs;
    }

    function _onlyWhitelistedTransactions(address _user, TxSpec[] memory _specs) private view {
        require(
            isWhitelistedTransaction(_user, _specs),
            "SessionKeyModule: Not a whitelisted transaction"
        );
    }

    function isWhitelistedTransaction(address _user, TxSpec[] memory _specs) public view returns (bool) {
        return whitelistedTransactions[encodeTx(_user, _specs)] == _user;
    }

    function encodeTx(address _user, TxSpec[] memory _specs) public pure returns (bytes32) {
        return keccak256(abi.encode(_user, _specs));
    }
}
