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

function getUser(data){
    console.log("getUser  backendStub");
    return new Promise((resolve, reject) => {
        clientCustomer.loginCustomer(
            { data: JSON.stringify(data) },
            function (err, response) {
              console.log("status:", JSON.parse(response.status));
              resolve(JSON.parse(response.status))
            }
          );
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

function getTransactions(data){
    return new Promise((resolve, reject) => {
        productDbServerServer
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
     console.log("adding feedback")
    return new Promise((resolve, reject) => {
        clientProduct.addFeedback(JSON.stringify( data), function(err, response) {
            if (err) {
                console.log("Error: " + err);
            } else {
                console.log("Response: " + response);
                resolve(response);
            }
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



module.exports = { addUser, getUser, searchProducts, getTransactions, addTransactions, getFeedback, getSellerRating, addFeedback };