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
        let customerProductID = answer.customerSearchId;
        inquirer.prompt({
            name: 'customerProductQuantity',
            type: 'input',
            message: "How many units of this product would you like to buy?",
        }).then(function(answer){
            let customerProductQuant = answer.customerProductQuantity;
            console.log(customerProductID);
            console.log(customerProductQuant);
            checkInventory(customerProductID, customerProductQuant);
            // deleteProductDB(customerProductID, customerProductQuant);
            

        })

    })


}

function checkInventory (productID, productQuant) {
    connection.query(`SELECT * FROM  bamazonShop WHERE item_id = '${productID}'`, function(err, results){
        if (err) throw err;
            console.log(results[0].stock_quantity);
            // console.log(productQuant);
        if (productQuant > parseInt(results[0].stock_quantity)){
             console.log("Sorry we don't have that product in Stock. Please Try Back Later");
             endOrder();
            // endOrder();
            // console.log(results[0].RowDataPacket)
            // console.log(results[0].rowdatapacket);
             // console.log(results[0].RowDataPacket);
         } else {

            }
           
        })
    
}

function endOrder(){
    connection.end();
}

// function deleteProductDB(productID, productQuant) {
//     connection.query(`SELECT ${productID}  FROM bamazonshop'`, function(err, results){
//         if (err) throw err;
//         console.log(results);
// })
// }

// UPDATE bamazonshop SET quantity=$ WHERE prodcut_id='$'
