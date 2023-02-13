var net = require('net');

const process = require('process');
process.chdir(__dirname)
console.log(process.cwd());
var transactionDB  = require('../Backend/startTransactionsDB');

var server  = net.createServer(function(socket) {
    socket.on('data', function(data) {
		const req = JSON.parse(data);
		console.log(req);

        switch(req.requestType){
            // case "GET_BUYER_PURCHSE_HISTORY"  :
            //     buyerPurchaseHistory = transactionDB.getBuyerPurchaseHistory(req.data.buyerId)
            //     newData = { "responseType": "SUCCESS",
            //     "message": "Request processed successfully",
            //     "data": buyerPurchaseHistory};
            //     break;

            case "GET_SELLER_RATING":
                sellerRating = transactionDB.getSellerRating(req.data.sellerId)
                newData = { "responseType": "SUCCESS",
                "message": "Request processed successfully",
                "data": sellerRating};
                break;

            case "ADD_TRANSACTION":
                transactionDB.addTransaction(req.data)
                newData = { "responseType": "SUCCESS",
                "message": "Request processed successfully"};
                break;

            case "GET_FEEDBACK":
                feedback = transactionDB.getFeedback(req.data.sellerId)
                newData = { "responseType": "SUCCESS",
                "message": "Request processed successfully",
                "data": feedback};
                break;

            case "ADD_FEEDBACK":
                transactionDB.addFeedback(req.data)
                newData = { "responseType": "SUCCESS",
                "message": "Request processed successfully"};
                break;
            case "VIEW_PURCHASE_HISTORY":
                purchaseHistory = transactionDB.getBuyersPurchaseHistory(req.data.buyerId)
                newData = { "responseType": "SUCCESS",
                "message": "Request processed successfully",
                "data": purchaseHistory};
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


server.listen(1341, function(){

	console.log('Transaction Server listening on port 1341');

	server.	on('error', function (error) {
		console.error(JSON.stringify(error));
	});
	server.on('close', function (error) {
		console.error(JSON.stringify(error));
	});

});