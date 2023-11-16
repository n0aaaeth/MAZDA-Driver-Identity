// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract myCar is ERC721A, Ownable {
    using Strings for uint256;

    //@param baseURI: url of base
    string public baseURI;

    constructor() ERC721A("myCar", "MYCAR") Ownable(msg.sender) {}

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
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

    function mint() public onlyOwner {
        //interaction
        _mint(msg.sender, 1);
    }

    //@notice get baseURI
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    //SET
    //@notice set BaseURI
    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    function _startTokenId() internal view override returns (uint256) {
        return 1;
    }
}
