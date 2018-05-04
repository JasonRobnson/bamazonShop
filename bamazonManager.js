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
                // console.log(answers);
            switchSelector(answers);   
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

function  lowInventory(){
    connection.query("SELECT * FROM bamazonShop WHERE stock_quantity < 5", function(err, results){
        if (err) throw err;
        console.table(results)
})
}

function addInventory () {
    inquirer.prompt([{

        name: 'customerSearchId',
        type: 'input',
        message: "Please enter the item_id for the product you wish to add.",
    }
    
    ]).then(answers => {
        console.log(answers);
    });
    // connection.query(`UPDATE bamazonshop SET stock_quantity='${inventoryUpdateValue}' Where item_id='${productID}'`, function(err, results){
// })
 }

 function switchSelector (answers){
     console.log(answers.reportListChoices);
    if (answers.reportListChoices.length > 1){
        for (let i = 0; i < answers.reportListChoices.length; i++){
            switchHandler(answers.reportListChoices[i]);
        }
    } else {
        switchHandler(answers.reportListChoices[0]);
   
        }
}

function switchHandler(answers){
    switch(answers) {
        
        case 'Products for Sale':
        readInventory();
        break;
        
        case 'Low Inventory':
        lowInventory();
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
 