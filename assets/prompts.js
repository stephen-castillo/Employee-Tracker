const mainMenu = [
    {
        message: "What action would you like to perform?",
        name:"options",
        type:'list',
        choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role", "Quit"],
        loop: true,
        waitUserInput: true
    }
]

module.exports = (mainMenu);