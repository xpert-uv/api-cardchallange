const { Client } = require("pg");
const DB_URI = "postgresql://postgres:ghimire@localhost/cards";

let db = new Client({
    connectionString: DB_URI
})

db.connect();
module.exports = db;