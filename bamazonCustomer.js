let mysql = require("mysql");
let inquirer = require("inquirer");
require ("console.table");


// create the connection information for the sql database
let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "",
    database: "bamazon_DB"
  });


  // connect to the mysql server and sql database
connection.connect(function(err) {
    console.log("You're connected as id " + connection.threadId);
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
 
connection.end();
});


// Start function that will initiate the start of code, will log DB resluts
function start(){
    connection.query("SELECT * FROM bamazonShop", function(err, results){
        if (err) throw err;
        console.table(results);
        customerSearch();
          })
   
}

function customerSearch() {
    inquirer.prompt({
        name: 'customerSearchId',
        type: 'input',
        message: "What is the ID of the product that you're looking ot buy?",
    }).then(function(answer){
        console.log(answer.customerSearchId);
        return answer.customerSearchId
    })


}
