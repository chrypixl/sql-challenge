const express = require('express');
const { Pool } = require('pg');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const pool = new Pool(
  {
    // TODO: Enter PostgreSQL username
    user: 'postgres',
    // TODO: Enter PostgreSQL password
    password: 's+1ckY-k37s',
    host: 'localhost',
    database: 'employees_db'
  },
  console.log(`Connected to the employees_db database.`)
)

pool.connect();



// Keep at bottom of the file. Default response for any other requests (Not Found)
app.use((req, res) => {
    res.status(404).end();
  });
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });