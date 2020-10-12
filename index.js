
// Require statements 
const inquirer = require("inquirer");
const mysql = require("mysql");


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Milodali2218",
    database: "employe"
});

// function init 
function init () {
    const logoText = logo({ name: "Employee Manager" }).render();
    console.log(logoText );

    // Load our prompts
loadPrompts();
}

function loadPrompts() {
    inquirer.prompt({
        type: "list",
        name: "choices",
        message:"What would you like to do?",
        choices: [{
            name: "View all Employees",
            value: "VIEW_EMPLOYEES"
        }]
    })
    // switc statements
    switch (choices){
        case "VIEW_EMPLOYEES":
       viewEmployees();
       break;

    }
}