import React from "react";
import {useState, useEffect, useContext} from "react";
//below module is used to use API
import axios from 'axios';

import Web3 from "web3";

import ResearchPaperBid from "../contracts/ResearchPapers.json"

//const {Client} = require('../database');


function RegisterPaper() {

    const [papers, setPapers] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:3001/api/registered_paper')
          .then(response => setPapers(response.data))
          .catch(error => console.error(error));
      }, []);

    const addPaper = () => {
        const author_address = document.querySelector("#value8").value;
        const paper_name = document.querySelector("#value7").value;
        const paper_data = document.querySelector("#value9").value;
        const uid = Math.floor(Math.random() * 1000000);
        axios.post('http://localhost:3001/api/registered_paper/add', { author_address: author_address, paper_name: paper_name, uid: uid, paper_data: paper_data })
            .then(response => {
            setPapers([...papers, response.data]);
        //setNewTodoTitle('');
            })
            .catch(error => console.error(error));
    };

    // fetch('http://localhost:3001/api/registered_paper/add', {

  return (
    <div className="registerpaper">
      <p>Please enter Research paper name, author address and enter research paper data</p>
      <label for="value7">Research paper name</label>
      <input type = "text" id = "value7" name = "value7"></input>
      <label for="value8">Author address</label>
      <input type = "text" id = "value8" name = "value8"></input>
      <label for="value9">Research Paper data</label>
      <input type = "text" id = "value9" name = "value9"></input>
      <button onClick={addPaper}>Register</button>

    </div>
  );
}

export default RegisterPaper;

