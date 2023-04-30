// SPDX-License-Identifier: MIT
//pragma solidity ^0.8.9;
pragma solidity >=0.5.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ResearchPapers is ERC721, Ownable {
    //ABC events
    event Sample(string msg);
    
    using Counters for Counters.Counter;

    //////////data structures INTIALIZATIONS/DECLARATIONS///////////////////
    struct PaperDetails{
        string name;
        bool verified;
        address payable previous_owner;
        address payable present_owner;
        uint id;
        string paper_url;
    }
    PaperDetails[] paperDetails;
    struct PersonalDetails {
        string name;
        //designation can be Author, Owner, Auctioneer, Bidder or Reviewer
        string designation;
    }
    mapping (address => PersonalDetails) add_to_per;
    address ownerAddress;
    //mapping between token ID and owner of RP address
    mapping (uint256 => address) nft_to_personlink;
    mapping (uint256 => PaperDetails) nft_to_paperlink;
    bool start = false;
    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("ResearchPaperBidding", "RPB") {
        ownerAddress = msg.sender;
    }

    
    //////////////Modifiers/////////////////
    modifier onlyBidOpen(){
        require(start);
        _;
    }

    modifier notOwner(){
        require(msg.sender != nft_to_paperlink[present_token_id].present_owner);
        _;
    }

    ///////////////////OPERATIONS///////////////////////////////////////////

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://happyMonkeyBaseURI/";
    }

    function safeMint(address payable to, string memory name, string memory paper_url, uint id, bool verified) private onlyOwner{
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        //link NFT token to owner and NFT token to paper
        nft_to_personlink[tokenId] = to;
        nft_to_paperlink[tokenId] = PaperDetails(name, verified, to, to, id, paper_url);
    }

    //upload and review the research paper
    // function uploadPaperAndValidate(address payable author, string memory paper_name) public onlyOwner{
    //     //assuming the validation is done correctly, updating the verified parmeter of PaperDetails to true
    //     safeMint(author, paper_name, true);
    // }

    //approve and create NFT token for the research paper
    function approveAndcreateNFT(address payable author, string memory paper_name, string memory paper_url, uint id) public onlyOwner{
        //assuming the validation is done correctly, updating the verified parmeter of PaperDetails to true
        safeMint(author, paper_name, paper_url, id, true);
    }



    ///////////////////////////////////Bidding////////////////////////////////////////////////////

    //start bidding by owner/auctioneer
    uint present_token_id;
    function start_bidding(uint id) public onlyOwner{
        emit Sample("Open bidding");
        max_price = 0;
        start = true;
        present_token_id = id;
    }

    //assumption only one item can be bidded at a time
    uint public max_price = 0;
    address payable temp;
    function bid() public onlyBidOpen notOwner payable{
        if(msg.value > max_price){
            max_price = msg.value;
            temp = payable(msg.sender);
        }
    }

    //close bidding
    function close_bidding() public payable onlyOwner{
        
        start = false;
        address payable previous_own = nft_to_paperlink[present_token_id].present_owner;

        uint id = nft_to_paperlink[present_token_id].id;

        nft_to_personlink[present_token_id] = temp;
        nft_to_paperlink[present_token_id] = PaperDetails(nft_to_paperlink[present_token_id].name, true, previous_own, temp, id, nft_to_paperlink[present_token_id].paper_url);
        previous_own.transfer(max_price);
        _transfer(ownerOf(present_token_id), temp, present_token_id);
    }


    //these methods are only meant for testing purpose

     //debug nft_to_paperlink
     function display_PaperDetails(uint256 id) public view returns (PaperDetails memory){
        return nft_to_paperlink[id];
    }

    //debug max bid price so far
     function display_maxBidPrice() public view returns (uint){
        return max_price;
    }

    //display nft_to_personlink
    function display_PersonDetails(uint id) public view returns (address){
        return nft_to_personlink[id];
    }

}