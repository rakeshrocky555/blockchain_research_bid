import React from "react";
import {useState, useEffect, useContext} from "react";
import Web3 from "web3";
import ResearchPaperBid from "../contracts/ResearchPapers.json"
//below module is used to use API
import axios from 'axios';
import "@blueprintjs/core/lib/css/blueprint.css";
import '@blueprintjs/icons/lib/css/blueprint-icons.css';

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
    //const provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");
    async function template(){
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
    }
    template();
  }, []);

    async function approve_paper(){
    const {contract} = state;
    const author_data = document.querySelector("#value1").value;
    const paper_name = document.querySelector("#value2").value;
    const paper_url = document.querySelector("#value3").value;
    const id = document.querySelector("#value4").value;

    contract.events.e_NFTMint((error, result) => {
      if (!error){
        console.log("Event result is: ", result);
        //send notif ui
        alert("Paper is approved and NFT will be minted now");
      }
    });
    //when changing data we need to tell from which account you are changing the data
    await contract.methods.approveAndcreateNFT(author_data, paper_name, paper_url, id).send({from: ownerAddress});
    //await contract.methods.uploadPaperAndValidate(author_data, paper_data).send({from: ownerAddress});
    //for refreshing the page
    window.location.reload();
    }

    return (
        <div className="approvepaper">
        <h1 className = "app-par">Showing registered papers data as below</h1><br/>
        <table class="bp4-html-table bp4-html-table-bordered bp4-interactive">
          <thead>
            <tr>
              <th>Author address</th>
              <th>Paper Name</th>
              <th>Paper url</th>
              <th>ID</th>
            </tr>
          </thead>
          <tbody>
            {
              paper.map((row_val, index) => {
                return <tr key={index}>
                  <td>{row_val.author_address}</td>
                  <td>{row_val.paper_name}</td>
                  {/* <td>{row_val.paper_data}</td> */}
                  <td>
                    <div>
                    <a href={row_val.paper_data} target="_blank">
                        View paper
                    </a>
                    </div>
                  </td>
                  <td>{row_val.uid}</td>
                </tr>
              })
            }
          </tbody>
        </table>

        <br/><br/><br/>
        <h1 className = "app-par">Please enter below details and click on Approve button to approve the research paper</h1>
        <br/><br/>
        <label for="value1" className = "app-par">Author address</label>
        <input type = "text" id = "value1" name = "value1"></input>
        <label for="value2" className = "app-par">Research paper name</label>
        <input type = "text" id = "value2" name = "value2"></input>
        <label for="value3" className = "app-par">Paper url</label>
        <input type = "text" id = "value3" name = "value3"></input>
        <label for="value4" className = "app-par">ID</label>
        <input type = "text" id = "value4" name = "value4"></input>
        <br/><br/>
  
        <button class = "button app" onClick={approve_paper}>Approve paper</button>

        </div>
    );
}

export default ApprovePaper;
