let mysql = require("mysql");
let inquirer = require("inquirer")
require("console.table")

// create DB, then connect DB information for the sql database
let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "",
    database: "bamazon_DB"
  });

  connection.connect(function(err) {
      console.log("You're connected as id " + connection.threadId);
      if (err) throw err
      start();
      end();
  })

  function start() {
    inquirer.prompt([
        {
            type: 'checkbox',
            message: 'Greetings Manager, \nWhich department reports would you like to view?',
            name: 'reportListChoices',
            choices:[
                new inquirer.Separator(' = Inventory = '),
                {
                    name: 'Products for Sale'
                },
                {
                    name: 'Low Inventory'
                },
                {
                    name: 'Add to existing Inventory'
                },
                {
                    name: 'Add New Product'
                },
            
            ],
            validate: function(answer){
                if (answer.length < 1){
                    return 'You must pick at least one report.';
                }
                return true; 
            }
        }
    ]).then(answers => {
        // console.log(answers.reportListChoices[0]);
        console.log(JSON.stringify(answers, null, '  '));        
    });
}

  function end(){
      connection.end();
  }
