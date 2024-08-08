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
      choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department"]
    }
  ])
  .then((response) => {
    if (response.choice === 'View All Departments') {
      pool.query('SELECT id AS dept_id, name AS dept_name FROM department', function (err, res) {console.table(res.rows); run()})
    } else if (response.choice === 'View All Roles') {
      pool.query('SELECT * FROM role', function (err, res) {console.table(res.rows); run()})
    } else if (response.choice === 'View All Employees') {
      pool.query('SELECT * FROM employee', function (err, res) {console.table(res.rows); run()})
    } else if (response.choice === 'Add Department') {
      inquirer
        .prompt([
          {
            message: 'What is the name of the department?',
            name: 'departmentName'
          }
        ])
        .then((response) => {
          pool.query('INSERT INTO department(name) VALUES($1)', [response.departmentName], (err, res) => {
            if (err) {
              console.log(err); run()
            } else {
              console.table('A new department has been added!'); run()
            }
          })
        })
    } else if (response.choice === 'Add Role') {
        inquirer
        .prompt([
        {
          message: 'What is the name of the role?',
          name: 'roleName'
        }
      ])
      .then((response) => {
        pool.query('INSERT INTO role(name) VALUES($1)', [response.roleName], (err, res) => {
          if (err) {
            console.log(err); run()
          } else {
            console.table('A new role has been added!'); run()
          }
        })
      })      
    }
    
  })
};

run();
  

// Keep at bottom of the file. Default response for any other requests (Not Found)
app.use((req, res) => {
    res.status(404).end();
  });
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });