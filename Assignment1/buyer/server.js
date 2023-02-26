//Buyer Server  

const { CallTracker } = require('assert');
var net = require('net');

const process = require('process');
const express = require("express");
const bp = require('body-parser')

const port = 1337;

process.chdir(__dirname)
console.log(process.cwd());

const app = express();
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

const {addUser, getUser, searchProducts, getTransactions, addTransactions, getFeedback, getSellerRating, addFeedback} = require('./backendStub');
const { response } = require('express');
 var cart = null;


app.post("/createAccount", async (req, res) => {
    // res.send('Hello World!')
    console.log("Creating account");
    // req.body.id = req.body.username ;//+ Date.now();
    console.log(req.body);
    //await 
    //addUser(JSON.stringify(req.body));
    var result  = await addUser(req.body);
    
    newData = {
        responseType: "SUCCESS",
        message: "Request processed successfully",
    };
    res.send(200,result);
});

app.post("/login", async (req, res) => {
    // res.send('Hello World!')
    //user = await getUser(JSON.stringify(req.body.username));
    resp =  await getUser(req.body);
    console.log(resp)
    if (resp.responseType == "SUCCESS") {

        userCart = {
            userId: req.body.username,
            products: []
        }
        if (cart == null){
            cart = [userCart]
        }
        else {
            cart.push(userCart)

        }
    }
    console.log(cart);
    res.send(200,resp);
    
});

app.post("/logout", (req, res) => {

    if (cart != null){
        cart = cart.filter((item) => item.userId != req.body.userId);
    }
    newData = {
        responseType: "SUCCESS",
        message: "Request processed successfully",
    };
    res.send(200,newData);
    console.log("Logging out");
});

app.post("/searchProducts", async (req, res) => {
    console.log("Searching products");
    resp = await searchProducts(JSON.stringify(req.body));
    console.log(resp);
    res.send(200,resp);
});

app.post("/addToCart", (req, res) => {
    console.log("Adding to cart");
    newData = null
    if(cart == null){
        newdata = {
            responseType: "FAILURE",
            message: "Login before adding items to cart",
        }
        console.log("user not found\n")
    } else {
        userCart = null
        for(var i = 0; i < cart.length; i++){
            if(cart[i].userId == req.body.userId){
                cart[i].products.push(req.body.itemId);
                userCart = cart[i].products;
                newData = {
                    responseType: "SUCCESS",
                    message: "Request processed successfully",
                    cart : userCart
                };

            }
        }
        if (newData == null)
        {
            newdata = {
                responseType: "FAILURE",
                message: "Login before adding items to cart",
            }
        }
    }  
    res.send(200,newData);
});

app.post("/removeFromCart", (req, res) => {
    console.log("Removing from cart");
    newData = null;
    console.log(req.body);
    if(cart == null){
        newdata = {
            responseType: "FAILURE",
            message: "Login before modifying the cart",
        }
        console.log("user not found\n")
    } else {
        userCart = null
        for(var i = 0; i < cart.length; i++){
            if(cart[i].userId == req.body.userId){
                //cart = cart.filter((item) => item.userId != req.body.userId);
                cart[i].products = cart[i].products.filter((item) => item != req.body.itemId);

                //cart[i].products.push(req.body.itemId);
                userCart = cart[i].products;
                newData = {
                    responseType: "SUCCESS",
                    message: "Request processed successfully",
                    cart : userCart
                };

            }
        }
        if (newData == null)
        {
            newdata = {
                responseType: "FAILURE",
                message: "Login before adding items to cart",
            }
        }
    }  
    res.send(200,newData);
});

app.post("/clearCart", (req, res) => {
    console.log("Clearing cart");
    console.log(req.body);
    newData = null;
    console.log(req.body);
    if(cart == null){
        newdata = {
            responseType: "FAILURE",
            message: "Login before modifying the cart",
        }
        console.log("user not found\n")
    } else {
        userCart = null
        for(var i = 0; i < cart.length; i++){
            if(cart[i].userId == req.body.userId){
                //cart = cart.filter((item) => item.userId != req.body.userId);
                cart[i].products = [];

                //cart[i].products.push(req.body.itemId);
                userCart = cart[i].products;
                newData = {
                    responseType: "SUCCESS",
                    message: "Request processed successfully",
                    cart : userCart
                };

            }
        }
        if (newData == null)
        {
            newdata = {
                responseType: "FAILURE",
                message: "Login before adding items to cart",
            }
        }
    }  



    // cart = cart.filter((item) => item.userId != req.body.userId);
    // newData = {
    //     responseType: "SUCCESS",
    //     message: "Request processed successfully",
    // };
    res.send(200,newData);
});

app.post("/displayCart", (req, res) => {
    // res.send('Hello World!')
    userCart = null
    console.log("Getting cart");
    console.log(req.body);
    console.log(cart)
    if (cart != null){
        for(var i = 0; i < cart.length; i++){
            if (cart[i].userId == req.body.userId){
                userCart = cart[i]
            }
        }
    }

    
    if( userCart == null){
        newData = {
            responseType: "FAILURE",
            message: "PLease login to access the cart"
        };
    }
    else {
        newData = {
            responseType: "SUCCESS",
            message: "Request processed successfully",
            cart: userCart.products,
        
        };
    }
    res.send(200,newData);
});

app.post("/makePurchase", (req, res) => {
    console.log("Making purchase");
    console.log(req.body);
    
    for(var i = 0; i < cart.length; i++){
        if (cart[i].userId == req.body.userId){
            // send request for make purchase
            responce = "SUCESS";
            if (response == "SUCESS"){
                cart[i].products = []
                newData = {
                    responseType: "SUCCESS",
                    message: "Request processed successfully",
                };

            }
            else {
                newData = {
                    responseType: "FAILURE",
                    message: "Payment declined",
            }
        }
    }
    res.send(200,newData);
    }
});


app.post("/getFeedback", async (req, res) => {
    // res.send('Hello World!')
    console.log("Getting feedback");
    //feedback = await getFeedback(req.body);
    feedback =  getFeedback(req.body);
    newData = {
        responseType: "SUCCESS",
        message: "Request processed successfully",
        data: feedback
    };
    res.send(200,newData);
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
    res.send(200,newData);
});

app.get("getTransactions", async (req, res) => {

    // res.send('Hello World!')
    console.log("Getting transactions");
    //transactions = await getTransactions(req.body);
    transactions = getTransactions(req.body);
    newData = {

        responseType: "SUCCESS",
        message: "Request processed successfully",
        data: transactions
    };
    res.send(200,newData);
});

app.post("/getSellerRating", async (req, res) => {
    // res.send('Hello World!')
    console.log("Getting seller rating");
    //rating = await getSellerRating(req.body);
    rating = getSellerRating(req.body);
    newData = {
        responseType: "SUCCESS",
        message: "Request processed successfully",
        data: rating
    };
    res.send(200,newData);
});

app.post("getBuyersPurchaseHistory", async (req, res) => {
    // res.send('Hello World!')
    console.log("Getting buyer purchase history");
    //history = await getBuyersPurchaseHistory(req.body);
    history = getBuyersPurchaseHistory(req.body);
    newData = {
        responseType: "SUCCESS",
        message: "Request processed successfully",
        data: history
    };
    res.send(200,newData);
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
  