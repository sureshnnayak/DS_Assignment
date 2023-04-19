//Buyer Server

const { CallTracker } = require("assert");
var net = require("net");

const process = require("process");
const express = require("express");
var soap = require("soap");

const bp = require("body-parser");

const port = 1337;


process.chdir(__dirname);
console.log(process.cwd());

const app = express();
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

const {
  addUser,
  login,
  isLogedIn,
  addToCart,
  clearCart,
  logout,
  getUser,
  searchProducts,
  getTransactions,
  addTransactions,
  getFeedback,
  getSellerRating,
  addFeedback,
  soapCall,
  getCart,
} = require("./backendStub");
const { response } = require("express");
var cart = null;

/*
*/
app.post("/createAccount", async (req, res) => {
  console.log("Creating account",req.body);
  var result = await addUser({username: req.body.username, password:req.body.password, customerType: true});
  res.send(200, result);
});


/*
*/
app.post("/login", async (req, res) => {
  console.log("Login User",req.body);
  var result = await login({username: req.body.username, password:req.body.password, customerType: true});
  res.send(200, result);
  });

/*
*/
app.post("/logout",async  (req, res) => {
  var result = await logout({sessionID: req.body.sessionID, customerType: true});
  res.send(200, result);
});

/*
*/
app.post("/searchProducts", async (req, res) => {
  console.log("Searching products");
  resp = await searchProducts(JSON.stringify(req.body));
  console.log(resp.data);
  res.send(200, resp);
});

/*
 * check if user is logged in or not
 * if not logged in, return error
 * if logged in, add to cart   */
app.post("/addToCart", async (req, res) => {  
  console.log("Adding to cart", req.body);
  // var result = await isLogedIn({sessionID: req.body.sessionID, customerType: true});
  // console.log("Adding to cart", result);
  // if (result.responseType == "SUCCESS"){
    var result = await addToCart({sessionID: req.body.sessionID,  productID: req.body.itemId,quantity: req.body.quantity});
  // }
  res.send(200, result);
});


app.post("/removeFromCart", async (req, res) => {
  console.log("Removing from cart");

  var result = await isLogedIn({sessionID: req.body.sessionID, customerType: true});
  if (result == true){
    var result = await removeFromCart({sessionID: req.body.sessionID, customerType: true, productID: req.body.productID});
  }
  res.send(200, result);
});


app.post("/clearCart", async (req, res) => {
  console.log("Clearing cart");
  var result = await clearCart({sessionID: req.body.sessionID, customerType: true});
  res.send(200, result);
});



app.post("/displayCart", async (req, res) => {
  var result = await getCart({sessionID: req.body.sessionID, customerType: true});
  res.send(200, result);
});


app.post("/makePurchase", async (req, res) => {
  console.log("Making purchase");
    var resp = await soapCall("data")
    console.log(resp);
    if (resp.result == "SUCCESS") {
      resp= await clearCart({sessionID: req.body.sessionID, customerType: true});
    }

  res.send(200, resp);
});


app.post("/getFeedback", async (req, res) => {
  // res.send('Hello World!')
  console.log("Getting feedback");
  //feedback = await getFeedback(req.body);
  feedback = getFeedback(req.body);
  newData = {
    responseType: "SUCCESS",
    message: "Request processed successfully",
    data: feedback,
  };
  res.send(200, newData);
});

app.post("/provideFeedback", async (req, res) => {
  // res.send('Hello World!')
  console.log("Providing feedback");
  await addFeedback(req.body);
  //addFeedback(req.body);
  newData = {
    responseType: "SUCCESS",
    message: "Request processed successfully",
  };
  res.send(200, newData);
});

app.get("getTransactions", async (req, res) => {
  // res.send('Hello World!')
  console.log("Getting transactions");
  //transactions = await getTransactions(req.body);
  transactions = getTransactions(req.body);
  newData = {
    responseType: "SUCCESS",
    message: "Request processed successfully",
    data: transactions,
  };
  res.send(200, newData);
});

app.post("/getSellerRating", async (req, res) => {
  // res.send('Hello World!')
  console.log("Getting seller rating");
  //rating = await getSellerRating(req.body);
  rating = getSellerRating(req.body);
  newData = {
    responseType: "SUCCESS",
    message: "Request processed successfully",
    data: rating,
  };
  res.send(200, newData);
});

app.post("getBuyersPurchaseHistory", async (req, res) => {
  // res.send('Hello World!')
  console.log("Getting buyer purchase history");
  //history = await getBuyersPurchaseHistory(req.body);
  history = getBuyersPurchaseHistory(req.body);
  newData = {
    responseType: "SUCCESS",
    message: "Request processed successfully",
    data: history,
  };
  res.send(200, newData);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});