// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract color is ERC1155URIStorage, Ownable {
    constructor() ERC1155("") Ownable(msg.sender) {
    }

    function mint(address _to, uint256 _tokenId, uint256 _amount) public onlyOwner {
         //interaction
        _mint(_to, _tokenId, _amount, "");
    }

    //@notice set URI
    function setURI(
        uint256 _tokenId,
        string memory _newTokenURI
    ) public onlyOwner {
        _setURI(_tokenId, _newTokenURI);
    }
}
