
//Buyer Client
var net = require('net');


const readline = require('readline');
const axios = require("axios").default;

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: false
});

// send request to client server
/*
Create an account: sets up username and password 
Login: provide username and password 
Logout 
Search items for sale: provide an item category and up to five keywords 
Add item to the shopping cart: provide item id and quantity 
Remove item from the shopping cart: provide item id and quantity 
Clear the shopping cart 
Display shopping cart 
Make purchase 
Provide feedback: thumbs up or down for each item purchased, at most one feedback per purchased item 
Get seller rating: provide seller id 
Get buyer purchase history 
*/

const {    
	createAcccountMSG,
    getLoginMSG,
    getLogoutMSG,
    getSearchItemsMSG,
    getAddItemToCartMSG,
    getRemoveItemFromCartMSG,
    getClearCartMSG,
    getDisplayCartMSG,
    getPurchaseCartMSG,
    getProvideFeedbackMSG,
    getViewFeedbackMSG,
    getViewPurchaseHistoryMSG} = require('./messages');

	userId = null;
const printOptions = (serverConnection) => {
	console.log("Please select an option:");
	console.log("1. Create an account");
	console.log("2. Login");
	console.log("3. Logout");
	console.log("4. Search items for sale");
	console.log("5. Add item to the shopping cart");
	console.log("6. Remove item from the shopping cart");
	console.log("7. Clear the shopping cart");
	console.log("8. Display shopping cart");
	console.log("9. Make purchase");
	console.log("10. Provide feedback");
	console.log("11. Get seller rating");
	console.log("12. Get buyer purchase history");
	console.log("13. Exit");
	rl.question("Enter your option:", (option) => {
		switch(option){
			case "1":
				console.log("Create an account");
				rl.question("Enter username: ", (username) => {
					rl.question("Enter password: ", (password) => {
						rl.question("Enter Card No: ", (cardNo) => {
							rl.question("Enter Security pin: ", (secPin) => {
								const data = {
									username: username,
									password: password,
									cardNo: cardNo,
									secPin:secPin,
									category: "buyer"
								};
								axios
								.post("http://localhost:1337/createAccount", data)
								.then(function (response) {
								  console.log(response.data);
								  printOptions();
								})
								.catch(function (error) {
								  console.log(error);
								});
							})
						})
							
				
					});
				});
				break;
			case "2":
				//console.log("Login");
				rl.question("Enter username: ", (username) => {
					userId = username;
					rl.question("Enter password: ", (password) => {
						const data = {
							username: username,
							password: password
						};
						axios
						.post("http://localhost:1337/login", data)
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

			case "3":
				console.log("Logout");
				const data = {
					requestType: "LOGOUT"
				};
				axios
				.post("http://localhost:1337/logout", data)
				.then(function (response) {
				  console.log(response.data);
				  printOptions();
				})
				.catch(function (error) {
				  console.log(error);
				});	
				userId = null;			
				break;

			case "4":
				console.log("Search items for sale");
				rl.question("Enter item category: ", (itemCategory) => {
					rl.question("Enter up to five keywords: ", (keywords) => {
						const data = {
							itemCategory: itemCategory,
							keywords: keywords
						};
						axios
						.post("http://localhost:1337/searchProducts", data)
						.then(function (response) {
						  console.log(response.data);
						  printOptions();
						})
						.catch(function (error) {
						  console.log(error);
						});						});
				});
				break;
			case "5":
				//console.log("Add item to the shopping cart");
				rl.question("Enter item id: ", (itemId) => {
					rl.question("Enter quantity: ", (quantity) => {
						const data = {
							itemId: itemId,
							userId: "suresh",
							quantity: quantity
						};
						axios
						.post("http://localhost:1337/addToCart", data)
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

			case "6":
				console.log("Remove item from the shopping cart");
				rl.question("Enter item id: ", (itemId) => {
					rl.question("Enter quantity: ", (quantity) => {
						const data = {
							itemId: itemId,
							userId: userId,
							quantity: quantity
						};
						axios
						.post("http://localhost:1337/removeFromCart", data)
						.then(function (response) {
						  console.log(response.data);
						  printOptions();
						})
						.catch(function (error) {
						  console.log(error);
						});						});
				});
				break;


			case "7":{
				console.log("Clear the shopping cart");
				const data = {
					userId: userId,
				};
				axios
				.post("http://localhost:1337/clearCart", data)
				.then(function (response) {
				  console.log(response.data);
				  printOptions();
				})
				.catch(function (error) {
				  console.log(error);
				});					break;
			}

			case "8":
				{
					console.log("Display shopping cart");
				const data = {
					userId: userId,
					
				};
				axios
				.post("http://localhost:1337/displayCart", data)
				.then(function (response) {
				  console.log(response.data);
				  printOptions();
				})
				.catch(function (error) {
				  console.log(error);
				});					break;
			}

			case "9":{
				console.log("Make purchase");
				const data = {
					userId: userId
				};
				axios
				.post("http://localhost:1337/makePurchase", data)
				.then(function (response) {
				  console.log(response.data);
				  printOptions();
				})
				.catch(function (error) {
				  console.log(error);
				});					break;
			}
			
			case "10":
				console.log("Provide feedback");
				rl.question("Enter item id: ", (itemId) => {
					rl.question("Enter rating: ", (rating) => {
						rl.question("Enter comment: ", (comment) => {
							const data = {
								userId: userId,
								itemId: itemId,
								rating: rating,
								comment: comment
							};
							axios
							.post("http://localhost:1337/provideFeedback", data)
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
				break;

			case "11":
				console.log("View feedback");
				rl.question("Enter item id: ", (itemId) => {
					const data = {
						requestType: "VIEW_FEEDBACK",
						itemId: itemId,
						userId: userId
					};
					axios
					.post("http://localhost:1337/getSellerRating", data)
					.then(function (response) {
					  console.log(response.data);
					  printOptions();
					})
					.catch(function (error) {
					  console.log(error);
					});					});
				break;

			case "12":
				console.log("View purchase history");
				rl.question("Enter user id: ", (userId) => {
					const data = {
						userId: userId
					};
					axios
					.post("http://localhost:1337/getBuyersPurchaseHistory", data)
					.then(function (response) {
					  console.log(response.data);
					  printOptions();
					})
					.catch(function (error) {
					  console.log(error);
					});					});
				break;

			case "13":

			default:
				console.log("Exiting...");
				// serverConnection.destroy();
				//break;
				return;

		}
	});
}



function handleResponce(res, buyerServer){
	switch(res.responceType){
		case "SUUCESS":
			//console.log(res.meaaage);
			break;
		case "ERROR":
			console.log(res.message);
			break;
		case "DISPLAY_ITEMS":
		case "DISPLAY_CART":
		case "DISPLAY_PURCHASE_HISTORY":
			console.log(res.items);
			break;
		case "DISPLAY_FEEDBACK":
			console.log(res.feedback);
			break;
	}
	printOptions(buyerServer);
}




// function getConnection(){

// 	var buyerServer = new net.Socket();
// 	buyerServer.connect(1337, 'localhost', function() {
// 		console.log('Connected');
// 		//buyerServer.write(JSON.stringify(clData));
// 	});

// 	buyerServer.on('data', function(data) {
// 		console.log('Received: ' + data);
// 		res = JSON.parse(data);
// 		handleResponce(res,buyerServer);
// 		//buyerServer.destroy(); // kill buyerServer after buyerServer's response
// 	});

// 	buyerServer.on('close', function() {
// 		console.log('Connection closed');
// 	});

// 	buyerServer.on('error', function (error) {
// 		console.error(JSON.stringify(error));
// 	});
// 	return buyerServer;
// }


function sleep(ms) {
	return new Promise((resolve) => {
	  setTimeout(resolve, ms);
	});
  }

const start = async () => {
	console.log("Welcome to the shopping system");
	//await sleep(2000);	
	// const buyerServer = getConnection();
	printOptions();
	
}


start()
//module.exports = start
