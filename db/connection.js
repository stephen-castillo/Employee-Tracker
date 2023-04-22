const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_Host,
  database: process.env.DB_Name,
  user: process.env.DB_User,
  password: process.env.DB_Password
});

    db.connect(function(err) {
    if (err) throw err;
    console.log('Connected to MySQL server!');
    
    console.log(__dirname);

    // Execute the first SQL file
    const sql1 = fs.readFileSync(path.join(__dirname, '/schema.sql'), 'utf-8');
    db.query(sql1, (err, results, fields) => {
        if (err) throw err;
        console.log('Executed schema.sql successfully!');
    });
    
    // Execute the second SQL file
    const sql2 = fs.readFileSync(path.join(__dirname, '/seeds.sql'), 'utf-8');
    db.query(sql2, (err, results, fields) => {
        if (err) throw err;
        console.log('Executed seeds.sql successfully!');
    });
});

module.exports = db;