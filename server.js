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

async function init(){
    
    
    
    await inquirer.prompt(prompts)
    .then(answers =>{
        console.log(answers);
        switch(answers.options){
            case 'View all departments':
                console.log('viewing all departments:');
                viewDept();
            break;
            
            case 'View all roles':
                console.log('viewing roles');
                init();
            break;

            case 'View all employees':
                console.log('viewing roles');
            break;

            case 'View employees by manager':
                console.log('viewing roles');
            break;

            case 'View employees by department':
                console.log('viewing roles');
            break;

            case 'Add a department':
                console.log('viewing roles');
            break;

            case 'Add a role':
                console.log('viewing roles');
            break;

            case 'Add an employee':
                console.log('viewing roles');
            break;

            case 'Update an employee role':
                console.log('viewing roles');
            break;

            case 'Update employee managers':
                console.log('viewing roles');
            break;

            case 'Delete a department':
                console.log('viewing roles');
            break;

            case 'Delete a role':
                console.log('viewing roles');
            break;

            case 'Delete an employee':
                console.log('viewing roles');
            break;

            case 'View the total utilized budget of a department':
                console.log('viewing roles');
            break;

            default:
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