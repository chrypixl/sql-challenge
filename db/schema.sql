DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

\c employees_db;

CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    dept_name VARCHAR(30) UNIQUE NOT NULL
);


CREATE TABLE roles (
id SERIAL PRIMARY KEY,
title VARCHAR(30) UNIQUE NOT NULL,
salary DECIMAL NOT NULL,
department_id INTEGER NOT NULL,
FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employees (
id SERIAL PRIMARY KEY,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
manager_id INTEGER,
FOREIGN KEY (manager_id) REFERENCES employees(id),
role_id INTEGER NOT NULL,
FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL
);
