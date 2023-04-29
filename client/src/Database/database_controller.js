const pool = require('./database_connection');
const queries = require('./database_queries');

const getPapers = (req, res) => {
    //below query got two params - sql query and 
    pool.query(queries.getPapers, (error, results) => {
        if(error) throw error;
        res.status(200).json(results.rows);
    });
    console.log('get paper details');
};

const getPapers_uid = (req, res) => {
    const uid = parseInt(req.params.uid);
    pool.query(queries.getPapers_uid, [uid], (error, result) => {
        if(error) throw error;
        res.status(200).json(result.rows);
    })
}

const addPapers = (req, res) => {
    const { author_address, paper_name, uid, paper_data } = req.body;
    pool.query(queries.postPapers, [author_address, paper_name, uid, paper_data], (error, result) => {
        if(error) throw error;
        res.status(201).send("Paper registered successfully");
    })
}

const removePapers = (req, res) => {
    const uid = parseInt(req.params.uid);
    pool.query(queries.deletePapers, [uid], (error, results) => {
        //const noPaper = !results.rows.length;
        if(error) throw error;
        res.status(201).send("Paper unregistered successfully");
    })
}

module.exports = {
    getPapers,
    getPapers_uid,
    addPapers,
    removePapers
}