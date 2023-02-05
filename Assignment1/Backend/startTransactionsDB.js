
// Requiring fs module
const fs = require("fs");


var transactionsData = fs.readFileSync("./data/transactions_data.json");
var transactionsDataObject = JSON.parse(transactionsData);


function getBuyersPuchaseHistory(buyerId){
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


module.exports = {  getBuyersPuchaseHistory, getSellerRating  };