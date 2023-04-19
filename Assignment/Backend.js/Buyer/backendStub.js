var net = require("net");

const express = require("express");
const bp = require("body-parser");
var soap = require("soap");
var url = "http://localhost:8000/wsdl?wsdl";

// grpc client setup
var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");

var PROTO_PATH_CUSTOMER = "../../ConfigsAndDB/gRPC/customerServer.proto";
var PROTO_PATH_PRODUCT = "../../ConfigsAndDB/gRPC/productServer.proto";

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
const addUser = async (data) => {
  console.log("addUser  backendStub");
  return new Promise((resolve, reject) => {
    clientCustomer.addCustomer(
      { username: data.username, password:data.password, customerType:data.customerType },
      function (err, response) {
        resolve(response);
      }
    );
  });
};


/*
 */
const login = async (data) => {
  console.log("login  backendStub, session Id");
  return new Promise((resolve, reject) => {
    clientCustomer.loginCustomer(
      {username: data.username, password:data.password},
      function (err, response) {
        console.log("responce:", response);
        resolve(response);
      }
    );
  });
};
const addToCart = async (data) =>{
  console.log("addToCart  backendStub");
  return new Promise((resolve, reject) => {
    clientCustomer.addToCart(
      { sessionID: data.sessionID, productID: data.productID, quantity: data.quantity },
      function (err, response) {
        resolve(response);
      }
    );
  });
}
const clearCart = async (data) =>{
  console.log("clearCart  backendStub");
  return new Promise((resolve, reject) => {
    clientCustomer.clearCart(
      { sessionID: data.sessionID},
      function (err, response) {
        resolve(response);
      }
    );
  });
}

const getCart = async (data) =>{
  console.log("getCart  backendStub");
  return new Promise((resolve, reject) => {
    clientCustomer.getCart(
      { sessionID: data.sessionID},
      function (err, response) {
        resolve(response);
      }
    );
  });
}

const isLogedIn = (data) => {
  console.log("isLogedIn  backendStub", data);
  return new Promise((resolve, reject) => {
    clientCustomer.isLogedIn(
      {sessionID: data.sessionID },
      function (err, response) {
        console.log("responce:", response);
        resolve(response);
      }
    );
  });
};
const logout = async (data) => {
  console.log("Logout  backendStub", data.sessionID);
  return new Promise((resolve, reject) => {
    clientCustomer.logoutCustomer(
      {sessionID: data.sessionID },
      function (err, response) {
        resolve(response);
      }
    );
  });
};

function getUser(data) {
  console.log("getUser  backendStub");
  return new Promise((resolve, reject) => {
    clientCustomer.loginCustomer(
      { data: JSON.stringify(data) },
      function (err, response) {
        console.log("status:", JSON.parse(response.status));
        resolve(JSON.parse(response.status));
      }
    );
  });
}

function soapCall(data) {
  return new Promise((resolve, reject) => {
    soap.createClient(url, function (err, client) {
      if (err) {
        throw err;
      }

      var args = {
        cardnumber: "2222123343211234",
        securitycode: "555",
      };
      // call the service   
      client.FinTransactions(args, function (err, res) {
        if (err) throw err;
        console.log("Result is", res.result);
        resolve(res);
      });
    });
  });
}

function searchProducts(data) {
  console.log("forwarding request to product db server", data);
  return new Promise((resolve, reject) => {
    clientProduct.searchItem(
      { data: JSON.stringify(data) },
      function (err, response) {
        if (err) {
          console.log("Error: " + err);
        } else {
          console.log("Response: " + response);
          resolve(response);
        }
      }
    );
  });
}

function getTransactions(data) {
  return new Promise((resolve, reject) => {
    productDbServerServer;
    transactionDbServerServer.write(data);
    transactionDbServerServer.on("data", function (response) {
      res = JSON.parse(response);
      resolve(res);
    });
  });
}

function addTransactions(data) {
  console.log("addTransactions");
  return new Promise((resolve, reject) => {
    transactionDbServerServer.write(data);
    transactionDbServerServer.on("data", function (response) {
      res = JSON.parse(response);
      resolve(res);
    });
  });
}

function addFeedback(data) {
  console.log("adding feedback");
  return new Promise((resolve, reject) => {
    clientProduct.addFeedback(JSON.stringify(data), function (err, response) {
      if (err) {
        console.log("Error: " + err);
      } else {
        console.log("Response: " + response);
        resolve(response);
      }
    });
  });
}

function getSellerRating(data) {
  return new Promise((resolve, reject) => {
    transactionDbServerServer.write(data);
    transactionDbServerServer.on("data", function (response) {
      res = JSON.parse(response);
      resolve(res);
    });
  });
}

function getFeedback(data) {
  return new Promise((resolve, reject) => {
    transactionDbServerServer.write(data);
    transactionDbServerServer.on("data", function (response) {
      res = JSON.parse(response);
      resolve(res);
    });
  });
}


module.exports = {
  addUser,
  login,
  isLogedIn,
  logout,
  soapCall,
  getUser,
  addToCart,
  clearCart,
  getCart,
  searchProducts,
  getTransactions,
  addTransactions,
  getFeedback,
  getSellerRating,
  addFeedback,
};
