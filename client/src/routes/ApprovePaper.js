import React from "react";
import {useState, useEffect, useContext} from "react";
import Web3 from "web3";
import ResearchPaperBid from "../contracts/ResearchPapers.json"
//below module is used to use API
import axios from 'axios';

function ApprovePaper() {

  const [state, setState] = useState({web3: null, contract: null});
  const [data, setData] = useState("Nil");
  const [author_address, set_author_address] = useState("Nil");
  
  useEffect(() => {
    //below is the ganache address
    const provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");
    async function template(){
      //web3 object
      const web3 = new Web3(provider);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = ResearchPaperBid.networks[networkId];
      console.log(deployedNetwork.address);
      //to interact with the smart contract we need two things ABI & contract address

      const contract = new web3.eth.Contract(ResearchPaperBid.abi, deployedNetwork.address, {
        from: '0xa073CeBF2FC22BC33Fd626CaFD549E2A00c47d29',
        gas: '3000000'
      });

      //setting the state of the application
      setState({web3: web3, contract: contract});

    }
    provider && template();
  }, []);

    async function approve_paper(){
    const {contract} = state;
    const author_data = document.querySelector("#value1").value;
    const paper_data = document.querySelector("#value2").value;
    //when changing data we need to tell from which account you are changing the data
    await contract.methods.uploadPaperAndValidate(author_data, paper_data).send({from: "0xa073CeBF2FC22BC33Fd626CaFD549E2A00c47d29"});
    //for refreshing the page
    window.location.reload();
    }

    return (
        <div className="approvepaper">
        {/* <h1>Welcome to Bidding system for Research papers</h1> */}
        <label for="value1">Author address</label>
        <input type = "text" id = "value1" name = "value1"></input>
        <label for="value2">Research paper name</label>
        <input type = "text" id = "value2" name = "value2"></input>
        <button onClick={approve_paper}>Approve paper</button>
        </div>
    );
}

export default ApprovePaper;
