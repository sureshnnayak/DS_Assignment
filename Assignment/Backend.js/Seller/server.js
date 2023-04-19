const process = require("process");
const express = require("express");
const bp = require("body-parser");
var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");

var PROTO_PATH_CUSTOMER = "../../ConfigsAndDB/gRPC/customerServer.proto";
var PROTO_PATH_PRODUCT = "../../ConfigsAndDB/gRPC/productServer.proto";
var PROTO_PATH_TRANSACTION = "../../ConfigsAndDB/gRPC/transactionServer.proto";

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
  clientCustomer.addCustomer(
    {
      username: req.body.username,
      password: req.body.password,
      customerType: false,
    },
    function (err, response) {
      console.log("status:", response.message);
      res.send(200, {
        requestType: response.requestType,
        message: response.message,
      });
    }
  );
});

// ------------------login---------------------grpc----------------
app.post("/login", (req, res) => {
  // res.send('Hello World!')
  clientCustomer.loginCustomer(
    { username: req.body.username, password: req.body.password },
    function (err, response) {
      console.log("status:", response);
      res.send(200, {
        requestType: response.requestType,
        message: response.message,
        sessionID: response.sessionID,
        userID: response.userID

      });
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

  clientProduct.putItemOnSale(
    {
      itemName: req.body.itemName,
      itemDescription: req.body.itemDescription,
      itemPrice: req.body.itemPrice,
      quantity: req.body.quantity,
      username: req.body.username,
      keywords: req.body.keywords,
    },
    function (err, response) {
      console.log("status:", response);
      res.send(200, {
        requestType: response.requestType,
        message: response.message,
      });
    }
  );

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
  clientProduct.getProductsOnSale(
    {
      userID: req.body.userID,
    },
    function (err, response) {
      console.log("status:", response);
      res.send(200, {
        requestType: response.requestType,
        items: response.items
      });
    }
  );
});

app.listen(1338, () => {
  console.log(`Server listening on port ${1338}`);
});
// --------------------------end----------------------------------------------
