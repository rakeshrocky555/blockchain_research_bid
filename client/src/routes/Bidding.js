import React from "react";

import Web3 from "web3";
import {useState, useEffect, useContext} from "react";
import ResearchPaperBid from "../contracts/ResearchPapers.json"

function Bidding() {

  const [author_address, set_author_address] = useState("Nil");
  const [state, setState] = useState({web3: null, contract: null});
  const [ownerAddress, setAddress] = useState("Nil");

  useEffect(() => {
    //below is the ganache address
    const provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");
    async function template(){
      //web3 object
      const web3 = new Web3(provider);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = ResearchPaperBid.networks[networkId];
      web3.eth.getAccounts().then(accounts => {
        console.log("Owner address is", accounts[0]);
        setAddress(accounts[0]);
      });
      console.log(deployedNetwork.address);
      //to interact with the smart contract we need two things ABI & contract address

      const contract = new web3.eth.Contract(ResearchPaperBid.abi, deployedNetwork.address, {
        from: '0x562E994342D74a13c360C2824DE8582b2dC0FB0a',
        gas: '3000000'
      });

      //setting the state of the application
      setState({web3: web3, contract: contract});
    }
    provider && template();
  }, []);


  async function open_bidding(){
    const {contract} = state;
    const tokenId = document.querySelector("#value4").value;
    //do we need to use call or send
    //const details = await contract.methods.start_bidding(tokenId).call({from: "0x2D29F6760062F540F168a1fC247b44ffE533c094"});
    
    const details = await contract.methods.start_bidding(tokenId).send({from: ownerAddress});
    //for refreshing the page
    window.location.reload();
    return details;
  }

  //bid
  async function bid_token(){
    const {contract} = state;
    const bidder_addr = document.querySelector("#value5").value;
    console.log("Bidder address is ", bidder_addr);
    const bid_value = document.querySelector("#value6").value;
    console.log("Bid value is", (Web3.utils.toWei(bid_value.toString(), "ether")).toString());
    await contract.methods.bid().send({from: bidder_addr, value: Web3.utils.toWei(bid_value.toString(), "ether")});
  }

  //close bidding
  async function close_bid(){
    const {contract} = state;
    await contract.methods.close_bidding().send({from: ownerAddress});
    //for refreshing the page
    //window.location.reload();
  }

  return (
    <div className="bidding">
      <h1>Reports</h1>
      <br></br>
      <p>Bidding Operations</p>
      <label for="value4">Bidding token ID</label>
      <input type = "text" id = "value4" name = "value4"></input>
      <button onClick={open_bidding}>Open Bidding</button>

      <p>Please enter bidder address and bid value</p>
      <label for="value5">Bidder address</label>
      <input type = "text" id = "value5" name = "value5"></input>
      <label for="value6">Bid Value</label>
      <input type = "text" id = "value6" name = "value6"></input>
      <button onClick={bid_token}>Bid</button>
      

      <button onClick={close_bid}>Close Bidding</button>
    </div>

    
  );
}

export default Bidding;

