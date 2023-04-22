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

const parseSqlFile = (sqlFile) => {
    return sqlFile
        .toString()
        .replace(/(\r\n|\n|\r)/gm," ") // remove newlines
        .replace(/\s+/g, ' ') // excess white space
        .split(";") // split into all statements
}

const removeEmptyQueries = (queries) => {
    return queries
        .filter(q => q.length)
        .filter(q => q != ' ');
}

const init = () => {
    return new Promise((resolve, reject) => {
        db.connect(err => {
        if (err) reject(err);
        console.log('Connected to MySQL server!');
                                    
            const schemaSQL = parseSqlFile(fs.readFileSync(path.join(__dirname, '/schema.sql'), 'utf-8'));
            const seedSQL = parseSqlFile(fs.readFileSync(path.join(__dirname, '/seeds.sql'), 'utf-8'));
            const queries = removeEmptyQueries([...schemaSQL, ...seedSQL]);
            //console.log(queries);
            queries.forEach(q => {
                db.query(q, (err, results, fields) => {
                    if (err) reject(err);
                    //console.log(`Executed ${q} statement successfully!`);
                    resolve();
                });
            });
        });
    });
}


module.exports = { db, init };

