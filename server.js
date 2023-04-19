const inquirer = require('inquirer');
const ctable = require('console.table');
const prompts = require('./assets/prompts');
const db = require('./assets/connection');
//console.log(db);

function viewDept(){
    db.promise().query("SELECT * FROM department")
    .then( ([rows,fields]) => {
        if(rows.length === 0){
            console.log('There are no results.');
        }else{
            console.table(rows);
        }
        init();
    });
}

function viewRole(){
    db.promise().query("SELECT * FROM roles")
    .then( ([rows,fields]) => {
        if(rows.length === 0){
            console.log('There are no results.');
        }else{
            console.table(rows);
        }
        init();
    });
}

function viewEmployee(){
    db.promise().query("SELECT * FROM employees")
    .then( ([rows,fields]) => {
        if(rows.length === 0){
            console.log('There are no results.');
        }else{
            console.table(rows);
        }
        init();
    });
}


function viewByManager(){
    db.promise().query("SELECT CONCAT(m.first_name, ' ',  m.last_name) AS manager, e.id, e.first_name, e.last_name FROM employees e JOIN employees m ON e.manager_id = m.id WHERE e.manager_id IS NOT NULL")
    .then( ([rows,fields]) => {
        if(rows.length === 0){
            console.log('There are no results.');
        }else{
            console.table(rows);
        }
        init();
    });
}

function viewByDepartment(){
    db.promise().query("SELECT d.name AS `Department`, CONCAT(e.first_name,' ', e.last_name) AS Employee, r.title FROM employees e JOIN roles r ON r.id = e.role_id JOIN department d ON d.id = r.department_id ORDER BY d.name, r.title")
    .then( ([rows,fields]) => {
        if(rows.length === 0){
            console.log('There are no results.');
        }else{
            console.table(rows);
        }
        init();
    });
}

async function addDepartment(){

    await inquirer.prompt({
        type: 'input',
        message: "What do you want to call the department",
        name: 'deptName',

    })
    .then(answers => {
        console.log(answers);
        db.execute('INSERT INTO department (name) VALUES (?)',
        [answers.deptName], 
        function(err, results,fields){
            if(err){
                console.error(err);
            }
            console.log(results);
            //console.log(fields);
        });
        db.unprepare();
        init();
    });
}

async function addRole(){
    await db.promise().query('SELECT name, id as value FROM department')
    .then( ([rows,fields]) => {
        if(rows.length === 0){
            console.log('Cannot add a role because no departments are available for the role.');
            return;
        }else{
            //console.log(rows);

            inquirer.prompt([{
                type: 'input',
                message: "What do you want to call the role title to be?",
                name: 'roleName',
        
            },
            {
                type: 'input',
                message: "What is the salary for this role?",
                name: 'salary',
        
            },
            {
                type: 'list',
                message: "What department does this role belong to?",
                name: 'deptID',
                choices: rows
            }])
            .then(answers => {
                console.log(answers);
                db.execute('INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)',
                [answers.roleName, answers.salary, answers.deptID], 
                function(err, results,fields){
                    if(err){
                        console.error(err);
                    }
                    //console.log(results);
                    //console.log(fields);
                });
                db.unprepare();
                init();
            });
        }
    });    
}

async function init(){
    await inquirer.prompt(prompts)
    .then(answers =>{
        //console.log(answers);
        switch(answers.options){
            case 'View all departments':
                console.log('');
                console.log('Viewing all departments:');
                console.log('');
                viewDept();
            break;
            
            case 'View all roles':
                console.log('');
                console.log('Viewing all roles:');
                console.log('');
                viewRole();
            break;

            case 'View all employees':
                console.log('');
                console.log('Viewing all employees:');
                console.log('');
                viewEmployee();
            break;

            case 'View employees by manager':
                console.log('');
                console.log('Viewing employees by manager:');
                console.log('');
                viewByManager();
            break;

            case 'View employees by department':
                console.log('');
                console.log('Viewing employees by department:');
                console.log('');
                viewByDepartment();
            break;

            case 'Add a department':
                console.log('');
                console.log('Adding a department:');
                console.log('');
                addDepartment();
            break;

            case 'Add a role':
                console.log('');
                console.log('Adding a role:');
                console.log('');
                addRole();
            break;

            case 'Add an employee':
                console.log('');
                console.log('viewing roles');
                console.log('');
            break;

            case 'Update an employee role':
                console.log('');
                console.log('viewing roles');
                console.log('');
            break;

            case 'Update employee managers':
                console.log('');
                console.log('viewing roles');
                console.log('');
            break;

            case 'Delete a department':
                console.log('');
                console.log('viewing roles');
                console.log('');
            break;

            case 'Delete a role':
                console.log('');
                console.log('viewing roles');
                console.log('');
            break;

            case 'Delete an employee':
                console.log('');
                console.log('viewing roles');
                console.log('');
            break;

            case 'View the total utilized budget of a department':
                console.log('');
                console.log('viewing roles');
                console.log('');
            break;

            default:
                console.log('');
                console.log('Quiting program');
                db.end();
            break;
        }
    });
}

/* (async () => {
    await init();
  })(); */
console.log('Starting..');
init();