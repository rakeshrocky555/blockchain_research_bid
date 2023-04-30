import React from "react";

import Web3 from "web3";
import {useState, useEffect, useContext} from "react";
import ResearchPaperBid from "../contracts/ResearchPapers.json"

function Bidding() {

  const [author_address, set_author_address] = useState("Nil");
  const [state, setState] = useState({web3: null, contract: null});
  const [ownerAddress, setAddress] = useState("Nil");

  useEffect(() => {
    //below is the ganache address ABC
    //const provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");
    async function template(){


      //web3 object ABC
      //const web3 = new Web3(provider);

      //delete the below ABC
      try {if(window.ethereum){
        console.log("Metamask exists");
        await window.ethereum.request({method: 'eth_requestAccounts'});
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        console.log("Owner is", accounts[0]);
        const networkId = await web3.eth.net.getId();
        console.log("Network ID is", networkId);
        console.log("Research paper bid is", ResearchPaperBid.networks);
        const deployedNetwork = ResearchPaperBid.networks[networkId];
        console.log("Deployed Network is", deployedNetwork)
        const contract = new web3.eth.Contract(ResearchPaperBid.abi, deployedNetwork.address, {
          from: accounts[0],
          gas: '3000000'
        });
        setState({web3: web3, contract: contract});
        setAddress(accounts[0]);
      }
    }
    catch (error){
      console.error(error);
    }
      // else{
      //   console.log("Metmask does not exists");
      // }


      //ABC
      // const networkId = await web3.eth.net.getId();
      // const deployedNetwork = ResearchPaperBid.networks[networkId];
      // web3.eth.getAccounts().then(accounts => {
      //   console.log("Owner address is", accounts[0]);
      //   setAddress(accounts[0]);
      // });
      // console.log(deployedNetwork.address);
      // //to interact with the smart contract we need two things ABI & contract address

      // const contract = new web3.eth.Contract(ResearchPaperBid.abi, deployedNetwork.address, {
      //   from: '0xB62C52F829b54c8f27Fa03F12c5573CEe1c0a781',
      //   gas: '3000000'
      // });


      //setting the state of the application
      //setState({web3: web3, contract: contract});
    }
    //ABC
    //provider && template();
    template();
  }, []);


  async function open_bidding(){
    const {contract} = state;
    console.log("Open bidding", contract);
    
    //ABC
    contract.events.Sample((error, result) => {
      if (!error){
        console.log("Event result is: ", result);
      }
    });
  //   console.log("Contract is", contract);
  //   contract.events.Sample(function(error, result) {
  //     if (!error)console.log("Event emitted: ", result);
  //  });

    const tokenId = document.querySelector("#value4").value;
    //do we need to use call or send
    //const details = await contract.methods.start_bidding(tokenId).call({from: "0x2D29F6760062F540F168a1fC247b44ffE533c094"});
    
    const details = await contract.methods.start_bidding(tokenId).send({from: ownerAddress});
    //for refreshing the page
    //window.location.reload();
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

