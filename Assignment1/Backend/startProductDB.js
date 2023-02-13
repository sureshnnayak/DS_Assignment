
// Requiring fs module
const fs = require("fs");

// Storing the JSON format data in myObject
var productData = fs.readFileSync("../Backend/data/product_data.json");
var productDataObject = JSON.parse(productData);




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

function changeSalePrice(productId, salePrice){
    for (var i = 0; i < productDataObject.length; i++){
        if (productDataObject[i].itemId == productId){
            productDataObject[i].salePrice = salePrice;
        }
    }
    var newData2 = JSON.stringify(productDataObject);
    fs.writeFile("./data/product_data.json", newData2, (err) => {
      // Error checking
      if (err) throw err;
      console.log("Product data updated");
    });
}

function getProductOnSale(keywords){
    var productsOnSale = [];
    for (var i = 0; i < productDataObject.length; i++){
        if ( productDataObject[i].keywords.includes(keywords)){
            productsOnSale.push(productDataObject[i]);
        }
    }
    return productsOnSale;
}


function putItemOnSale(productId){
    for (var i = 0; i < productDataObject.length; i++){
        if (productDataObject[i].itemId == productId){
            productDataObject[i].itemOnSale = "true";
        }
    }
    var newData2 = JSON.stringify(productDataObject);
    fs.writeFile("./data/product_data.json", newData2, (err) => {
      // Error checking
      if (err) throw err;
      console.log("Product data updated");
    });
}

function removeItemFromSale(productId){
    for (var i = 0; i < productDataObject.length; i++){
        if (productDataObject[i].itemId == productId){
            productDataObject[i].itemOnSale = "false"
        }       
    }
    var newData2 = JSON.stringify(productDataObject);
    fs.writeFile("./data/product_data.json", newData2, (err) => {
        // Error checking
        if (err) throw err;
        console.log("Product data updated");
    });
}

function searchProducts(keywords){
    var products = [];
    for (var i = 0; i < productDataObject.length; i++){
        if (productDataObject[i].keywords.includes(keywords)){
            products.push(productDataObject[i]);
        }
    }
    return products;
}

function getProductSeller(productId){
    for (var i = 0; i < productDataObject.length; i++){
        if (productDataObject[i].itemId == productId){
            return productDataObject[i].seller;
        }
    }
}


module.exports = {  updateProductQuantity,
     getProductOnSale, 
     changeSalePrice, 
     putItemOnSale, 
     removeItemFromSale,
     searchProducts,
     getProductSeller
    };
  