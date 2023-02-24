var net = require('net');

const express = require("express");
const bp = require("body-parser");


// grpc client setup
var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");

var PROTO_PATH_CUSTOMER = "./customerServer.proto";
var PROTO_PATH_PRODUCT = "./productServer.proto";


// ------------------Customer DB connection---------------------grpc----------------
var packageDefinitionCustomer = protoLoader.loadSync(PROTO_PATH_CUSTOMER, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
var custdb = grpc.loadPackageDefinition(packageDefinitionCustomer).customerdb;
var clientCustomer = new custdb.CustomerDB(
  "localhost:50051",
  grpc.credentials.createInsecure()
);


// ------------------Product DB connection---------------------grpc----------------
var packageDefinitionProduct = protoLoader.loadSync(PROTO_PATH_PRODUCT, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });
  var productdb = grpc.loadPackageDefinition(packageDefinitionProduct).productdb;
  var clientProduct = new productdb.ProductDB(
    "localhost:50052",
    grpc.credentials.createInsecure()
  );


/*
TCP Connection to connect to the Customer DB Server
*/
function getCustomerDbConnection(){

	var customerDbServer = new net.Socket();
	customerDbServer.connect(1339, 'localhost', function() {
		console.log('Connected');
		//customerDbServer.write(JSON.stringify(clData));
	});


	customerDbServer.on('close', function() {
		console.log('Connection closed');
	});

	customerDbServer.on('error', function (error) {
		console.error(JSON.stringify(error));
	});
	return customerDbServer;
}



/*
TCP Connection to connect to the Transaction DB Server
*/
function getTransactionDbConnection(){

	var transactionDbServer = new net.Socket();
	transactionDbServer.connect(1341, 'localhost', function() {
		console.log('Connected');
		//transactionDbServer.write(JSON.stringify(clData));
	});


	transactionDbServer.on('close', function() {
		console.log('Connection closed');
	});

	transactionDbServer.on('error', function (error) {
		console.error(JSON.stringify(error));
	});
	return transactionDbServer;
}


/*
TCP Connection to product to the Customer DB Server
*/
function getProductDbConnection(){

	var productDbServer = new net.Socket();
	productDbServer.connect(1340, 'localhost', function() {
		console.log('Connected');
		//productDbServer.write(JSON.stringify(clData));
	});


	productDbServer.on('close', function() {
		console.log('productDbServer Connection closed');
	});

	productDbServer.on('error', function (error) {
		console.error(JSON.stringify(error));
	});
	return productDbServer;
}


function sleep(ms) {
	return new Promise((resolve) => {
	  setTimeout(resolve, ms);
	});
}




/*
STUB FUNCTIONS
*/

const  addUser = async(data) => {
    console.log("addUser  backendStub");
    return new Promise((resolve, reject) => {
        clientCustomer.addCustomer(
            { data: JSON.stringify(data) },
            function (err, response) {
              console.log("status:", JSON.parse(response.status));
              resolve(JSON.parse(response.status));
              //res.send(200, JSON.parse(response.status));
            }
          );
    });
}


// const  addUser = async(data) => {
//     return new Promise((resolve, reject) => {
//         customerDbServerServer.write(data);
//         customerDbServerServer.on('data',  function (response) {
// 			res = JSON.parse(response);
// 			resolve(res);
//         });
//     });
// }

function getUser(data){
    return new Promise((resolve, reject) => {
        customerDbServerServer.write(data);
        customerDbServerServer.on('data',  function (response) {
        
            res = JSON.parse(response);
            resolve(res);
        });
    });
}


function searchProducts(data){
    console.log("forwarding request to product db server",data);
    return new Promise((resolve, reject) => {
        clientProduct.searchItem(JSON.stringify( data), function(err, response) {
            if (err) {
                console.log("Error: " + err);
            } else {
                console.log("Response: " + response);
                resolve(response);
            }
        });
    });
}

// function searchProducts(data){
//     return new Promise((resolve, reject) => {
//         productDbServerServer.write(data);
//         productDbServerServer.on('data',  function (response) {
//             res = JSON.parse(response);
//             resolve(res);
//         });
//     });
// }
function getTransactions(data){
    return new Promise((resolve, reject) => {
        transactionDbServerServer.write(data);
        transactionDbServerServer.on('data',  function (response) {
            res = JSON.parse(response);
            resolve(res);
        });
    });
}

function  addTransactions(data){
    console.log("addTransactions");
    return new Promise((resolve, reject) => {
        transactionDbServerServer.write(data);
        transactionDbServerServer.on('data',  function (response) {
            res = JSON.parse(response);
            resolve(res);
        });
    });
}

function addFeedback(data){
    return new Promise((resolve, reject) => {
        transactionDbServerServer.write(data);
        transactionDbServerServer.on('data',  function (response) {
            res = JSON.parse(response);
            resolve(res);
        });
    });
}

function getSellerRating(data){
    return new Promise((resolve, reject) => {
        transactionDbServerServer.write(data);
        transactionDbServerServer.on('data',  function (response) {
            res = JSON.parse(response);
            resolve(res);
        });
    });
}



function getFeedback(data){
    return new Promise((resolve, reject) => {
        transactionDbServerServer.write(data);
        transactionDbServerServer.on('data',  function (response) {
            res = JSON.parse(response);
            resolve(res);
        });
    });
}

const productDbServerServer = getProductDbConnection();
const customerDbServerServer = getCustomerDbConnection();
const transactionDbServerServer = getTransactionDbConnection();


module.exports = { addUser, getUser, searchProducts, getTransactions, addTransactions, getFeedback, getSellerRating, addFeedback };