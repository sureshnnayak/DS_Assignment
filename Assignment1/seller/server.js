var net = require('net');

const process = require('process')
process.chdir(__dirname)
console.log(process.cwd())
var customerDB  = require('../Backend/startCustomerDB')
var productDB  = require('../Backend/startProductDB')
var transactionDB  = require('../Backend/startTransactionDB')



var server  = net.createServer(function(socket) {
	socket.on('data', function(data) {
		//console.log('Received: ' + data);
		const req = JSON.parse(data);
		console.log(req);
		switch(req.requestType){
            case "CREATE_ACCOUNT":
                console.log("Creating account");
				customerDB.addUser(req.data)
				newData = { "responseType": "SUCCESS",
				"message": "Request processed successfully"};
                break;

            case "LOGIN":
				user = customerDB.getUser(req.data.username)
				if (user != null && user.password == req.data.password) {
					newData = { "responseType": "SUCCESS",
					"message": "Request processed successfully"};
				} else {
					newData = { "responseType": "FAILURE",
					"message": "Invalid username or password"};
				}
				console.log("Logging in");
                break;

            case "LOGOUT":
                console.log("Logging out");
                break;

            case "GET_SELLER_RATING":
				newData = { "responseType": "SUCCESS",
					"sellerRating": transactionDB.getSellerRating(req.data.username)
				};			
                console.log("Sending seller rating");
                break;

            case "PUT_ITEM_FOR_SALE":
				productDB.putItemForSale(req.data.productId)
				newData = { "responseType": "SUCCESS",
					"message": "Request processed successfully"};

                console.log("Adding item for sale");
                break;

            case "REMOVE_ITEM_FROM_SALE":
				productDB.removeItemFromSale(req.data.productID)
				newData = { "responseType": "SUCCESS",
					"message": "Request processed successfully"};

                console.log("Removing item from sale");
                break;

            case "DISPLAY_ITEMS_FOR_SALE":
				//based on seller id
				productOnSale = productDB.getProductOnSale(req.data.username)  
				newData = { 
					"responseType": "SUCCESS",
				data : productOnSale
				};
                console.log("Displaying items for sale");
                break;
        }

		socket.write(JSON.stringify(newData));
		

	});

	socket.on('close', function(data) {
		console.log('Connection closed');
	});

	socket.on('error', function (error) {
		console.error(JSON.stringify(error));
	});
});



server.listen(1338, function(){

	console.log('Server listening on port 1337');

	server.	on('error', function (error) {
		console.error(JSON.stringify(error));
	});
	server.on('close', function (error) {
		console.error(JSON.stringify(error));
	});

});