// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract FanteraNFT is ERC721Enumerable{
    using Strings for uint256;

    string public baseURI;
    string public baseExtension = ".json";
    address[] public withdrawlAddresses;
    uint256 public immutable MAX_SUPPLY;
    uint256 public constant MAX_PER_TX = 1;
    uint256 public constant MAX_PER_WALLET = 1;
    uint256 public constant MINT_PRICE = 0.001 ether;
    mapping(address => uint) public addressToMinted;

    constructor(string memory _baseURI, uint256 _maxSupply)
        ERC721("Fantera NFT", "FAN")
    {
        baseURI = _baseURI;
        MAX_SUPPLY = _maxSupply;
    }

    function setBaseURI(string memory _baseURI) external{
        baseURI = _baseURI;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        _requireMinted(tokenId);

        return bytes(baseURI).length > 0 ? 
        string(abi.encodePacked(baseURI, tokenId.toString(), baseExtension)) 
        : "";
    }


    function mint(uint256 _count) public payable{
        require(_count <= MAX_PER_TX, "Mint count exceeds max per transaction");
        require(addressToMinted[_msgSender()] + _count <= MAX_PER_WALLET, "Mint count exceeds max per wallet"); 
        uint256 totalSupply = totalSupply();
        require(totalSupply + _count <= MAX_SUPPLY, "Mint count exceeds max supply");
        require(_count * MINT_PRICE == msg.value, "Invalid mint funds provided");

        addressToMinted[_msgSender()] += _count;

        for(uint i=1; i <= _count; i++) { 
            _mint(_msgSender(), totalSupply + i);
        }
    }

    function withdraw() external{
        uint256 value = address(this).balance;
        (bool success, ) = 0x5838dB668E68B619a2e47451aFf65e14766f6d9c.call{value: value}("");
        require(success, "Failed to send funds to withdrawl address");
    }
}