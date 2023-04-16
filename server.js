const inquirer = require('inquirer');
const mysql = require('mysql2');
const ctable = require('console.table');
const prompts = require('./assets/prompts');

require('dotenv').config();

function init(){
    console.log('Starting..');
    inquirer.prompt(prompts)
    .then(answers =>{
        console.log(answers);
        switch(answers.options){
            case 'View all roles':
                console.log('viewing roles');
            break;

            default:
                console.log('Quiting program');
                return;
        }
    } );   
}

init();