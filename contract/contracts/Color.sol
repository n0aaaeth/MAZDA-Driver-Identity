// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {
    ERC2771Context
} from "@gelatonetwork/relay-context/contracts/vendor/ERC2771Context.sol";

contract Color is ERC1155URIStorage, ERC2771Context, Ownable {
    
   constructor(address _trustedForwarder) 
       ERC1155("") 
       ERC2771Context(_trustedForwarder) 
       Ownable(msg.sender) 
   {}

    function mint(address _to, uint256 _tokenId, uint256 _amount) public {
        _mint(_to, _tokenId, _amount, "");
    }

    function setURI(
        uint256 _tokenId,
        string memory _newTokenURI
    ) public onlyOwner {
        _setURI(_tokenId, _newTokenURI);
    }

    function _msgSender() internal view override(Context, ERC2771Context) returns (address) {
        return ERC2771Context._msgSender();
    }

    function _msgData() internal view override(Context, ERC2771Context) returns (bytes calldata) {
        return ERC2771Context._msgData();
    }
}
