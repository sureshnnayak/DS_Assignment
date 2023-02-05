
// Requiring fs module
const fs = require("fs");

// Storing the JSON format data in myObject
var productData = fs.readFileSync("./data/product_data.json");
var productDataObject = JSON.parse(productData);

var customerData = fs.readFileSync("./data/customer_data.json");
var customerDataObject = JSON.parse(customerData);

var transactionsData = fs.readFileSync("./data/transactions_data.json");
var transactionsDataObject = JSON.parse(transactionsData);
/*
// Defining new data to be added
let newData = {
    "itemName": "Joggers-2",
    "itemCategory": "Clothing",
    "itemId": "c2",
    "keywords": ["pyjamas", "pants", "woolen", "warmth"],
    "condition": "new",
    "salePrice": 17,
    "quantity": 5
};


// Adding the new data to our object
productDataObject.push(newData);
console.log(productDataObject);

// Writing to our JSON file
var newData2 = JSON.stringify(productDataObject);
fs.writeFile("./data/product_data.json", newData2, (err) => {
  // Error checking
  if (err) throw err;
  console.log("New data added");
});

*/
function getBuyerData(buyerId){
    for (var i = 0; i < customerDataObject.length; i++){
        if (customerDataObject[i].userId == buyerId){
            return customerDataObject[i];
        }
    }
}


function updateProductQuantity(productId, quantity){
    for (var i = 0; i < productDataObject.length; i++){
        if (productDataObject[i].itemId == productId){
            productDataObject[i].quantity = quantity;
        }
    }
    var newData2 = JSON.stringify(productDataObject);
    fs.writeFile("./data/product_data.json", newData2, (err) => {
      // Error checking
      if (err) throw err;
      console.log("Product data updated");
    });
}


function getProductData(productId){
    for (var i = 0; i < productDataObject.length; i++){
        if (productDataObject[i].itemId == productId){
            return productDataObject[i];
        }
    }
}


module.exports = {
  updateProductQuantity, getBuyerData, getProductData
};


