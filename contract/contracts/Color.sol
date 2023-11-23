// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@gelatonetwork/relay-context/contracts/vendor/ERC2771Context.sol";

contract Color is ERC1155URIStorage, ERC2771Context, Ownable {
    constructor(address _trustedForwarder) 
        ERC1155("") 
        ERC2771Context(_trustedForwarder) 
        Ownable(msg.sender) 
    {}

    function mint(address _to, uint256 _tokenId, uint256 _amount) public {
        _mint(_to, _tokenId, _amount, "");
    }

    function mintBatch(address _to, uint256[] memory _ids, uint256[] memory _amounts) public {
        require(_ids.length == _amounts.length, "IDs and amounts length mismatch");

        for (uint256 i = 0; i < _ids.length; i++) {
            _mint(_to, _ids[i], _amounts[i], "");
        }
    }

    function setURI(uint256 _tokenId, string memory _newTokenURI) public onlyOwner {
        _setURI(_tokenId, _newTokenURI);
    }

     function getURIs(uint256[] calldata _ids) public view returns (string[] memory) {
        string[] memory uris = new string[](_ids.length);
        for (uint256 i = 0; i < _ids.length; i++) {
            uris[i] = uri(_ids[i]);
        }
        return uris;
    }

    function _msgSender() internal view override(Context, ERC2771Context) returns (address) {
        return ERC2771Context._msgSender();
    }

    function _msgData() internal view override(Context, ERC2771Context) returns (bytes calldata) {
        return ERC2771Context._msgData();
    }
}
