import Web3 from "web3";
import {useState, useEffect} from "react";
import ResearchPaperBid from "./contracts/ResearchPapers.json"
import './App.css';
import { utils } from 'ethers';

function App() {
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
          from: '0xEba1B25c50e0347CA532745078AA06efF6De5b51',
          gas: '3000000000000'
        });
        console.log(contract);

        //setting the state of the application
        setState({web3: web3, contract: contract});

      }
      provider && template();
    }, []);
    console.log(state);

    console.log("Calling methods inside the smart contract");

  //   useEffect(() => {
  //     //getting contract instance from the state
  //     const {contract} = state;
  //     async function readData(){
  //       // for getting data we use call function else we use send function
  //       const data = await contract.methods.getter().call();
  //       setData(data);
  //   }
  //   contract && readData();
  // //in the below we are passing state as the dependancy because
  // }, [state]);

  // async function writeData(){
  //   const {contract} = state;
  //   const data = document.querySelector("#value").value;
  //   //when changing data we need to tell from which account you are changing the data
  //   //await contract.methods.setter(10).send({from: "0x20Ca32Bca072ECE39155516Cd22bcFDE4814E0c6"});
  //   await contract.methods.setter(data).send({from: "0x2B8abeD96CA07b19c107Ab28ee5bf28F3a0e5E33"});
  //   //for refreshing the page
  //   window.location.reload();
  // }

  //we use below aync method for minting Research paper
    async function mint_validate_Token(){
    const {contract} = state;
    const author_data = document.querySelector("#value1").value;
    const paper_data = document.querySelector("#value2").value;
    //when changing data we need to tell from which account you are changing the data
    await contract.methods.uploadPaperAndValidate(author_data, paper_data).send({from: "0xEba1B25c50e0347CA532745078AA06efF6De5b51"});
    //for refreshing the page
    window.location.reload();
  }

  //below functionality is to get the owner address of the research paper
  async function research_paper_details(){
    const {contract} = state;
    const tokenId = document.querySelector("#value3").value;
    console.log("Token id entered is, ", tokenId);
    //document.getElementById("address").innerHTML=21;
    //contract.methods.ownerOf(tokenId).call({from: "0xE8bf0504795BbB9e38113b38aEa9a2C40272103f"});
    (contract.methods.ownerOf(tokenId).call({from: "0xEba1B25c50e0347CA532745078AA06efF6De5b51"})).then(data => set_author_address(data));
  }

  //*****************************************bidding operation****************************************
  async function open_bidding(){
    const {contract} = state;
    const tokenId = document.querySelector("#value4").value;
    //do we need to use call or send
    //const details = await contract.methods.start_bidding(tokenId).call({from: "0x2D29F6760062F540F168a1fC247b44ffE533c094"});
    
    const details = await contract.methods.start_bidding(tokenId).send({from: "0xEba1B25c50e0347CA532745078AA06efF6De5b51"});
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
    await contract.methods.close_bidding().send({from: "0xEba1B25c50e0347CA532745078AA06efF6De5b51"});
    //for refreshing the page
    //window.location.reload();
  }



    return <div className="App">
      {/* <p>Contract data: {data}</p>
      <input type = "text" id = "value"></input>
      <button onClick={writeData}>Change Data</button> */}
      <p>Please enter the Author address, research paper details to validate the research paper and mint the NFTs</p>
      <label for="value1">Author address</label>
      <input type = "text" id = "value1" name = "value1"></input>
      <label for="value2">Research paper name</label>
      <input type = "text" id = "value2" name = "value2"></input>
      <button onClick={mint_validate_Token}>Tokenize Research paper</button>
      

      <p>Please enter token ID to find the owner of the research paper</p>
      <label for="value3">Token ID</label>
      <input type = "text" id = "value3" name = "value3"></input>
      <button onClick={research_paper_details}>Get Author address</button>
      {/* <button  onClick={() => set_author_address(research_paper_details)}>Get Author address</button> */}
      {/*printing the owner address with the id*/}
      <p>Author address is: {author_address}</p>
      {/* <p id="owner_address"></p> */}

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
}

export default App;
