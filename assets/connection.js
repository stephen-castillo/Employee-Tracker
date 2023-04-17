const mysql = require('mysql2');

require('dotenv').config();

const db = mysql.createConnection(
    {
    host: process.env.DB_Host,
    database: process.env.DB_Name,
    user: process.env.DB_User,
    password: process.env.DB_Password
    
});

db.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("CREATE DATABASE IF NOT EXISTS employee_db", function (err, result) {
        if (err) throw err;
        console.log("Database created");
      });
});

module.exports = db;