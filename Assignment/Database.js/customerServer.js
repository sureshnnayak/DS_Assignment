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
var custdb = grpc.loadPackageDefinition(packageDefinition).customerdb;
7;
const process = require("process");
process.chdir(__dirname);
console.log(process.cwd());

var customerDB = require("./customerDBStub.js");

// ------------------addCustomer---------------------grpc----------------
function addCustomer(call, callback) {
  if (call.request.customerType) {
    var user = {
      username: call.request.username,
      password: call.request.password,
      id: call.request.username + Date.now(),
      itemsBought: 0,
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

  user = customerDB.getUser(reqdata.username);
  console.log("obtained from DB:", user);
  if (user != null && user.password == reqdata.password) {
    var newData = {
      responseType: "SUCCESS",
      message: "Request processed successfully",
    };
  } else {
    var newData = {
      responseType: "FAILURE",
      message: "Invalid username or password",
    };
  }
  callback(null, {
    responseType: newData.responseType,
    message: newData.message,
  });
}

// ------------------main---------------------grpc----------------
function main() {
  var server = new grpc.Server();
  server.addService(custdb.CustomerDB.service, {
    addCustomer: addCustomer,
    loginCustomer: loginCustomer,
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
