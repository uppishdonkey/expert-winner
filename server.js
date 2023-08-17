const mysql = require('mysql2/promise');
const inquirer = require('inquirer');



async function mainApp() {
  console.log('Welcome to the Employee Database Management System');

  try {
    // Connect to the database using the promise-based API
    const db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Call73dissolve',
    database: 'employees_db'
  });
    console.log('Connected to the database.');

    // Start the application logic
    await displayMainMenu(db);

    await db.end();
    console.log('Database connection closed.');
  } catch (err) {
    console.error('Error:', err);
  }
}

async function displayMainMenu(db) {
    try {
    const { action } = await inquirer.prompt([
        {
            name: 'action',
            message: 'What would you like to do?',
            type: 'list',
            choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Exit'
            ]
        }
    ]);

        console.clear();
        switch (action) {
            case 'View all departments':
            const departments = await db.query('SELECT * FROM department');
            console.table(departments[0]);
            break;
            case 'View all roles':
            const roles = await db.query('SELECT * FROM roles');
            console.table(roles[0]);
            break;
            case 'View all employees':
            const employees = await db.query('SELECT * FROM employee');
            console.table(employees[0]);
            break;
    
    
            case 'Add a department':
            const departmentName = await inquirer.prompt([
                {
                type: 'input',
                name: 'name',
                message: 'Enter the department name:'
                }
            ]);
            await db.query('INSERT INTO department (name) VALUES (?)', [departmentName.name]);
            console.log('Department added successfully.');
            break;
    
    
            case 'Add a role':
            const roleDetails = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: 'Enter the role title:'
                },
                {
                    type: 'number',
                    name: 'salary',
                    message: 'Enter the role salary:'
                },
                {
                    type: 'number',
                    name: 'department_id',
                    message: 'Enter the department ID for this role:(Must match an existing ID)'
                }
            ]);
            await db.query('INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)', [roleDetails.title, roleDetails.salary, roleDetails.department_id]);
            console.log('Role added successfully.');
            break;
    
    
            case 'Add an employee':
            const employeeDetails = await inquirer.prompt([
            {
                type: 'input',
                name: 'first_name',
                message: 'Enter the employee\'s first name:'
            },
            {
                type: 'input',
                name: 'last_name',
                message: 'Enter the employee\'s last name:'
            },
            {
                type: 'number',
                name: 'roles_id',
                message: 'Enter the role ID for this employee:'
            },
            {
                type: 'number',
                name: 'manager_id',
                message: 'Enter the manager ID for this employee:'
            }
            ]);
            await db.query('INSERT INTO employee (first_name, last_name, roles_id, manager_id) VALUES (?, ?, ?, ?)', [employeeDetails.first_name, employeeDetails.last_name, employeeDetails.roles_id, employeeDetails.manager_id]);
            console.log('Employee added successfully.');
            break;
    
            
            case 'Update an employee role':
            const updateDetails = await inquirer.prompt([
                {
                type: 'number',
                name: 'new_role_id',
                message: 'Enter the new role ID for this employee:'
                },
                {
                type: 'number',
                name: 'new_employee_id',
                message: 'Enter the new employee ID for this employee:'
                }
            ]);
            await db.query('UPDATE employee SET roles_id = ? WHERE id = ?', [updateDetails.new_role_id, updateDetails.new_employee_id]);
            console.log('Employee role updated successfully.');
            break;
                
            
            case 'Exit':
            console.log('Exiting the application.');
            break;
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

mainApp();