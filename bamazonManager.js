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
  })

  function start() {
    inquirer.prompt([
        {
            type: 'checkbox',
            message: 'Greetings Manager,\nWhich report would you like to view?\n\n',
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
        if(results[0] === undefined){
            console.log("You do not have any low inventory sir.")
        } else {
            console.table(results);
        }
})
}

function addInventory () {
   
    inquirer.prompt([{

        name: 'inventoryId',
        type: 'input',
        message: "Please enter the item_id for the product you wish to add.\n\n",
    },
    {
       name: 'inventoryQuantity',
       type: 'input',
       message: "Please enter the quantity number for products you would like to add.\n"
    }
    
    ]).then(answers => {
        let inventoryID = answers.inventoryId;
        let updateQuantity = parseInt(answers.inventoryQuantity);
        connection.query(`Select * from bamazonshop where item_id = ${inventoryID}`, function(err, results){
            if (err) throw err;
        let existingQuantity = parseInt(results[0].stock_quantity);
        let newInventoryQuantity = updateQuantity + existingQuantity;
                console.log(newInventoryQuantity)
                connection.query(`UPDATE bamazonshop SET stock_quantity='${newInventoryQuantity}' Where item_id='${inventoryID}'`, function(err, results){
                    if (err) throw err;
                    readInventory();
                
                })
             })
    });
}
    
function addNewProduct() {
    inquirer.prompt([
    {
        name: 'newProductDepartment',
        type: 'input',
        message: "Please enter the Department name that your new product will be listed too.\n\n",
    },
    {
        name: 'newProductName',
        type: 'input',
        message: "Please enter the Name of the new product that you wish to add.\n\n",
    },
    {
       name: 'newProductPrice',
       type: 'input',
       message: "Please enter the Price for the new product.\n"
    },
    {
       name: 'newProductQuantity',
       type: 'input',
       message: "Please enter the stock quantity for the new product.\n"
    }
    
    ]).then(answers => {
        let newProductDept = answers.newProductDepartment.toLowerCase();
        let newProductName = answers.newProductName.toLowerCase();
        let newProductPrice = answers.newProductPrice;
        let newProductQuantity = answers.newProductQuantity;
        connection.query(`INSERT INTO bamazonshop (product_name, department_name, price, stock_quantity) VALUES("${newProductName}","${newProductDept}",${newProductPrice},${newProductQuantity})`, function(err, results){
            if (err) throw err;
            readInventory();
        });
    })


};
  
 

 function switchSelector (answers){
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
        end();
            break;
        
        case 'Low Inventory':
        lowInventory();
        end();
            break;
       
        case 'Add to existing Inventory':
        readInventory();
        setTimeout(addInventory, 1500);
    
        
            break;
       
        case 'Add New Product':
        addNewProduct();

            break;
    }

}
 