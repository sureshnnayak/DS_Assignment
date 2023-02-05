var net = require('net');
var customerDB  = requires('./data/startCustomerDB.js')


var server  = net.createServer(function(socket) {

	socket.on('data', function(data) {
		//console.log('Received: ' + data);
		const req = JSON.parse(data);
		console.log(req);
		switch(req.requestType){
            case "CREATE_ACCOUNT":
                console.log("Creating account");
                customerDB.addUser(req.data)

                break;

            case "LOGIN":
                console.log("Logging in");
                break;

            case "LOGOUT":
                console.log("Logging out");
                break;

            case "SEARCH_ITEMS":
                console.log("Searching items");
                break;

            case "ADD_ITEM_TO_CART":
                console.log("Adding item to cart");
                break;

            case "REMOVE_ITEM_FROM_CART":
                console.log("Removing item from cart");
                break;
        
            case "Clear_CART":  
                console.log("Clearing cart");
                break;

            case "DISPLAY_CART":
                console.log("Viewing cart");
                break;

            case "MAKE_PURCHASE":
                console.log("Making purchase");
                break;

            case "PROVIDE_FEEDBACK":
                console.log("Providing feedback");
                break;

            case "VIEW_FEEDBACK":
                console.log("Viewing feedback");
                break;

            case "VIEW_PUCHASE_HISTORY":
                console.log("Viewing purchase history");
                break;

        }
        newData = { "responseType": "SUCCESS",
                    "message": "Request processed successfully"  };
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