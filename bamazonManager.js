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
    //   end();
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
                
                    switch(answers.reportListChoices[i]) {
                        
                        case 'Products for Sale':
                        readInventory();
                        break;
                        
                        case 'Low Inventory':
                        console.log("Lets see that Low Inventory!")
                        connection.query("SELECT * FROM bamazonShop WHERE stock_quantity < 5", function(err, results){
                            if (err) throw err;
                            console.table(results)
                        });
                        break;
                       
                        case 'Add to existing Inventory':
                        readInventory();
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

function readInventory (){
    connection.query("SELECT * FROM bamazonShop", function(err, results){
        if (err) throw err;
        console.table(results)
})
}

// function addInventory () {
//     inquirer.prompt([{

//         name: 'customerSearchId',
//         type: 'input',
//         message: "What is the ID of the product that you're looking ot buy?",
//     }
    
//     ]).then(answers => {
//         // Use user feedback for... whatever!!
//     });
//     connection.query(`UPDATE bamazonshop SET stock_quantity='${inventoryUpdateValue}' Where item_id='${productID}'`, function(err, results){
// })
// }