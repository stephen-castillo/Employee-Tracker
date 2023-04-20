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
            });
        }
    });    
}

async function addEmployee(){
    var roleOptions = [];
    
    await db.promise().query('SELECT title, id as value FROM roles')
    .then( ([rows,fields]) => {
        if(rows.length === 0){
            console.log('Cannot add a employee because no roles are available for the employee.');
            return;
        }else{
            roleOptions = rows;
            return roleOptions;
        }
    });

    await db.promise().query("SELECT CONCAT(first_name, ' ', last_name) as name, id as value FROM employees")
    .then( ([rows,fields]) => {
        if(rows.length === 0){
            console.log('Cannot add a manager for the employee because no employees are available for the role.');
            return;
        }else{
            //console.log(rows);
            $noneManager = {name: "None", value: null}

            rows.push($noneManager);
            
            inquirer.prompt([{
                type: 'input',
                message: "What is the employee's first name?",
                name: 'firstName',
        
            },
            {
                type: 'input',
                message: "What is the employee's last name?",
                name: 'lastName',
        
            },
            {
                type: 'list',
                message: "What role does this employee have?",
                name: 'roleID',
                choices: roleOptions
            },
            {
                type: 'list',
                message: "Who is this employee's supervisor",
                name: 'managerID',
                choices: rows
            }])
            .then(answers => {
                console.log(answers);
                return;
                db.execute('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)',
                [answers.firstName, answers.lastName, answers.roleID, answer.managerID], 
                function(err, results,fields){
                    if(err){
                        console.error(err);
                    }
                    //console.log(results);
                    //console.log(fields);
                });
                db.unprepare();
            });
        }
    });    
}

async function init() {
    let keepPrompting = true;
  
    while (keepPrompting) {
      const answers = await inquirer.prompt(prompts);
  
        switch (answers.options) {
            case 'View all departments':
                console.log('Viewing all departments:');
                console.log('');
                await viewDept();
                console.log('Press any arrow key to continue.');
                break;
    
            case 'View all roles':
                console.log('Viewing all roles:');
                console.log('');
                await viewRole();
                console.log('Press any arrow key to continue.');
                break;
    
            case 'View all employees':
                console.log('Viewing all employees:');
                console.log('');
                await viewEmployee();
                console.log('Press any arrow key to continue.');
                break;
    
            case 'View employees by manager':
                console.log('Viewing employees by manager:');
                console.log('');
                await viewByManager();
                console.log('Press any arrow key to continue.');
                break;
    
            case 'View employees by department':
                console.log('Viewing employees by department:');
                console.log('');
                await viewByDepartment();
                console.log('Press any arrow key to continue.');
                break;
    
            case 'Add a department':
                console.log('Adding a department:');
                console.log('');
                await addDepartment();
                console.log('Press any arrow key to continue.');
                break;
    
            case 'Add a role':
                console.log('Adding a role:');
                console.log('');
                await addRole();
                console.log('Press any arrow key to continue.');
                break;
    
            case 'Add an employee':
                console.log('Adding an employee:');
                console.log('');
                await addEmployee();
                console.log('Press any arrow key to continue.');
                break;
    
            case 'Update an employee role':
                console.log('Updating an employee role:');
                console.log('');
                await updateEmployeeRole();
                console.log('Press any arrow key to continue.');
                break;
    
            case 'Update employee managers':
                console.log('Updating employee managers:');
                console.log('');
                await updateEmployeeManager();
                console.log('Press any arrow key to continue.');
                break;
    
            case 'Delete a department':
                console.log('Deleting a department:');
                console.log('');
                await deleteDepartment();
                console.log('Press any arrow key to continue.');
                break;
    
            case 'Delete a role':
                console.log('Deleting a role:');
                console.log('');
                await deleteRole();
                console.log('Press any arrow key to continue.');
                break;
    
            case 'Delete an employee':
                console.log('Deleting an employee:');
                console.log('');
                await deleteEmployee();
                console.log('Press any arrow key to continue.');
                break;
    
            case 'View the total utilized budget of a department':
                console.log('Viewing the total utilized budget of a department:');
                console.log('');
                await viewBudget();
                console.log('Press any arrow key to continue.');
                break;
    
            case 'Quit program':
                console.log('Quiting program');
                db.end();
                keepPrompting = false;
                break;
    
            default:
                console.log('Invalid option selected. Please try again.');
                break;
        }
    }
}
  

console.log('Starting..');
(async () => {
    await init();
  })();