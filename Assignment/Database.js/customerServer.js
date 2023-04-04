
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
  customerDB.addUser(JSON.parse(call.request.data));
  newData = {
    responseType: "SUCCESS",
    message: "Request processed successfully",
  };
  callback(null, { status: JSON.stringify(newData) });
}

// ------------------loginCustomer---------------------grpc----------------
function loginCustomer(call, callback) {
  reqdata = JSON.parse(call.request.data);
  console.log("request for customer login for :", reqdata)

  user = customerDB.getUser(reqdata.username);
  console.log("obtained from DB:", user)
  if (user != null && user.password == reqdata.password) {
    newData = {
      responseType: "SUCCESS",
      message: "Request processed successfully",
    };
  } else {
    newData = {
      responseType: "FAILURE",
      message: "Invalid username or password",
    };
  }
  callback(null, { status: JSON.stringify(newData) });
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
