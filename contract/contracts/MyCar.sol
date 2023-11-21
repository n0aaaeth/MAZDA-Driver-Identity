// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import {
    ERC2771Context
} from "@gelatonetwork/relay-context/contracts/vendor/ERC2771Context.sol";

contract MyCar is ERC721A, ERC2771Context, Ownable { 
    using Strings for uint256;

    string public baseURI;

    event TokenMinted(address indexed to, uint256 indexed tokenId);

    constructor(address _trustedForwarder) 
        ERC721A("MyCar", "MYCAR")
        ERC2771Context(_trustedForwarder) 
        Ownable(msg.sender)
    {}

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721A)
        returns (string memory)
    {
        string memory currentBaseURI = _baseURI();
        return
            bytes(currentBaseURI).length > 0
                ? string(
                    abi.encodePacked(
                        currentBaseURI,
                        tokenId.toString(),
                        ".json"
                    )
                )
                : "";
    }

    function mint() public {
        uint256 tokenId = _nextTokenId(); 
        _mint(_msgSender(), 1); 
        emit TokenMinted(_msgSender(), tokenId);
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    function _startTokenId() internal pure override returns (uint256) {
        return 1;
    }

    function _msgSender() internal view override(Context, ERC2771Context) returns (address) {
        return ERC2771Context._msgSender();
    }

    function _msgData() internal view override(Context, ERC2771Context) returns (bytes calldata) {
        return ERC2771Context._msgData();
    }
}