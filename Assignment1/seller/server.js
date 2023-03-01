const process = require("process");
const express = require("express");
const bp = require("body-parser");
var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");

var PROTO_PATH_CUSTOMER = "./customerServer.proto";
var PROTO_PATH_PRODUCT = "./productServer.proto";
var PROTO_PATH_TRANSACTION = "./transactionServer.proto";

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

// ------------------Transaction DB connection---------------------grpc----------------
var packageDefinitionProduct = protoLoader.loadSync(PROTO_PATH_TRANSACTION, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
var transactiondb = grpc.loadPackageDefinition(
  packageDefinitionProduct
).transactiondb;
var clientTransaction = new transactiondb.TransactionDB(
  "localhost:50053",
  grpc.credentials.createInsecure()
);

//Express.js setup
const app = express();
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

// ------------------createAccount---------------------grpc----------------
app.post("/createAccount", (req, res) => {
  console.log("Creating account");

  req.body.id = req.body.username + Date.now();
  req.body.feedbackNeg = 0;
  req.body.feedbackPos = 0;
  req.body.itemsSold = 0;
  req.body.loginSessions = 0;
  
  clientCustomer.addCustomer(
    { data: JSON.stringify(req.body) },
    function (err, response) {
      console.log("status:", JSON.parse(response.status));
      res.send(200, JSON.parse(response.status));
    }
  );
});

// ------------------login---------------------grpc----------------
app.post("/login", (req, res) => {
  // res.send('Hello World!')
  clientCustomer.loginCustomer(
    { data: JSON.stringify(req.body) },
    function (err, response) {
      console.log("status:", JSON.parse(response.status));
      res.send(200, JSON.parse(response.status));
    }
  );
});

// ------------------createAccount---------------------??X----------------
app.post("/logout", (req, res) => {
  // res.send('Hello World!')
  console.log("Logging out");
  res.send(200);
});

// ------------------createAccount---------------------??X----------------
app.post("/getSellerRating", (req, res) => {
  // res.send('Hello World!')
  clientTransaction.getSellerRating(
    { data: JSON.stringify(req.body) },
    function (err, response) {
      console.log("res:", JSON.parse(response.res));
      res.send(200, JSON.parse(response.res));
    }
  );
});

// ------------------addItemToSale---------------------??X----------------
app.post("/addItemToSale", (req, res) => {
  // res.send('Hello World!')

  clientProduct.putItemOnSale(req.body.productId);

  newData = {
    responseType: "SUCCESS",
    message: "Request processed successfully",
  };

  console.log("Adding item for sale");
  res.send(200, newData);
});

// ------------------removeItemFromSale---------------------??X----------------
app.post("/removeItemFromSale", (req, res) => {
  // res.send('Hello World!')
  clientProduct.removeItemFromSale(req.body.productID);
  newData = {
    responseType: "SUCCESS",
    message: "Request processed successfully",
  };

  console.log("Removing item from sale");
  res.send(200, newData);
});

// ------------------getProductsOnSale---------------------??X----------------
app.post("/getProductsOnSale", (req, res) => {
  // res.send('Hello World!')
  productOnSale = clientProduct.getProductOnSale(req.body.username);
  newData = {
    responseType: "SUCCESS",
    data: productOnSale,
  };
  console.log("Displaying items for sale");
  res.send(200, newData);
});

app.listen(1338, () => {
  console.log(`Server listening on port ${1338}`);
});
// --------------------------end----------------------------------------------
