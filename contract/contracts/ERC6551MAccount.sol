// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/interfaces/IERC1271.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";

import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "./interfaces/IERC6551MAccount.sol";

import "./libs/MinimalReceiver.sol";
import "./libs/ERC6551MAccountLib.sol";

import {
    ERC2771Context
} from "@gelatonetwork/relay-context/contracts/vendor/ERC2771Context.sol";

contract ERC6551Account is IERC165, IERC1271, IERC6551MAccount, ERC2771Context  {
    uint256 public nonce;

    mapping(address => mapping(uint256 => bool)) public asset;

    receive() external payable {}

       constructor(address _trustedForwarder) 
        ERC2771Context(_trustedForwarder) 
    {}

    function executeCall(
        address to,
        uint256 value,
        bytes calldata data
    ) external payable returns (bytes memory result) {
        address msgSender = ERC2771Context._msgSender();
        require(msgSender == owner(), "Not token owner");
        ++nonce;

        emit TransactionExecuted(to, value, data);

        bool success;
        (success, result) = to.call{value: value}(data);

        if (!success) {
            assembly {
                revert(add(result, 32), mload(result))
            }
        }
    }

    function token()
        external
        view
        returns (
            uint256,
            address,
            uint256
        )
    {
        return ERC6551MAccountLib.token();
    }

    function owner() public view returns (address) {
        (uint256 chainId, address tokenContract, uint256 tokenId) = this.token();
        if (chainId != block.chainid) return address(0);

        return IERC721(tokenContract).ownerOf(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public pure returns (bool) {
        return (interfaceId == type(IERC165).interfaceId ||
            interfaceId == type(IERC6551MAccount).interfaceId);
    }

    function isValidSignature(bytes32 hash, bytes memory signature)
        external
        view
        returns (bytes4 magicValue)
    {
        bool isValid = SignatureChecker.isValidSignatureNow(owner(), hash, signature);

        if (isValid) {
            return IERC1271.isValidSignature.selector;
        }

        return "";
    }

    function setAsset(address collection, uint256 tokenId, bool state) external {
        address msgSender = ERC2771Context._msgSender();
        require(msgSender == owner(),"Not Owner");
        asset[collection][tokenId] = state;
    }

    function isAssetSet(address collection, uint256 tokenId) external view returns (bool) {
        return asset[collection][tokenId];
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public virtual returns (bytes4) {
        return this.onERC721Received.selector;
    }

    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes memory
    ) public virtual returns (bytes4) {
        return this.onERC1155Received.selector;
    }

}