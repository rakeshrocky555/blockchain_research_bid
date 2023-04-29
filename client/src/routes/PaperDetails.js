import Web3 from "web3";
import {useState, useEffect, useContext} from "react";
import ResearchPaperBid from "../contracts/ResearchPapers.json"

function PaperDetails() {

  const [author_address, set_author_address] = useState("Nil");
  const [state, setState] = useState({web3: null, contract: null});

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
        gas: '3000000'
      });

      //setting the state of the application
      setState({web3: web3, contract: contract});
    }
    provider && template();
  }, []);


  async function research_paper_details(){
    const {contract} = state;
    const tokenId = document.querySelector("#value3").value;
    console.log("Token id entered is, ", tokenId);
    (contract.methods.ownerOf(tokenId).call({from: "0xEba1B25c50e0347CA532745078AA06efF6De5b51"})).then(data => set_author_address(data));
  }

  return (
    <div className="paperdetails">
      {/* <h1>Paper</h1> */}
      <br></br>
      <p>Please enter token ID to find the owner of the research paper</p>
      <label for="value3">Token ID</label>
      <input type = "text" id = "value3" name = "value3"></input>
      <button onClick={research_paper_details}>Get Author address</button>
      {/*printing the owner address with the id*/}
      <p>Author address is: {author_address}</p>
      {/* <p id="owner_address"></p> */}
    </div>
    
  );
}

export default PaperDetails;
