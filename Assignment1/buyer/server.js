const { CallTracker } = require('assert');
var net = require('net');

const process = require('process');
process.chdir(__dirname)
console.log(process.cwd());

const {addUser, getUser, searchProducts, getTransactions, addTransactions, getFeedback, getSellerRating, addFeedback} = require('./backendStub');


var customerDB  = require('../Backend/startCustomerDB');
var productDB  = require('../Backend/startProductDB');
var transactionDB  = require('../Backend/startTransactionsDB');


var cart = null

var server  = net.createServer( function(socket) {
	socket.on('data', async function(data) {
		const req = JSON.parse(data);

		console.log(req);
		switch(req.requestType){

            case "CREATE_ACCOUNT":
                addUser(data);
                console.log("Creating account");
				//customerDB.addUser(req.data)
				newData = { "responseType": "SUCCESS",
				"message": "Request processed successfully"};
                break;

            case "LOGIN":
                user = await getUser(data);
                console.log(user,"logged in");
                

				if (user != null && user.password == req.data.password) {
                    newUser = {userId: req.data.userId, products: [req.data.itemId]}
                    if(cart == null){
                        cart = [newUser];
                    } else {cart.push(newUser);
                    }
					newData = { "responseType": "SUCCESS",
					"message": "Request processed successfully"};
				} else {
					newData = { "responseType": "FAILURE",
					"message": "Invalid username or password"};
				}
                break;

            case "LOGOUT":
                console.log("Logging out");
                break;

            case "SEARCH_ITEMS":
                products = await searchProducts(data);
                //products = productDB.searchProducts(req.data.keywords);
                newData = { "responseType": "SUCCESS",
                data : products};
                console.log("Item founnd");
                console.log(products);
                break;

            case "ADD_ITEM_TO_CART":
                if(cart == null){
                    userCart = {userId: req.data.userId, products: [req.data.itemId]}
                    cart = [userCart];
                    console.log(cart);
                } else {
                    for(var i = 0; i < cart.length; i++){
                        if(cart[i].userId == req.data.userId){
                            cart[i].products.push(req.data.itemId);
                            userCart = cart[i].products;   
                        }
                    }
                }
                newData = { "responseType": "SUCCESS",
                            data: userCart  };
                break;

            case "REMOVE_ITEM_FROM_CART":
                console.log(req.data.userId);
                for(var i = 0; i < cart.length; i++){
                    if(cart[i].userId == req.data.userId && cart[i].products.includes(req.data.itemId)){
                        
                        for (var j in cart[i].products){
                            if(cart[i].products[j] == req.data.itemId){
                                cart[i].products.splice(j,1);
                            }
                        
                        }
                        console.log(cart[i].products);
                    }
                }
                console.log("Removing item from cart");
                break;

            case "CLEAR_CART":
                for(var i = 0; i < cart.length; i++){
                    if(cart[i].userId == req.data.userId){
                        cart[i].products = null;
                    }
                }
                console.log("Clearing cart");
                break;

            case "DISPLAY_CART":
                console.log("Viewing cart");
                for(var i = 0; i < cart.length; i++){
                    if(cart[i].userId == req.data.userId){
                        newData = { "responseType": "SUCCESS",
                        data : cart[i].products};
                    }
                }
                console.log(newData);
                break;

            case "MAKE_PURCHASE":

                for(var i = 0; i < cart.length; i++){
                    if(cart[i].userId == req.data.userId){
                        await  addTransactions(cart[i].products, cart[i].userId);
                        //transactionDB.addTransactions(cart[i].products, cart[i].userId);
                        cart[i].products = null;
                    }
                }
                newData = { "responseType": "SUCCESS",
                "message": "Request processed successful`ly"  };
                console.log("Making purchase");
                break;

            case "PROVIDE_FEEDBACK":
                await addFeedback(data)
                //transactionDB.addFeedback(req.data.transactionId, req.data.feedback);
                newData = 
                    { "responseType": "SUCCESS",
                    "message": "Request processed successfully"  };
                console.log("Providing feedback");
                break;

            case "VIEW_FEEDBACK":
                feedback = await getFeedback(data);
                newData = 
                    { 
                        "responseType": "SUCCESS",
                        data : feedback};
                console.log("Viewing feedback");
                break;

            case "VIEW_PURCHASE_HISTORY":

                transactions = await getTransactions(data);
                newData = { "responseType": "SUCCESS",
                data : transactions};
                console.log("Viewing purchase history");
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



server.listen(1337, function(){

	console.log('Buyer Server listening on port 1337');

	server.	on('error', function (error) {
		console.error(JSON.stringify(error));
	});
	server.on('close', function (error) {
		console.error(JSON.stringify(error));
	});

});