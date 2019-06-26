//DEPENDENCIAS
var mysql = require('mysql');
var fs = require('fs');
var express = require('express');
var cors_middleware = require('cors');
var body_parser = require('body-parser');
var path = require("path");

//CREO EL SERVER
var app = express();

//MIDDLEWARE
app.use(cors_middleware());
app.use(body_parser.json());

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type', 'application/JSON');

  next();
}
app.use(allowCrossDomain);

//ARCHIVO DE CLAVES
var archivoSecretos = fs.readFileSync('secretos.json');
var secretos = JSON.parse(archivoSecretos);

//CONEXION CON MYSQL
var connection = mysql.createConnection({
  //Localhost cambiarlo por el endpoint de amazon
  host: 'humanresources.cjo9ammiqi6m.eu-west-2.rds.amazonaws.com',
  user: secretos['mysql_username'],
  password: secretos['mysql_password']
});
connection.connect();

//GET All employees
app.get('/employees', (req, res) => {
  connection.query(
    `SELECT * FROM humanresources.employee`,
    // Poner entre parentesis las columnas y el caso del id utilzar AS
    function(err, rows, fields) {
      if (err) throw err;
      res.send(rows)
    }
  )
})

//GET unique employee
app.get('/employee/:id', (req, res) => {
  connection.query(
    `SELECT * FROM humanresources.employee WHERE employee_id=${req.params.id};`,
    // Poner entre parentesis las columnas y el caso del id utilzar AS
    function(err, rows, fields) {
      if (err) throw err;
      res.send(rows)
    }
  )
})

//POST Create new user
app.post('/create', (req, res) => {
  connection.query(
    `INSERT INTO humanresources.employee (employee_name, employee_salary, employee_age)
VALUES ("${req.body.name}", ${req.body.salary}, ${req.body.age});`,
    function(err, rows, fields) {
      if (err) throw err;
      connection.query(
        `SELECT * FROM humanresources.employee WHERE employee_id=${rows["insertId"]};`,
        function(err, rows, fields) {
          if (err) throw err;
          console.log(rows);
          res.send(rows[0]);
        }
      )
    }
  )
})

//PUT Edit specific user
//TODO Falta obtener el employee object recién modificado
app.put('/update/:id', (req, res) => {
  connection.query(
    `UPDATE humanresources.employee SET employee_name="${req.body.name}", employee_salary=${req.body.salary}, employee_age=${req.body.age} WHERE employee_id=${req.params.id};`,
    function(err, rows, fields) {
      if (err) throw err;
      connection.query(
        `SELECT * FROM humanresources.employee WHERE employee_id=${req.params.id};`,
        function(err, rows, fields) {
          if (err) throw err;
          console.log(rows);
          res.send(rows[0]);
        }
      )
    }
  )
})

//DELETE Eliminate a specific user
app.delete('/delete/:id', (req, res) => {
  connection.query(
    `DELETE FROM humanresources.employee WHERE employee_id=${req.params.id};`,
    function(err, rows, fields) {
      if (err) throw err;
      res.send({
        "success": {
          "text": "successfully! deleted Records"
        }
      });
    }
  )
})

//LISTEN
console.log('Escuchando en puerto 3000');
app.listen(3000);
//
