// Require Statements
const inquirer = require("inquirer");
const mysql = require("mysql");
const logo = require("asciiart-logo");
const cTable = require("console.table");

// Connection to database 
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Milodali2218",
  database: "employees",
});


connection.connect(function (err) {
  if (err) throw err;
  
  init();
});

// Function init() 
function init() {
  const logoText = logo({ name: "Employee Manager" }).render();
  console.log(logoText);
  
  loadPrompts();
}
// Prompts 
function loadPrompts() {
  inquirer
    .prompt({
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: [
        { name: "Update an employee's role", value: "UPDATE_EMPLOYEES" },
        { name: "Add an employee", value: "ADD_EMPLOYEES" },
        { name: "Add a role", value: "ADD_ROLES" },
        { name: "Add a department", value: "ADD_DEPARTMENTS" },
        { name: "Exit" },
      ],
    })
    .then(function (answer) {
      if (answer.choice === "UPDATE_EMPLOYEES") {
        return updateEmployees();
      }
      if (answer.choice === "ADD_EMPLOYEES") {
        return addEmployees();
      }
      if (answer.choice === "ADD_ROLES") {
        return addRoles();
      }
      if (answer.choice === "ADD_DEPARTMENTS") {
        return addDepartments();
      } else {
        connection.end();
      }
    });
}

// Function update employees


function updateEmployees() {
  connection.query(
    "SELECT * FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id",
    function (err, results) {
      console.table(results);
      if (err) throw err;
      inquirer
        .prompt([
          {
            type: "rawlist",
            name: "employee",
            message: "Which employee would you like to update?",
            choices: function () {
              let choiceArray = [];
              for (let i = 0; i < results.length; i++) {
                choiceArray.push(results[i].first_name);
              }
              return choiceArray;
            },
          },
          {
            type: "input",
            name: "role",
            message: "What should their new role be?",
          },
        ])
        .then(function (answer) {
          var newRole;
          for (var i = 0; i < results.length; i++) {
            if (results[i].first_name === answer.employee) {
              newRole = results[i];
            }
          }
          connection.query(
            "UPDATE role SET ? WHERE ?",
            [
              {
                title: answer.role,
              },
              {
                id: newRole.role_id,
              },
            ],
            function (err) {
              if (err) throw err;
              console.log("Employee role successfully updated.");
              loadPrompts();
            }
          );
        });
    }
  );
}


// function to add new employees


function addEmployees() {
  connection.query(
    "SELECT * FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id",
    function (err, results) {
      console.table(results);
      if (err) throw err;
      inquirer
        .prompt([
          {
            type: "input",
            name: "newEmployeeFN",
            message: "What is their first name?",
          },
          {
            type: "input",
            name: "newEmployeeLN",
            message: "What is their last name?",
          },
          {
            type: "rawlist",
            name: "newEmployeeRole",
            message: "What is their title?",
            choices: function () {
              let choiceArray = [];
              for (let i = 0; i < results.length; i++) {
                choiceArray.push(results[i].title);
              }
              return choiceArray;
            },
          },
        ])
        .then(function (answer) {
          var newRole;
          for (var i = 0; i < results.length; i++) {
            if (results[i].title === answer.newEmployeeRole) {
              newRole = results[i];
            }
          }
          connection.query(
            "INSERT INTO employee SET ?",
            {
              first_name: answer.newEmployeeFN,
              last_name: answer.newEmployeeLN,
              role_id: newRole.role_id,
            },
            function (err) {
              if (err) throw err;
              console.log("New employee added!");
              loadPrompts();
            }
          );
        });
    }
  );
}

// Function to add role 



function addRoles() {
  connection.query(
    "SELECT * FROM role INNER JOIN department ON role.department_id = department.id",
    function (err, results) {
      console.table(results);
      if (err) throw err;
      inquirer
        .prompt([
          {
            type: "input",
            name: "newRoleTitle",
            message: "What is the title of the new role?",
          },
          {
            type: "input",
            name: "newRoleSalary",
            message: "How much does this new role pay?",
          },
          {
            type: "input",
            name: "newRoleDepartment",
            message: "What department is this role in?",
          },
        ])
        .then(function (answer) {
          var newRole;
          for (var i = 0; i < results.length; i++) {
            if (results[i].name === answer.newRoleDepartment) {
              newRole = results[i];
            }
          }
          connection.query(
            "INSERT INTO role SET ?",
            {
              title: answer.newRoleTitle,
              salary: answer.newRoleSalary,
              department_id: newRole.id,
            },
            function (err) {
              if (err) throw err;
              console.log("New role added!");
              loadPrompts();
            }
          );
        });
    }
  );
}

// Functionto add department 


function addDepartments() {
  connection.query("SELECT * FROM department", function (err, results) {
    console.table(results);
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "input",
          name: "newDepartment",
          message: "What is the name of the new department?",
        },
      ])
      .then(function (answer) {
        connection.query(
          "INSERT INTO department SET ?",
          {
            name: answer.newDepartment,
          },
          function (err) {
            if (err) throw err;
            console.log("New department added!");
            loadPrompts();
          }
        );
      });
  });
}
