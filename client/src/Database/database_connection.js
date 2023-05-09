const Pool = require('pg').Pool;


// const pool = new Pool({
// user: "postgres",
// host: "localhost",
// database: "blockchain_db",
// password: "root",
// port: 5432
// });

const pool = new Pool({
    user: "nmbtklul",
    host: "mahmud.db.elephantsql.com",
    database: "nmbtklul",
    password: "dLXAIPZjqwD-ypXQAMtH8xpvvyrs7dUO",
    port: 5432
    });


module.exports = pool;