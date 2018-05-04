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
            message: 'Greetings Manager,\nWhich department reports would you like to view?',
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

        // think a potentional function for this if statement 
        if (answers.reportListChoices.length > 1) {
            for (let i = 0; i < answers.reportListChoices.length; i++){
                    console.log(answers.reportListChoices[i]);

                    switch(answers.reportListChoices[i]) {
                        
                        case 'Products for Sale':
                        console.log("Let's see the Product Sales!")
                        break;
                        
                        case 'Low Inventory':
                        console.log("Lets see that Low Inventory!")
                        break;
                       
                        case 'Add to existing Inventory':
                        console.log("Let's add to the existing Inventory!")
                        break;
                       
                        case 'Add New Product':
                        console.log("Let's add New Products!")
                        break;
                    }
            }
        }       
    });
}

  function end(){
      connection.end();
  }
