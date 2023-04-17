const mainMenu = [
    {
        message: "What action would you like to perform?",
        name:"options",
        type:'list',
        choices: ["View all departments", "View all roles", "View all employees", "View employees by manager", "View employees by department", "Add a department", "Add a role", "Add an employee", "Update an employee role", "Update employee managers", "Delete a department", "Delete a role", "Delete an employee", "View the total utilized budget of a department", "Quit"],
        loop: true,
        waitUserInput: true
    }
]

module.exports = (mainMenu);