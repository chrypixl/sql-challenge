const express = require('express');
const inquirer = require('inquirer');
const { Pool } = require('pg');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const pool = new Pool(
  {
    user: 'postgres',
    password: 's+1ckY-k37s',
    host: 'localhost',
    database: 'employees_db'
  },
  console.log(`Connected to the employees_db database.`)
)

pool.connect();


function run() {
inquirer
  .prompt([
    {
      type: "list",
      message: "What would you like to do?",
      name: "choice",
      choices: ["View All Departments", "View All Roles", "View All Employees", "Add Department", "Add Role", "Update Employee Role", "Add Employee"]
    }
  ])
  .then((response) => {
    if (response.choice === 'View All Departments') {
      viewDepartments();
    } else if (response.choice === 'View All Roles') {
      viewRoles();
    } else if (response.choice === 'View All Employees') {
      viewEmployees();
    } else if (response.choice === 'Add Department') {
      addDepartment();
    } else if (response.choice === 'Add Role') {
      addRole();      
    } else if (response.choice === 'Update Employee Role') {
      updateRole();
    } else if (response.choice === 'Add Employee') {
      addEmployee();
    }
  })
};

function viewDepartments() {
  pool.query('SELECT id AS dept_id, dept_name AS dept_name FROM department', function (err, res) {
    console.table(res.rows);
    run();
  })
};

function viewRoles() {
  pool.query('SELECT id AS role_id, title AS role_title, salary AS salary FROM roles', function (err, res) {
    console.table(res.rows);
    run();
  })
};

function viewEmployees() {
  pool.query('SELECT id AS emp_id, first_name AS first_name, last_name AS last_name FROM employees', function (err, res) {
    console.table(res.rows);
    run();
  })
};

function addDepartment() {
  inquirer
  .prompt([
    {
      message: 'What is the name of the department?',
      name: 'name'
    }
  ])
  .then((response) => {
    pool.query('INSERT INTO department(dept_name) VALUES($1)', [response.name], (err, res) => {
      if (err) {
        console.log(err); 
      } else {
        console.table('A new department has been added!');
        run();
      }
    })
  })
};

function addRole() {
  inquirer
  .prompt([
    {
      message: 'What is the role title?',
      name: 'title'
    },
    {
      message: 'What is the salary?',
      name: 'salary'
    },
    {
      message: 'In which department is the role assigned?',
      name: 'dept'
    }
  ])
  .then((response) => {
    pool.query('INSERT INTO roles(title, salary, department_id) VALUES($1, $2, $3)', [response.title, response.salary, response.dept], (err, res) => {
      if (err) {
        console.log(err); 
      } else {
        console.table('A new role has been added!');
        run();
      }
    })
  })
};

function updateRole() {
  pool.query('SELECT id, title FROM roles', (err, {rows}) => { 
    let roles = rows.map(role => ({name: role.title, value: role.id}))
    pool.query('SELECT first_name, last_name, id FROM employees', (err, {rows}) => { 
      let employees = rows.map(employee => ({name: employee.first_name + " " + employee.last_name, value: employee.id}))
      inquirer.prompt([
        {
          type: 'list',
          name: 'employeeUpdate',
          message: "Please choose the employee",
          choices: employees,
        },
        {
          type: 'list',
          name: 'roleUpdate',
          message: "Please choose the employee's updated role",
          choices: roles,
        },
      ])
      .then(res => {
        pool.query("update employees set role_id = $2 where id = $1", [res.roleUpdate, res.employeeUpdate], (err) => {
          if (err)
            throw (err)
          console.log("Your Role has been added");
          run();
        })
      })
    })
  })
};

function addEmployee() {
  inquirer
  .prompt([
    {
      message: 'What is the first name of the employee?',
      name: 'first_name'
    },
    {
      message: 'What is the last name?',
      name: 'last_name'
    },
    {
      message: "What is their manager's id(number)?",
      name: 'manager_id'
    },
    {
      message: 'What is the role id(number)?',
      name: 'role_id'
    }
  ])
  .then((response) => {
    pool.query('INSERT INTO employees(first_name, last_name, manager_id, role_id) VALUES($1, $2, $3, $4)', [response.first_name, response.last_name, response.manager_id, response.role_id], (err, res) => {
      if (err) {
        console.log(err); 
      } else {
        console.log(`${response.first_name} ${response.last_name} has been added to the Employees list!`);
        run();
      }
    })
  })
};

// Keep at bottom of the file.
// Initiate app.
run();  

// Default response for any other requests (Not Found)
app.use((req, res) => {
    res.status(404).end();
  });
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });