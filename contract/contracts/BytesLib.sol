// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.12;

library BytesLib {
    function calldataSliceSelector(bytes calldata _bytes)
        internal
        pure
        returns (bytes4 selector)
    {
        selector =
            _bytes[0] |
            (bytes4(_bytes[1]) >> 8) |
            (bytes4(_bytes[2]) >> 16) |
            (bytes4(_bytes[3]) >> 24);
    }

    function memorySliceSelector(bytes memory _bytes)
        internal
        pure
        returns (bytes4 selector)
    {
        selector =
            _bytes[0] |
            (bytes4(_bytes[1]) >> 8) |
            (bytes4(_bytes[2]) >> 16) |
            (bytes4(_bytes[3]) >> 24);
    }

    function revertWithError(bytes memory _bytes, string memory _errorInfo)
        internal
        pure
    {
        if (_bytes.length % 32 == 4) {
            bytes4 selector;
            assembly {
                selector := mload(add(0x20, _bytes))
            }
            if (selector == 0x08c379a0) {
                assembly {
                    _bytes := add(_bytes, 68)
                }
                revert(string(abi.encodePacked(_errorInfo, string(_bytes))));
            } else {
                revert(
                    string(abi.encodePacked(_errorInfo, "NoErrorSelector"))
                );
            }
        } else {
            revert(
                string(abi.encodePacked(_errorInfo, "UnexpectedReturndata"))
            );
        }
    }

    function returnError(bytes memory _bytes, string memory _errorInfo)
        internal
        pure
        returns (string memory)
    {
        if (_bytes.length % 32 == 4) {
            bytes4 selector;
            assembly {
                selector := mload(add(0x20, _bytes))
            }
            if (selector == 0x08c379a0) {
                assembly {
                    _bytes := add(_bytes, 68)
                }
                return string(abi.encodePacked(_errorInfo, string(_bytes)));
            } else {
                return
                    string(abi.encodePacked(_errorInfo, "NoErrorSelector"));
            }
        } else {
            return
                string(abi.encodePacked(_errorInfo, "UnexpectedReturndata"));
        }
    }
}