const process = require("process");
const express = require("express");
const bp = require("body-parser");
var PROTO_PATH = "./customerServer.proto";

// grpc client setup
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
var client = new custdb.CustomerDB(
  "localhost:50051",
  grpc.credentials.createInsecure()
);


process.chdir(__dirname);
console.log(process.cwd());


//Bottom two need to be removed and GRPC APIs need to be called instead
var productDB = require("../Backend/startProductDB");
var transactionDB = require("../Backend/startTransactionsDB");

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

  client.addCustomer(
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
  client.loginCustomer(
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
  newData = {
    responseType: "SUCCESS",
    sellerRating: transactionDB.getSellerRating(req.body.username),
  };
  console.log("Sending seller rating");
  res.send(200, newData);
});


// ------------------addItemToSale---------------------??X----------------
app.post("/addItemToSale", (req, res) => {
  // res.send('Hello World!')
  productDB.putItemForSale(req.body.productId);
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
  productDB.removeItemFromSale(req.body.productID);
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
  productOnSale = productDB.getProductOnSale(req.body.username);
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