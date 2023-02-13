var net = require('net');


const process = require('process');
process.chdir(__dirname)
console.log(process.cwd());

var productDB  = require('../Backend/startProductDB');

var server  = net.createServer(function(socket) {
    socket.on('data', function(data) {
		const req = JSON.parse(data);
		console.log(req);
        switch(req.requestType){
            case "GET_PRODUCTS_ON_SALE":
                products = productDB.getProductsOnSale();
                newData = { "responseType": "SUCCESS",
                data : products};
                console.log("Getting products on sale");
                break;
            case "CHANGE_SALE_PRICE":
                productDB.changeSalePrice(req.data.itemId, req.data.salePrice);
                newData = { "responseType": "SUCCESS",
                data : "Sale price changed"};
                console.log("Changing sale price");
                break;
            case "PUT_ITEM_ON_SALE":
                productDB.putItemOnSale(req.data.itemId, req.data.salePrice);
                newData = { "responseType": "SUCCESS",
                data : "Item put on sale"};
                console.log("Putting item on sale");
                break;
            case "REMOVE_ITEM_FROM_SALE":
                productDB.removeItemFromSale(req.data.itemId);
                newData = { "responseType": "SUCCESS",
                data : "Item removed from sale"};
                console.log("Removing item from sale");
                break;

            case "SEARCH_ITEMS":
                products = productDB.searchProducts(req.data.keywords);
                newData = { "responseType": "SUCCESS",
                data : products};
                console.log("Searching products");
                break;
            case "GET_PRODUCT_SELLER":
                seller = productDB.getProductSeller(req.data.itemId);
                newData = { "responseType": "SUCCESS",
                data : seller};
                console.log("Getting product seller");
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


server.listen(1340, function(){

	console.log('product Server listening on port 1340');

	server.	on('error', function (error) {
		console.error(JSON.stringify(error));
	});
	server.on('close', function (error) {
		console.error(JSON.stringify(error));
	});

});