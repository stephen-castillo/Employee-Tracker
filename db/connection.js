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

        db.query('DROP DATABASE employee_db', (err, results, fields) => {
            if (err) reject(err);
            console.log('Dropped the old database successfully!');
        
            db.query('CREATE DATABASE IF NOT EXISTS employee_db', (err, results, fields) => {
                if (err) reject(err);
                console.log('Created employee_db successfully!');
                
                db.query('USE employee_db', (err, results, fields) => {
                if (err) reject(err);
                console.log('Using employee_db database.');

                    const departmentSql = fs.readFileSync(path.join(__dirname, '/department.sql'), 'utf-8');
                        db.query(departmentSql, (err, results, fields) => {
                            if (err) reject(err);
                            console.log('Executed department.sql successfully!');

                            const rolesSql = fs.readFileSync(path.join(__dirname, '/roles.sql'), 'utf-8');
                            db.query(rolesSql, (err, results, fields) => {
                                if (err) reject(err);
                                console.log('Executed roles.sql successfully!');

                                const employeesSql = fs.readFileSync(path.join(__dirname, '/employees.sql'), 'utf-8');
                                db.query(employeesSql, (err, results, fields) => {
                                    if (err) reject(err);
                                    console.log('Executed employees.sql successfully!');
                                    
                                    const seedSql = parseSqlFile(fs.readFileSync(path.join(__dirname, '/seeds.sql'), 'utf-8'));
                                    const queries = removeEmptyQueries([...seedSql]);
                                    //console.log(queries);
                                    queries.forEach(q => {
                                        db.query(q, (err, results, fields) => {
                                            if (err) reject(err);
                                            console.log('Executed seeds insert successfully!');
                                            resolve();
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};

module.exports = { db, init };

