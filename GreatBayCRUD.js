const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Be sure to update with your own MySQL password!
  password: "password",
  database: "great_bayDB",
});

// const readProducts = () => {
//   console.log("Selecting all products...\n");
//   connection.query("SELECT * FROM products", (err, res) => {
//     if (err) throw err;
//     // Log all results of the SELECT statement
//     console.log(res);
//     connection.end();
//   });
// };

// const deleteProduct = () => {
//   console.log("Deleting all strawberry icecream...\n");
//   connection.query(
//     "DELETE FROM products WHERE ?",
//     {
//       flavor: "strawberry",
//     },
//     (err, res) => {
//       if (err) throw err;
//       console.log(`${res.affectedRows} products deleted!\n`);
//       // Call readProducts AFTER the DELETE completes
//       readProducts();
//     }
//   );
// };

// const updateProduct = () => {
//   console.log("Updating all Rocky Road quantities...\n");
//   const query = connection.query(
//     "UPDATE products SET ? WHERE ?",
//     [
//       {
//         quantity: 100,
//       },
//       {
//         flavor: "Rocky Road",
//       },
//     ],
//     (err, res) => {
//       if (err) throw err;
//       console.log(`${res.affectedRows} products updated!\n`);
//       // Call deleteProduct AFTER the UPDATE completes
//       deleteProduct();
//     }
//   );

//   // logs the actual query being run
//   console.log(query.sql);
// };

function init() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "Welcome to the auction! What would you like to do? ",
        name: "init",
        choices: ["POST", "BID", "EXIT"],
      },
    ])
    .then((data) => {
      if (data.init === "POST") {
        postItem();
      } else if (data.init === "BID") {
        bidItem();
      } else if (data.init === "EXIT") {
        connection.end();
        return;
      }
    });
}

const postItem = () => {
  const itemQuest = [
    {
      type: "input",
      message: "Please name your auction item: ",
      name: "item",
    },
    {
      type: "input",
      message: "What is your item's starting bid?: ",
      name: "bid",
    },
  ];

  inquirer.prompt(itemQuest).then((data) => {
    const query = connection.query(
      "INSERT INTO auction SET ?",
      {
        item: data.item,
        start_bid: data.bid,
      },
      (err, res) => {
        if (err) throw err;
        console.log(`\n ${res.affectedRows} product inserted!\n`);
        // Call updateProduct AFTER the INSERT completes
        // logs the actual query being run
        console.log(query.sql);
        console.table(data);
        init();
      }
    );
  });
};

const bidItem = () => {
  connection.query("SELECT * FROM auction", (err, res) => {
    if (err) throw err;

    // Log all results of the SELECT statement
    inquirer
      .prompt([
        {
          type: "list",
          message: "Which item would you like to bid on? ",
          name: "chosenItem",
          choices: [...res.map((auction) => auction.item)],
        },
        {
          type: "input",
          message: "How much do you want to bid?: ",
          name: "bidAmount",
        },
      ])
      .then((answer) => {
        if (answer.bidItem === "POST") {
          postItem();
        } else if (answer.bidItem === "BID") {
          bidItem();
        } else if (answer.bidItem === "EXIT") {
          connection.end();
          return;
        }
      });
    console.log(res);
    connection.end();
  });
};

// Connect to the DB
connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}\n`);
  init();
});
