var net = require("net");
var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
var PROTO_PATH_TRANSACTION = "./transactionServer.proto";

var packageDefinition = protoLoader.loadSync(PROTO_PATH_TRANSACTION, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
var transactdb = grpc.loadPackageDefinition(packageDefinition).transactiondb;

const process = require("process");
process.chdir(__dirname);
console.log(process.cwd());
var transactionDB = require("../Backend/startTransactionsDB");

function getSellerRating(call, callback) {
  reqdata = JSON.parse(call.request.data);

  sellerRating = transactionDB.getSellerRating(reqdata.sellerId);
  newData = {
    responseType: "SUCCESS",
    message: "Request processed successfully",
    data: sellerRating,
  };

  callback(null, { res: JSON.stringify(newData) });
}

function addTransaction(call, callback) {
  reqdata = JSON.parse(call.request.data);
  transactionDB.addTransaction(reqdata);
  newData = {
    responseType: "SUCCESS",
    message: "Request processed successfully",
  };

  callback(null, { res: JSON.stringify(newData) });
}

function getFeedback(call, callback){
    reqdata = JSON.parse(call.request.data);
    feedback = transactionDB.getFeedback(reqdata.sellerId);
    newData = {
      responseType: "SUCCESS",
      message: "Request processed successfully",
      data: feedback,
    };
  
    callback(null, { res: JSON.stringify(newData) });
}

function addFeedback(call, callback){
    reqdata = JSON.parse(call.request.data);
    transactionDB.addFeedback(reqdata);
    newData = {
      responseType: "SUCCESS",
      message: "Request processed successfully",
    };
    callback(null, { res: JSON.stringify(newData) });
}

function getBuyersPurchaseHistory(call, callback){
    reqdata = JSON.parse(call.request.data);
    purchaseHistory = transactionDB.getBuyersPurchaseHistory(
        reqdata.buyerId
      );
      newData = {
        responseType: "SUCCESS",
        message: "Request processed successfully",
        data: purchaseHistory,
      };
    callback(null, { res: JSON.stringify(newData) });
}


// ------------------main---------------------grpc----------------
function main() {
    var server = new grpc.Server();
    server.addService(transactdb.TransactionDB.service, {
      getSellerRating: getSellerRating,
      addTransaction:addTransaction,
      getFeedback:getFeedback,
      addFeedback:addFeedback,
      getBuyersPurchaseHistory:getBuyersPurchaseHistory
    });
    server.bindAsync(
      "0.0.0.0:50053",
      grpc.ServerCredentials.createInsecure(),
      () => {
        server.start();
        console.log("grpc transaction server started");
      }
    );
  }
  
  main();

// var server = net.createServer(function (socket) {
//   socket.on("data", function (data) {
//     const req = JSON.parse(data);
//     console.log(req);

//     switch (req.requestType) {
    //   case "ADD_TRANSACTION":
    //     transactionDB.addTransaction(req.data);
    //     newData = {
    //       responseType: "SUCCESS",
    //       message: "Request processed successfully",
    //     };
    //     break;

    //   case "GET_FEEDBACK":
    //     feedback = transactionDB.getFeedback(req.data.sellerId);
    //     newData = {
    //       responseType: "SUCCESS",
    //       message: "Request processed successfully",
    //       data: feedback,
    //     };
    //     break;

    //   case "ADD_FEEDBACK":
    //     transactionDB.addFeedback(req.data);
    //     newData = {
    //       responseType: "SUCCESS",
    //       message: "Request processed successfully",
    //     };
    //     break;
    //   case "VIEW_PURCHASE_HISTORY":
    //     purchaseHistory = transactionDB.getBuyersPurchaseHistory(
    //       req.data.buyerId
    //     );
    //     newData = {
    //       responseType: "SUCCESS",
    //       message: "Request processed successfully",
    //       data: purchaseHistory,
    //     };
    //     break;
//     }
//     socket.write(JSON.stringify(newData));
//   });

//   socket.on("close", function (data) {
//     console.log("Connection closed");
//   });

//   socket.on("error", function (error) {
//     console.error(JSON.stringify(error));
//   });
// });



// server.listen(1341, function () {
//   console.log("Transaction Server listening on port 1341");

//   server.on("error", function (error) {
//     console.error(JSON.stringify(error));
//   });
//   server.on("close", function (error) {
//     console.error(JSON.stringify(error));
//   });
// });
