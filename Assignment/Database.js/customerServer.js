// gRPC setup
var PROTO_PATH = "../ConfigsAndDB/gRPC/customerServer.proto";
var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

var CryptoJS = require("crypto-js");

var custdb = grpc.loadPackageDefinition(packageDefinition).customerdb;
7;
const process = require("process");
process.chdir(__dirname);
console.log(process.cwd());

var customerDB = require("./customerDBStub.js");


// Generate a session ID using SHA-256 hashing
function generateSessionID() {
  let date = new Date().valueOf().toString();
  let random = Math.random().toString();
  let sessionID = CryptoJS.SHA256(date + random).toString();
  return sessionID;
}
// // Usage:
// let sessionID = generateSessionID();
// console.log(sessionID); // e.g. "60e34a0f2a32b44d3a3d9d7895e76725c717288e5d84755f4a10b4a4e4e12f7c"


// ------------------addCustomer---------------------grpc----------------
function addCustomer(call, callback) {
  if (call.request.customerType) {
    var user = {
      username: call.request.username,
      password: call.request.password,
      id: call.request.username + Date.now(),
      itemsBought: 0,
      sessionID: null,
      cart: [],
      loginSessions: 0,
    };

  } else {
    var user = {
      username: call.request.username,
      password: call.request.password,
      id: call.request.username + Date.now(),
      feedbackNeg: 0,
      feedbackPos: 0,
      itemsSold: 0,
      loginSessions: 0,
    };
  }

  customerDB.addUser({ ...user });

  callback(null, {
    responseType: "SUCCESS",
    message: "Request processed successfully",
  });
}

// ------------------loginCustomer---------------------grpc----------------
function loginCustomer(call, callback) {
  var reqdata = {
    username: call.request.username,
    password: call.request.password,
  };
  console.log("request for customer login for :", reqdata);

  // check if user exists and get the session ID from DB
  user = customerDB.getUser(reqdata.username);
  console.log("obtained from DB:", user);
  if (user != null && user.password == reqdata.password) {
    if (user.sessionID == null) {
      user.sessionID = generateSessionID();
    }
    
    var newData = {
      responseType: "SUCCESS",
      message: "Request processed successfully",
      sessionID : user.sessionID,
    };
  } else {
    var newData = {
      responseType: "FAILURE",
      message: "Invalid username or password",
      sessionID: null,
    };
  }
  console.log("sending response:");
  console.log("sending response:", newData);
  callback(null, {
    responseType: newData.responseType,
    message: newData.message,
    sessionID: newData.sessionID,
  });
}

// ------------------logoutCustomer---------------------grpc----------------
function logoutCustomer(call, callback) {
  var reqdata = {
    sissionID: call.request.sessionID,
  };
  console.log("request for customer logout for :", reqdata);
  result = customerDB.logoutCustomer(call.request.sessionID);
  console.log("obtained from DB:", result);
  if (result == true) {
    var newData = {
      responseType: "SUCCESS",
      message: "Request processed successfully",
    };
  } else {
    var newData = {
      responseType: "FAILURE",
      message: "Invalid session ID",
    };
  }
  console.log("sending response:", newData);
  callback(null, {
    responseType: newData.responseType,
    message:  newData.message,
  });
}


// ------------------main---------------------grpc----------------
function main() {
  var server = new grpc.Server();
  server.addService(custdb.CustomerDB.service, {
    addCustomer: addCustomer,
    loginCustomer: loginCustomer,
    logoutCustomer: logoutCustomer,
  });
  server.bindAsync(
    "0.0.0.0:50051",
    grpc.ServerCredentials.createInsecure(),
    () => {
      server.start();
    }
  );
}

main();
// ------------------end-------------------------------------
