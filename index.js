const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'Call73dissolve',
    database: 'employee_db',
  }
);

function init() {
  inquirer.prompt([
    {
      type: 'list',
      message: 'What would you like to do?',
      choices: ["View all departments", "View all roles", "View all employees", "Add department", "Add role", "Add employee", "Update employee role"],
      name: 'userChoice',
    }
  ])
    .then((response) => {
      console.log(response);

      if (response.userChoice === "View all departments") {
        viewDepartments();
      }

      else if (response.userChoice === "View all roles") {
        viewRoles();
      }
      else if (response.userChoice === "View all employees") {
        viewEmployees();
      }
      else if (response.userChoice === "Add department") {
        addDepartment();
      }
      else if (response.userChoice === "Add role") {
        addRole();
      }
      else if (response.userChoice === "Add employee") {
        addEmployee();
      }
      else if (response.userChoice === "Update employee role") {
        updateRole();
      }
    });

  function viewDepartments() {
    db.query('SELECT * FROM department', function (err, results) {
      console.table(results)
      init();
    });
  }

  function viewRoles() {
    db.query('SELECT role.id, role.title, role.salary, department.name FROM role LEFT JOIN department ON role.department_id = department.id', function (err, results) {
      console.table(results)
      init();
    });
  }

  function viewEmployees() {
    const sql = `SELECT employee.id, employee.first_name AS "first name", employee.last_name 
                    AS "last name", role.title, department.name AS department, role.salary, 
                    concat(manager.first_name, " ", manager.last_name) AS manager
                    FROM employee
                    LEFT JOIN role
                    ON employee.role_id = role.id
                    LEFT JOIN department
                    ON role.department_id = department.id
                    LEFT JOIN employee manager
                    ON manager.id = employee.manager_id`
    db.query(sql, function (err, results) {
      console.table(results)
      init();
    });
  }
};

init();

function addDepartment() {
  inquirer.prompt([{
    type: "input",
    name: "department",
    message: "What is the name of the new department?"
  }])
    .then(response => {
      db.query("Insert into department(name) values (?)", [response.department], function (err, results) {
        console.log("New department added!")
        init();
      })
    })
};

function addRole() {
  db.query("SELECT id as value, name as name FROM department", function (err, results) {
    inquirer.prompt([{
      type: "input",
      name: "role",
      message: "What is the name of the new role?"
    }, {
      type: "input",
      name: "salary",
      message: "What is the salary of the new role?"
    }, {
      type: "list",
      name: "departmentId",
      choices: results,
      message: "Please choose the department"
    }
    ])
      .then(response => {
        db.query("Insert into role (title, salary, department_id) values (?, ?, ?)", [response.role, response.salary, response.departmentId], function (err, results) {
          console.log("New role added!")
          init();
        })
      }
      )
  })

};

function addEmployee() {
  db.query("SELECT id as value, title as name FROM role", function (err, results) {
    const roles = results;
    db.query("SELECT id as value, concat(first_name, ' ', last_name) as name from employee", function (err, res) {
      let managers = res;
      managers = [{ value: null, name: "no manager" }, ...managers]
      inquirer.prompt([{
        type: "input",
        name: "firstName",
        message: "What is the employee's first name?"
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the employee's last name?"
      },
      {
        type: "list",
        name: "manager",
        message: "Who is the employee's manager?",
        choices: managers
      },
      {
        type: "list",
        name: "role",
        message: "What role is the employee serving as?",
        choices: roles
      }
      ])
        .then(response => {
          db.query("Insert into employee (first_name, last_name, role_id, manager_id) values (?, ?, ?, ?)", [response.firstName, response.lastName, response.role, response.manager], function (err, res) {
            console.log("New employee added!");
            init();
          })
        }
        )
    })
  })
};

function updateRole() {
  db.query("SELECT id as value, title as name FROM role", function (err, results) {
    const roles = results;
    db.query("SELECT id as value, concat(first_name, ' ', last_name) as name from employee", function (err, res) {
      let employees = res;
      inquirer.prompt([{
        type: "list",
        name: "employee",
        message: "Who is the employee?",
        choices: employees
      },
      {
        type: "list",
        name: "role",
        message: "What new role does the employee have?",
        choices: roles
      }])
        .then(response => {
          db.query("UPDATE employee SET role_id = (?) WHERE id = (?)", [response.role, response.employee], function (err, res) {
            console.log("Employee updated!");
            init();
          })
        })
    })
  })
};