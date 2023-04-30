//import React from "react";
import Web3 from "web3";
import {useState, useEffect, createContext} from "react";
import ResearchPaperBid from "../contracts/ResearchPapers.json"
import PaperDetails from "./PaperDetails";
//import './App.css';
import { utils } from 'ethers';

//export const StateContext = createContext();

function Home() {
  //var details="";
  const [state, setState] = useState({web3: null, contract: null});
  //data to show to the user
  const [data, setData] = useState("Nil");
  // //below is used to set author address
  const [author_address, set_author_address] = useState("Nil");
  // //below is used to set research paper name
  // const [paper_name, set_paper_name] = useState("Nil");
  
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
        from: '0xB62C52F829b54c8f27Fa03F12c5573CEe1c0a781',
        gas: '3000000'
      });

      //setting the state of the application
      setState({web3: web3, contract: contract});

    }
    provider && template();
  }, []);
  console.log("State inside Home is", state);
  console.log("Calling methods inside the smart contract");


  return(
    <div className="home">
      <h1 className="animate-charcter">Welcome to Bidding system for Research papers</h1>
    </div>
  );
}

export default Home;
