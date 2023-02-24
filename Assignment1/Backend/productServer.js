// gRPC setup
var PROTO_PATH = "./customerServer.proto";
var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
var custdb = grpc.loadPackageDefinition(packageDefinition).customerdb;

// ------------- END----------------

function getProductsOnSale(call, callback) {
    products = productDB.getProductsOnSale();
    newData = { "responseType": "SUCCESS",
    data : products};
    console.log("Getting products on sale");
    callback(null, { status: JSON.stringify(newData) });
}
function changeSalePrice(call, callback) {
    productDB.changeSalePrice(call.request.itemId, call.request.salePrice);
    newData = { "responseType": "SUCCESS",
    data : "Sale price changed"};
    console.log("Changing sale price");
    callback(null, { status: JSON.stringify(newData) });
}

function putItemOnSale(call, callback) {
    productDB.putItemOnSale(call.request.itemId, call.request.salePrice);
    newData = { "responseType": "SUCCESS",
    data : "Item put on sale"};
    console.log("Putting item on sale");
    callback(null, { status: JSON.stringify(newData) });
}

function removeItemFromSale(call, callback) {
    productDB.removeItemFromSale(call.request.itemId);
    newData = { "responseType": "SUCCESS",

    data : "Item removed from sale"};
    console.log("Removing item from sale");
    callback(null, { status: JSON.stringify(newData) });
}


function addProduct(call, callback) {
        
    productDB.addProduct(JSON.parse(call.request.data));
    newData = { "responseType": "SUCCESS",
    data : "Product added"};
    console.log("Adding product");
    callback(null, { status: JSON.stringify(newData) });
}

function searchItem(call, callback) {
    products = productDB.searchProducts(call.request.keywords);
    newData = { "responseType": "SUCCESS",
    data : products};
    console.log("Searching products");
    callback(null, { status: JSON.stringify(newData) });
}
function getProductSeller(call, callback) {
    seller = productDB.getProductSeller(call.request.itemId);
    newData = { "responseType": "SUCCESS",
    data : seller};
    console.log("Getting product seller");
    callback(null, { status: JSON.stringify(newData) });
}
// ------------------main---------------------grpc----------------
function main() {
    var server = new grpc.Server();
    server.addService(custdb.CustomerDB.service, {
        changeSalePrice: changeSalePrice,
        getProductsOnSale: getProductsOnSale,
        putItemOnSale: putItemOnSale,
        removeItemFromSale: removeItemFromSale,
        addProduct: addProduct,
        searchItem: searchItem,
        getProductSeller: getProductSeller,

    });
    server.bindAsync(
      "0.0.0.0:50052",
      grpc.ServerCredentials.createInsecure(),
      () => {
        server.start();
      }
    );
  }
  
  main();
  // ------------------end-------------------------------------

  

// var net = require('net');


// const process = require('process');
// process.chdir(__dirname)
// console.log(process.cwd());

// var productDB  = require('../Backend/startProductDB');

// var server  = net.createServer(function(socket) {
//     socket.on('data', function(data) {
// 		const req = JSON.parse(data);
// 		console.log(req);
//         switch(req.requestType){
//             case "GET_PRODUCTS_ON_SALE":
//                 products = productDB.getProductsOnSale();
//                 newData = { "responseType": "SUCCESS",
//                 data : products};
//                 console.log("Getting products on sale");
//                 break;
//             case "CHANGE_SALE_PRICE":
//                 productDB.changeSalePrice(req.data.itemId, req.data.salePrice);
//                 newData = { "responseType": "SUCCESS",
//                 data : "Sale price changed"};
//                 console.log("Changing sale price");
//                 break;
//             case "PUT_ITEM_ON_SALE":
//                 productDB.putItemOnSale(req.data.itemId, req.data.salePrice);
//                 newData = { "responseType": "SUCCESS",
//                 data : "Item put on sale"};
//                 console.log("Putting item on sale");
//                 break;
//             case "REMOVE_ITEM_FROM_SALE":
//                 productDB.removeItemFromSale(req.data.itemId);
//                 newData = { "responseType": "SUCCESS",
//                 data : "Item removed from sale"};
//                 console.log("Removing item from sale");
//                 break;

//             case "SEARCH_ITEMS":
//                 products = productDB.searchProducts(req.data.keywords);
//                 newData = { "responseType": "SUCCESS",
//                 data : products};
//                 console.log("Searching products");
//                 break;
//             case "GET_PRODUCT_SELLER":
//                 seller = productDB.getProductSeller(req.data.itemId);
//                 newData = { "responseType": "SUCCESS",
//                 data : seller};
//                 console.log("Getting product seller");
//                 break;
//         }
//         socket.write(JSON.stringify(newData));     
//     });


//     socket.on('close', function(data) {
// 		console.log('Connection closed');
// 	});

// 	socket.on('error', function (error) {
// 		console.error(JSON.stringify(error));
// 	});

// });


// server.listen(1340, function(){

// 	console.log('product Server listening on port 1340');

// 	server.	on('error', function (error) {
// 		console.error(JSON.stringify(error));
// 	});
// 	server.on('close', function (error) {
// 		console.error(JSON.stringify(error));
// 	});

// });