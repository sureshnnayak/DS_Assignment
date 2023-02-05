var net = require('net');

const readline = require('readline');
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: false
});


const { createAcccountMSG, getLoginMSG, getLogoutMSG, getSellerRatingMSG, getPutItemForSaleMSG, getRemoveItemFromSaleMSG,
    displayItemsForSaleMSG,
	getDisplayItemsForSaleMSG} = require('./messages')


const printOptions = (serverConnection) => {
	console.log("Please select an option:");
	console.log("1. Create an account");
	console.log("2. Login");
	console.log("3. Logout");
	console.log("4. Get seller rating");
	console.log("5. Put an item for sale");
	console.log("6. Remove an item from sale");
	console.log("7. Display items for sale");

	rl.question("Enter your option: ", (option) => {
		switch(option){
			case "1":
				console.log("Create an account");
				rl.question("Enter username: ", (username) => {
					rl.question("Enter password: ", (password) => {
						const clData = {
							username: username,
							password: password,
							category: "seller"
						};
						serverConnection.write(JSON.stringify(createAcccountMSG(clData )));
					});
				});
				break;

			case "2":
				console.log("Login");
				rl.question("Enter username: ", (username) => {
					rl.question("Enter password: ", (password) => {
						const clData = {
							username: username,
							password: password
						};
						serverConnection.write(JSON.stringify(getLoginMSG(clData )));
					});
				});
				break;

			case "3":
				console.log("Logout");
				const clData = {
					requestType: "LOGOUT"
				};
				serverConnection.write(JSON.stringify(getLogoutMSG(clData )));
				break;

			case "4":
				console.log("Get seller rating");
				rl.question("Enter seller id: ", (sellerId) => {
					const clData = {
						sellerId: sellerId
					};
					serverConnection.write(JSON.stringify(getSellerRatingMSG(clData )));
				});
				break;
			case "5":
				console.log("Put an item for sale");
				rl.question("Enter item name: ", (itemName) => {
					rl.question("Enter item description: ", (itemDescription) => {
						rl.question("Enter item price: ", (itemPrice) => {
							const clData = {
								itemName: itemName,
								itemDescription: itemDescription,
								itemPrice: itemPrice
							};
							serverConnection.write(JSON.stringify(getPutItemForSaleMSG(clData)));
						});
					});
				});
				break;
			case "6":
				console.log("Remove an item from sale");
				rl.question("Enter item id: ", (itemId) => {
					const clData = {
						itemId: itemId
					};
					serverConnection.write(JSON.stringify(getRemoveItemFromSaleMSG(clData )));
				});
				break;
			case "7":
				{
					console.log("Display items for sale");
					const clData = {
					};
					serverConnection.write(JSON.stringify(getDisplayItemsForSaleMSG(clData)));
				}
				break;
			default:
				console.log("Invalid option");
				printOptions(serverConnection);
				break;
				}


	});

}




function handleResponce(res, buyerServer){
	switch(res.responceType){
		case "SUUCESS":
			console.log(res.meaaage);
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




function getConnection(){

	var buyerServer = new net.Socket();
	buyerServer.connect(1338, 'localhost', function() {
		console.log('Connected');
		//buyerServer.write(JSON.stringify(clData));
	});

	buyerServer.on('data', function(data) {
		console.log('Received: ' + data);
		res = JSON.parse(data);
		handleResponce(res,buyerServer);
		//buyerServer.destroy(); // kill buyerServer after buyerServer's response
	});

	buyerServer.on('close', function() {
		console.log('Connection closed');
	});

	buyerServer.on('error', function (error) {
		console.error(JSON.stringify(error));
	});
	return buyerServer;
}


function sleep(ms) {
	return new Promise((resolve) => {
	  setTimeout(resolve, ms);
	});
  }

const start = async () => {
	console.log("Welcome to the shopping system");
	await sleep(2000);	
	const buyerServer = getConnection();
	printOptions(buyerServer);
	
}


start()
//module.exports = start
