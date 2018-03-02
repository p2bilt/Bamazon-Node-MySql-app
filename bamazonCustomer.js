var mysql = require("mysql");
var inquirer = require("inquirer");
// var Table = require('cli-table2');
var Table = require('easy-table');

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "3mca0djwbgdwnd",
    database: "bamazon_db"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});

// function which prompts the user for what action they should take
function start() {

    console.log('\n\n*****************************************************************');
    console.log('                        Welcome BAMAZON                                ');
    console.log('*****************************************************************');
    console.log('             Home of the Greatest Products on Earth               \n\n');


    displayInventory();

}


function selectProduct(results) {

    inquirer
        .prompt([{
                name: "item",
                type: "input",
                message: "What product would you like to buy? Use the ID number to choose:"
            },
            {
                name: "quantity",
                type: "input",
                message: "How many would you like to purchase?"
            }
        ])
        .then(function(answer) {

            var chosenItem;

            for (var i = 0; i < results.length; i++) {
                if (results[i].id === parseInt(answer.item)) {
                    chosenItem = results[i];

                }
            }

            var newQuantity = (chosenItem.stock_quantity - answer.quantity);


            if (newQuantity < 0) {

                console.log("\nWe don't have enough units of the item you've chosen in stock!\n");
                console.log("Perhaps you'd like to purchase something else, or a smaller quantity.\n");

                continueQ();

            } else if (newQuantity < 5) {

                console.log("\nWe have a total of " + chosenItem.stock_quantity + " units of the item you've chosen in stock.");
                console.log("Stock is getting low! Buy now while you still can!\n");
                purchaseItem(answer, chosenItem, newQuantity);

            } else {

                console.log("\nWe have plenty of your item in stock, a total of " + chosenItem.stock_quantity + " units.\n");
                purchaseItem(answer, chosenItem, newQuantity);

            }

        });
}


function purchaseItem(answer, chosenItem, newQuantity) {

    var totalPrice = (answer.quantity * chosenItem.price);

    inquirer
        .prompt([{

            type: "confirm",
            name: "buyConfirm",
            message: "Are you sure you want to buy " + answer.quantity + " " + chosenItem.product_name + "(s), at a total cost of $" + totalPrice.toFixed(2) + "?",
            default: true
        }])
        .then(function(buyOrNot) {

            if (buyOrNot.buyConfirm) {

                var msg = "You've just purchased " + answer.quantity + " " + chosenItem.product_name + "(s), and $" + totalPrice.toFixed(2) + " has been charged to your account.";
                console.log("\n" + msg);
                console.log(msg.replace(/./g, '-') + "\n");

                if (newQuantity <= 0) {

                    console.log("\nYou've sold us out of " + chosenItem.product_name + "!\n");
                    console.log("Give us some time to restock, and come back for more.\n");

                } else if (newQuantity < 5) {

                    console.log("There are only " + newQuantity + " units of " + chosenItem.product_name + " left, tell all your friends to buy now!\n");

                } else {

                    console.log("\nAfter your purchase, our stock now reflects a total of " + newQuantity + " units.\n");

                }

                // actually update the database to reflect purchase of x number of units
                connection.query(
                    "UPDATE products SET ? WHERE ?", [{
                            stock_quantity: newQuantity
                        },
                        {
                            id: chosenItem.id
                        }
                    ],
                    function(error) {
                        if (error) throw err;

                        continueQ();
                    }
                );
            } else {
                console.log("\nOK; order cancelled. Perhaps you'd like to purchase something else.\n");

                continueQ();
            }
        });
}



// displayInventory will retrieve the current inventory from the database and output it to the console
function displayInventory() {

    // Construct the db query string
    queryStr = 'SELECT * FROM products';

    var t = new Table();

    // Make the db query
    connection.query(queryStr, function(err, data) {
        if (err) throw err;


        console.log('CURRENT INVENTORY: ');
        console.log("-----------------------------------------------------------------\n");

        data.forEach(function(product) {
            t.cell('Id', product.id);
            t.cell('Product', product.product_name);
            t.cell('Price, USD', product.price, Table.number(2));
            t.cell('Department', product.department_name);
            t.cell('Quantity', product.stock_quantity);
            t.newRow();
        });

        console.log(t.toString());

        // Below is a looped version that doesn't require easy-table include

        // var strOut = '';
        // for (var i = 0; i < data.length; i++) {
        // strOut = '';
        // strOut += '#' + data[i].id + ' - ';
        // strOut += data[i].product_name + '  --  ';
        // strOut += '$' + data[i].price.toFixed(2) + '';
        // strOut += '  --   (' + data[i].department_name + ' Dept.)\n';

        // console.log(strOut);

        // }

        // console.log("------------------------------------------------------------------\n");

        //Prompt the user for item/quantity they would like to purchase

        selectProduct(data);


    });
}

function continueQ() {

    inquirer
        .prompt([{

            type: "confirm",
            name: "goConfirm",
            message: "Would you like to continue shopping?",
            default: true
        }])
        .then(function(continueOrNot) {

            if (continueOrNot.goConfirm) {

                start();

            } else {
                console.log("\nGoodbye! Shop again soon!\n");

                connection.end();
                process.exit(1);
            }
        });

}
