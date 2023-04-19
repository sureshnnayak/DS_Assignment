const { time } = require("console");
var net = require("net");
const axios = require("axios").default;

const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

var uname = null;

const {
  createAcccountMSG,
  getLoginMSG,
  getLogoutMSG,
  getSellerRatingMSG,
  getPutItemForSaleMSG,
  getRemoveItemFromSaleMSG,
  displayItemsForSaleMSG,
  getDisplayItemsForSaleMSG,
} = require("./messages");

const printOptions = () => {
  console.log("Please select an option:");
  console.log("1. Create an account");
  console.log("2. Login");
  console.log("3. Logout");
  console.log("4. Get seller rating");
  console.log("5. Put an item for sale");
  console.log("6. Remove an item from sale");
  console.log("7. Display items for sale");
  // console.log("8. Run Average Response Time Test");
  // console.log("9. Run Average Throughput Test");

  rl.question("Enter your option: ", (option) => {
    switch (option) {
      case "1":
        console.log("Create an account");
        rl.question("Enter username: ", (username) => {
          rl.question("Enter password: ", (password) => {
            let data = {
              username: username,
              password: password,
              category: "seller",
            };

            axios
              .post("http://localhost:1338/createAccount", data)
              .then(function (response) {
                console.log(response.data);
                printOptions();
              })
              .catch(function (error) {
                console.log(error);
              });
          });
        });
        break;

      case "2":
        console.log("Login");
        rl.question("Enter username: ", (username) => {
          rl.question("Enter password: ", (password) => {
            let data = {
              username: username,
              password: password,
            };
            axios
              .post("http://localhost:1338/login", data)
              .then(function (response) {
                console.log(response.data);
                uname = response.data.userID;
                printOptions();
              })
              .catch(function (error) {
                console.log(error);
              });
          });
        });
        break;

      case "3":
        console.log("Logout");
        let data = {
          requestType: "LOGOUT",
        };

        axios
          .post("http://localhost:1338/logout", data)
          .then(function (response) {
            console.log(response.data);
            printOptions();
          })
          .catch(function (error) {
            console.log(error);
          });

        break;

      case "4":
        console.log("Get seller rating");
        rl.question("Enter seller id: ", (sellerId) => {
          let data = {
            sellerId: sellerId,
          };

          axios
            .post("http://localhost:1338/getSellerRating", data)
            .then(function (response) {
              console.log(response.data);
              printOptions();
            })
            .catch(function (error) {
              console.log(error);
            });
        });
        break;
      case "5":
        if (uname) {
          console.log("Put an item for sale");
          rl.question("Enter item name: ", (itemName) => {
            rl.question("Enter item description: ", (itemDescription) => {
              rl.question("Enter item price: ", (itemPrice) => {
                rl.question("Enter item Quantity: ", (Quantity) => {
                  rl.question("Enter item Keywords: ", (Keywords) => {
                    let data = {
                      itemName: itemName,
                      itemDescription: itemDescription,
                      itemPrice: Number(itemPrice),
                      quantity: Number(Quantity),
                      username: uname,
                      keywords: Keywords.split(/\s+/),
                    };

                    axios
                      .post("http://localhost:1338/addItemToSale", data)
                      .then(function (response) {
                        console.log(response.data);
                        printOptions();
                      })
                      .catch(function (error) {
                        console.log(error);
                      });
                  });
                });
              });
            });
          });
        } else {
          console.log("********************");
          console.log("Please Login First");
          console.log("********************");
          printOptions();
        }
        break;
      case "6":
        console.log("Remove an item from sale");
        rl.question("Enter item id: ", (itemId) => {
          let data = {
            itemId: itemId,
          };

          axios
            .post("http://localhost:1338/removeItemFromSale", data)
            .then(function (response) {
              console.log(response.data);
              printOptions();
            })
            .catch(function (error) {
              console.log(error);
            });
        });
        break;
      case "7":
        if (uname) {
          console.log("Display items for sale");
          let data = {
            userID: uname,
          };
          axios
            .post("http://localhost:1338/getProductsOnSale", data)
            .then(function (response) {
              console.log(response.data.items);
              printOptions();
            })
            .catch(function (error) {
              console.log(error);
            });
        } else {
          console.log("********************");
          console.log("Please Login First");
          console.log("********************");
          printOptions();
        }
        break;
      case "8":
        {
          rl.question("Enter item id: ", (noUsers) => {
            var promisesArray = [];
            let data = {
              username: "username",
              password: "password",
            };
            var beforeTime = Date.now();
            for (i = 0; i < 10 * noUsers; i++) {
              let promise = axios.post(
                "http://localhost:1338/createAccount",
                data
              );

              promisesArray.push(promise);
            }

            Promise.all(promisesArray).then((values) => {
              console.log(
                "All calls finished execution, Time taken ->",
                Date.now() - beforeTime + "ms"
              );
              printOptions();
            });
          });
        }
        break;
      case "9":
        {
          rl.question("Enter no of users ", (noUsers) => {
            var promisesArray = [];
            let data = {
              username: "username",
              password: "password",
            };
            var beforeTime = Date.now();
            for (i = 0; i < 1000 * noUsers; i++) {
              let promise = axios.post(
                "http://localhost:1338/createAccount",
                data
              );

              promisesArray.push(promise);
            }

            Promise.all(promisesArray).then((values) => {
              console.log(
                "All calls finished execution, Time taken ->",
                Date.now() - beforeTime + "ms"
              );
              printOptions();
            });
          });
        }
        break;
      default:
        console.log("Invalid option");
        printOptions();
        break;
    }
  });
};

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const start = async () => {
  console.log("Welcome to the shopping system");
  await sleep(2000);
  printOptions();
};

start();
//module.exports = start
