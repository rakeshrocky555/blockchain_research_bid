import React from "react";
import {useState, useEffect, useContext} from "react";
import Web3 from "web3";
import ResearchPaperBid from "../contracts/ResearchPapers.json"
//below module is used to use API
import axios from 'axios';

function ApprovePaper() {

  const [state, setState] = useState({web3: null, contract: null});
  const [paper, setPaper] = useState([]);
  const [author_address, set_author_address] = useState("Nil");
  const [ownerAddress, setAddress] = useState("Nil");
  
  useEffect(() => {
    //below can be used to extract data from table
    axios.get('http://localhost:3001/api/registered_paper/')
    .then(res => {
      console.log("Table data is", res.data.length);
      setPaper(res.data);
    })
    .catch(err => console.log(err));


    
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
        from: '0xF9c76881B2A2057DB48a3D8f4148136A1AF53e9E',
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
    await contract.methods.uploadPaperAndValidate(author_data, paper_data).send({from: ownerAddress});
    //for refreshing the page
    window.location.reload();
    }

    return (
        <div className="approvepaper">
        {/* <h1>Welcome to Bidding system for Research papers</h1> */}
        <table>
          <thead>
            <tr>
              <th>Author address</th>
              <th>Paper Name</th>
              <th>Paper Data</th>
            </tr>
          </thead>
          <tbody>
            {
              paper.map((row_val, index) => {
                return <tr key={index}>
                  <td>{row_val.author_address}</td>
                  <td>{row_val.paper_name}</td>
                  <td>{row_val.paper_data}</td>
                </tr>
              })
            }
          </tbody>
        </table>

        
        <label for="value1">Author address</label>
        <input type = "text" id = "value1" name = "value1"></input>
        <label for="value2">Research paper name</label>
        <input type = "text" id = "value2" name = "value2"></input>
        <button onClick={approve_paper}>Approve paper</button>
        </div>
    );
}

export default ApprovePaper;
