
// Requiring fs module
const fs = require("fs");
 const { getProductSeller } = require("../Backend/startProductDB");

var transactionsData = fs.readFileSync("../Backend/data/transactions.json");
var transactionsDataObject = JSON.parse(transactionsData);

         
function getBuyersPurchaseHistory(buyerId){
    var purchaseHistory = [];
    for (var i = 0; i < transactionsDataObject.length; i++){
        if (transactionsDataObject[i].buyerId == buyerId){
            purchaseHistory.push(transactionsDataObject[i]);
        }
    }
    return purchaseHistory;
}

function getSellerRating(sellerId){
    var sellerRating = 0;
    var sellerRatingCount = 0;
    for (var i = 0; i < transactionsDataObject.length; i++){
        if (transactionsDataObject[i].sellerId == sellerId){
            sellerRating += transactionsDataObject[i].rating;
            sellerRatingCount++;
        }
    }
    return sellerRating/sellerRatingCount;
}


function addTransaction(products, buyer, seller){
    var transaction = {
        "products": products,
        "buyerId": buyer,
        "sellerId": seller,
        "rating": null
    }
    transactionsDataObject.push(transaction);
}

/*
    wrapper function for addTransaction
    takes product Ids and buyer Id then finds the seller id to add 
    transactions to the database 
*/
function addTransactions(products, buyer){
    for (var i = 0; i < products.length; i++){
        var sellerId = getProductSeller(products[i]);
        addTransaction(products[i], buyer, sellerId);
    }
}

function addFeedback(transactionId, rating){
    for (var i = 0; i < transactionsDataObject.length; i++){
        if (transactionsDataObject[i].transactionId == transactionId){
            transactionsDataObject[i].rating = rating;
        }
    }
}

function getFeedback(transactionId){
    for (var i = 0; i < transactionsDataObject.length; i++){
        if (transactionsDataObject[i].transactionId == transactionId){
            return transactionsDataObject[i].rating;
        }
    }
}



module.exports = {  
    getBuyersPurchaseHistory,
    getSellerRating, 
    addTransactions,
    getFeedback,
    addFeedback
};