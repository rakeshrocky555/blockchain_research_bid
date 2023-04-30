import Web3 from "web3";
import {useState, useEffect, useContext} from "react";
import ResearchPaperBid from "../contracts/ResearchPapers.json"

function PaperDetails() {

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
      console.log("Contract is deployed by", ownerAddress);
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


  async function research_paper_owner(){
    const {contract} = state;
    const tokenId = document.querySelector("#value3").value;
    console.log("Token id entered is, ", tokenId);
    //from address below can be from any account
    (contract.methods.ownerOf(tokenId).call({from: ownerAddress})).then(data => set_author_address(data));
  }

  async function research_paper_details(){
    const {contract} = state;
    const tokenId = document.querySelector("#value3").value;
    console.log("Token id entered is, ", tokenId);
    //from address below can be from any account
    (contract.methods.display_PaperDetails(tokenId).call({from: ownerAddress})).then(data => console.log("Research paper details are:", data['id']));
  }

  return (
    <div className="paperdetails">
      {/* <h1>Paper</h1> */}
      <br></br>
      <p>Please enter token ID to find the owner of the research paper</p>
      <label for="value3">Token ID</label>
      <input type = "text" id = "value3" name = "value3"></input>
      <button onClick={research_paper_owner}>Get Author address</button>
      <button onClick={research_paper_details}>Get Research Paper details</button>
      {/*printing the owner address with the id*/}
      <p>Author address is: {author_address}</p>
      {/* <p id="owner_address"></p> */}
    </div>
    
  );
}

export default PaperDetails;
