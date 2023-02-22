var soap = require("soap");
var express = require("express");
var fs = require("fs");

var probability = function (n) {
  let num = Math.random();
  if (num >= n) return false;
  else return true;
};

function transact90(args) {
  if (probability(0.9)) {
    result = "SUCCESS";
  } else {
    result = "FAIL";
  }

  console.log(args,result);
  return {
    result: result,
  };
}

// the service
var serviceObject = {
  FinTransactionsService: {
    FinTransactionsServiceSoapPort: {
      FinTransactions: transact90,
    },
    FinTransactionsServiceSoap12Port: {
      FinTransactions: transact90,
    },
  },
};

// load the WSDL file
var xml = fs.readFileSync("finservice.wsdl", "utf8");
// create express app
var app = express();

// root handler
app.get("/", function (req, res) {
  res.send(
    'Node Soap Example!<br /><a href="https://github.com/macogala/node-soap-example#readme">Git README</a>'
  );
});

// Launch the server and listen
var port = 8000;
app.listen(port, function () {
  console.log("Listening on port " + port);
  var wsdl_path = "/wsdl";
  soap.listen(app, wsdl_path, serviceObject, xml);
  console.log(
    "Check http://localhost:" +
      port +
      wsdl_path +
      "?wsdl to see if the service is working"
  );
});
