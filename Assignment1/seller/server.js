var net = require("net");

const process = require("process");
const express = require("express");
const bp = require('body-parser')



const port = 1338;

process.chdir(__dirname);
console.log(process.cwd());

var customerDB = require("../Backend/startCustomerDB");
var productDB = require("../Backend/startProductDB");
var transactionDB = require("../Backend/startTransactionsDB");
const { json } = require("express");

const app = express();
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

app.post("/createAccount", (req, res) => {
  // res.send('Hello World!')
  console.log("Creating account");
  
  req.body.id = req.body.username + Date.now();
  req.body.feedbackNeg = 0
  req.body.feedbackPos = 0

  customerDB.addUser(req.body);
  newData = {
	responseType: "SUCCESS",
	message: "Request processed successfully",
  };

  res.send(200,newData);
});

app.post("/login", (req, res) => {
  // res.send('Hello World!')
  user = customerDB.getUser(req.body.username);
  if (user != null && user.password == req.body.password) {
	newData = {
	  responseType: "SUCCESS",
	  message: "Request processed successfully",
	};
  } else {
	newData = {
	  responseType: "FAILURE",
	  message: "Invalid username or password",
	};
  }

  res.send(200,newData);
  console.log("Logging in");
});

app.post("/logout", (req, res) => {
  // res.send('Hello World!')
  console.log("Logging out");
  res.send(200)

});

app.post("/getSellerRating", (req, res) => {
  // res.send('Hello World!')
  newData = {
	responseType: "SUCCESS",
	sellerRating: transactionDB.getSellerRating(req.body.username),
  };
  console.log("Sending seller rating");
  res.send(200,newData);
});

app.post("/addItemToSale", (req, res) => {
  // res.send('Hello World!')
  productDB.putItemForSale(req.body.productId);
  newData = {
	responseType: "SUCCESS",
	message: "Request processed successfully",
  };

  console.log("Adding item for sale");
  res.send(200,newData);
});

app.post("/removeItemFromSale", (req, res) => {
  // res.send('Hello World!')
  productDB.removeItemFromSale(req.body.productID);
  newData = {
	responseType: "SUCCESS",
	message: "Request processed successfully",
  };

  console.log("Removing item from sale");
  res.send(200,newData);
});

app.post("/getProductsOnSale", (req, res) => {
  // res.send('Hello World!')
  productOnSale = productDB.getProductOnSale(req.body.username);
  newData = {
	responseType: "SUCCESS",
	data: productOnSale,
  };
  console.log("Displaying items for sale");
  res.send(200,newData);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

