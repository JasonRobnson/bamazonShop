let mysql = require("mysql");
let inquirer = require("inquirer");
require("console.table");


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
connection.connect(function (err) {
    console.log("You're connected as id " + connection.threadId);
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();



});


// Start function that will initiate the start of code, will log DB resluts
function start() {
    connection.query("SELECT * FROM bamazonShop", function (err, results) {
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
    }).then(function (answer) {
        let customerProductID = answer.customerSearchId;
        inquirer.prompt({
            name: 'customerProductQuantity',
            type: 'input',
            message: "How many units of this product would you like to buy?",
        }).then(function (answer) {
            let customerProductQuant = answer.customerProductQuantity;
            itemIdValidator(customerProductID, customerProductQuant);
        })

    })
}

function checkInventory(productID, productQuant) {

    let IntegerProductQuant = parseInt(productQuant);

    connection.query(`SELECT * FROM  bamazonShop WHERE item_id = '${productID}'`, function (err, results) {
        if (err) throw err;

        //if statements test product order quantity against customer quantity
        if (IntegerProductQuant > parseInt(results[0].stock_quantity)) {
            console.log("Sorry we don't have enough of that product in Stock. Please Try Back Later");
            endOrder();
        } else {
            if (IntegerProductQuant < 0) {
                console.log("Sorry orders must be for 1 or more items.")
                endOrder();
            } else {
                //does basic arithmitc and sets stock quantity to a new variable
                let inventoryUpdateValue = (parseInt(results[0].stock_quantity)) - productQuant
                connection.query(`UPDATE bamazonshop SET stock_quantity='${inventoryUpdateValue}' Where item_id='${productID}'`, function (err, results) {
                    productCostPrice(productID, productQuant);

                })
            }
        }
    })
}




function productCostPrice(productID, productQuant) {
    connection.query(`SELECT * FROM  bamazonShop WHERE item_id = '${productID}'`, function (err, results) {
        if (err) throw err;
        console.log(`Your ` + results[0].product_name + ` cost $` + results[0].price + ' per item.');
        let customerPrice = parseInt(productQuant) * parseInt(results[0].price);
        console.log(`Your oder total is $` + customerPrice);
        endOrder();
    })

}

function itemIdValidator(productID, productQuant) {
    connection.query('SELECT item_id FROM bamazonshop ORDER by(item_id+0) DESC', function (err, results) {
        if (err) throw err;
        let intProductID = parseInt(productID);
        if (intProductID > parseInt(results[0].item_id)) {
            console.log("Please chose an Item_Id listed on the table...")
            endOrder();

        } else {
            if (intProductID < parseInt(results[0].item_id)) {
                checkInventory(productID, productQuant);

            }
        

        }

    })
}


function endOrder() {
    connection.end();
};