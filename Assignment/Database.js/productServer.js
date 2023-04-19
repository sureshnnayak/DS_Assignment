// gRPC setup
var PROTO_PATH = "../ConfigsAndDB/gRPC/productServer.proto";
var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

var productdb = grpc.loadPackageDefinition(packageDefinition).productdb;

var productDB = require("./productDBStub");
// ------------- END----------------
function getProductsOnSale(call, callback) {
  products = productDB.getProductsOnSale(call.request.userID);
  newData = { responseType: "SUCCESS", data: products };
  console.log("Got Products",products);
  callback(null, {
    responseType: newData.responseType,
    items: newData.data,
  });
}

function changeSalePrice(call, callback) {
  productDB.changeSalePrice(call.request.itemId, call.request.salePrice);
  newData = { responseType: "SUCCESS", data: "Sale price changed" };
  console.log("Changing sale price");
  callback(null, { status: JSON.stringify(newData) });
}

function putItemOnSale(call, callback) {
  var item = {
    itemName: call.request.itemName,
    itemDescription: call.request.itemDescription,
    itemPrice: call.request.itemPrice,
    quantity: call.request.quantity,
    username: call.request.username,
    keywords: call.request.keywords,
  };
  console.log(item);

  productDB.addProduct(item);
  newData = { responseType: "SUCCESS", data: "Item put on sale" };
  console.log("Putting item on sale");
  callback(null, {
    responseType: newData.responseType,
    message: newData.data,
  });
}

function removeItemFromSale(call, callback) {
  productDB.removeItemFromSale(call.request.itemId);
  newData = {
    responseType: "SUCCESS",

    data: "Item removed from sale",
  };
  console.log("Removing item from sale");
  callback(null, { status: JSON.stringify(newData) });
}

function addProduct(call, callback) {
  productDB.addProduct(JSON.parse(call.request.data));
  newData = { responseType: "SUCCESS", data: "Product added" };
  console.log("Adding product");
  callback(null, { status: JSON.stringify(newData) });
}

function searchItem(call, callback) {
  products = productDB.searchProducts(JSON.parse(call.request.data).keywords);
  newData = { responseType: "SUCCESS", data: products };
  console.log("Searching products");
  callback(null, { status: JSON.stringify(newData) });
}

function getProductSeller(call, callback) {
  seller = productDB.getProductSeller(call.request.itemId);
  newData = { responseType: "SUCCESS", data: seller };
  console.log("Getting product seller");
  callback(null, { status: JSON.stringify(newData) });
}

function addFeedback(call, callback) {
  console.log("added feedback");
  seller = productDB.addFeedback(call.request);
  console.log("added feedback");
  newData = { responseType: "SUCCESS", data: seller };
  console.log("Getting product seller");
  callback(null, { status: JSON.stringify(newData) });
}
// ------------------main---------------------grpc----------------
function main() {
  var server = new grpc.Server();
  server.addService(productdb.ProductDB.service, {
    changeSalePrice: changeSalePrice,
    getProductsOnSale: getProductsOnSale,
    putItemOnSale: putItemOnSale,
    removeItemFromSale: removeItemFromSale,
    addProduct: addProduct,
    searchItem: searchItem,
    getProductSeller: getProductSeller,
    addFeedback: addFeedback,
  });
  server.bindAsync(
    "0.0.0.0:50052",
    grpc.ServerCredentials.createInsecure(),
    () => {
      server.start();
    }
  );
}

main();
// ------------------end-------------------------------------
