const express = require('express')
const registered_paper_routes = require('./database_routes');

var cors = require('cors');


const app = express();
app.use(cors());
const port = 3001

app.use(express.json());

app.get('/', (request, response) => {
    response.send("Base url of the DB app");
})

//when below path is hit we will get using API get from routes 
app.use('/api/registered_paper', registered_paper_routes)

app.listen(port, () => {
    console.log(`App is running on port ${port}.`)
})