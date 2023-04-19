const dgram = require("dgram");
const uuid = require("uuid");
const util = require("util");
const fs = require("fs");

// gRPC setup
var PROTO_PATH = "../../ConfigsAndDB/gRPC/productServer.proto";
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

// var productDB = require("./productDBStub");

class Node {
  constructor(id, port, totalNodes) {
    this.id = id;
    this.port = port;
    this.totalNodes = totalNodes;
    this.socket = dgram.createSocket("udp4");
    this.globalSequenceNumber = 0;
    this.localSequenceNumbers = new Array(totalNodes).fill(0);
    this.requestQueue = [];
    this.sequenceQueue = [];
    this.database = fs.readFileSync(
      `../../ConfigsAndDB/databases/product_data_${id}.json`
    );
    this.productDataObject = JSON.parse(this.database);

    this.socket.on("message", (msg, rinfo) => this.handleMessage(msg, rinfo));
    this.socket.on("listening", () =>
      console.log(`Node ${id} is listening on port ${port}`)
    );
    this.socket.bind(port);
  }

  handleMessage(msg, rinfo) {
    const message = JSON.parse(msg.toString());

    switch (message.type) {
      case "request":
        this.requestQueue.push(message);
        break;
      case "sequence":
        this.sequenceQueue.push(message);
        break;
      case "seed":
        this.sendRequest(this.id, message.requestContent);
        break;
      default:
        console.warn("Unknown message type:", message.type);
    }

    this.processQueues();
  }

  // Process request and sequence queues to deliver messages
  processQueues() {
    // Sort request and sequence queues by their respective sequence numbers
    this.requestQueue = this.requestQueue.sort(
      (a, b) => a.localSequenceNumber - b.localSequenceNumber
    );
    this.sequenceQueue = this.sequenceQueue.sort(
      (a, b) => a.globalSequenceNumber - b.globalSequenceNumber
    );

    // Process messages from both queues when they have matching requestIds
    while (this.requestQueue.length > 0 && this.sequenceQueue.length > 0) {
      const request = this.requestQueue[0];
      const sequence = this.sequenceQueue[0];

      if (request.requestId === sequence.requestId) {
        console.log(`Node${this.id} Performing request: ${request.requestId}`);

        switch (request.methodName) {
          case "changeSalePrice":
            this.changeSalePrice(
              request.requestContent["itemId"],
              request.requestContent["salePrice"]
            );
            break;
            case "addProduct":
              this.addProduct(request.requestContent);
              console.log("Here in the right place");
              break;
            case "removeItemFromSale":
              this.removeItemFromSale(request.requestContent);
              break;
          default:
            console.log("Wrong Method Name");
        }
        this.requestQueue.shift();
        this.sequenceQueue.shift();
        this.globalSequenceNumber++;
      } else {
        break;
      }
    }

    // If there are requests in the queue, check if it's this node's turn to assign a global sequence number
    if (this.requestQueue.length > 0) {
      const nextRequest = this.requestQueue[0];
      const myId = this.globalSequenceNumber % this.totalNodes;

      // console.log(
      //   `Node ${this.id}, myId ${myId}, senderId ${nextRequest.senderId}, globalSeqNumber ${this.globalSequenceNumber}`
      // );

      if (this.id === myId) {
        console.log(`*****************************************`);
        console.log(`Node${this.id}:I am sequencing this time`);
        console.log(`*****************************************`);
        const sequenceMessage = {
          type: "sequence",
          globalSequenceNumber: this.globalSequenceNumber,
          requestId: nextRequest.requestId,
        };

        this.sequenceQueue.push(sequenceMessage);
        // Broadcast the sequence message and increment the global sequence number
        this.broadcast(JSON.stringify(sequenceMessage));
        // this.globalSequenceNumber++;
        this.processQueues();
      }
    }
  }

  // Broadcast a message to all nodes
  broadcast(message) {
    let basePort = 12345;
    var PORT;
    for (let i = 0; i < this.totalNodes; i++) {
      PORT = basePort + i;
      if (PORT != this.port)
        this.socket.send(message, 0, message.length, PORT, "localhost");
    }
  }

  // Send a request message from a specific node with request content
  sendRequest(senderId, requestContent, methodName) {
    const localSequenceNumber = this.localSequenceNumbers[senderId]++;
    const requestMessage = {
      type: "request",
      requestId: uuid.v4(),
      senderId: senderId,
      localSequenceNumber: localSequenceNumber,
      methodName: methodName,
      requestContent: requestContent,
    };

    this.requestQueue.push(requestMessage);
    // Broadcast the request message
    this.broadcast(JSON.stringify(requestMessage));

    this.processQueues();
  }

  getProductsOnSale(userID) {
    var productsOnSale = [];
    console.log(userID);
    for (var i = 0; i < this.productDataObject.length; i++) {
      if (this.productDataObject[i].username == userID) {
        productsOnSale.push(this.productDataObject[i]);
      }
    }
    return productsOnSale;
  }

  addProduct(item) {
    this.productDataObject.push(item);
    var newData2 = JSON.stringify(this.productDataObject);
    fs.writeFile(`../../ConfigsAndDB/databases/product_data_${this.id}.json`, newData2, (err) => {
      // Error checking
      if (err) throw err;
      console.log(`Node ${this.id}:Product data updated`);
    });
  }

  removeItemFromSale(productId){
    for (var i = 0; i < this.productDataObject.length; i++){
        if (this.productDataObject[i].itemId == productId){
            // console.log("splicing");
            this.productDataObject.splice(i,1)
        }       
    }
    var newData2 = JSON.stringify(this.productDataObject);
    fs.writeFile(`../../ConfigsAndDB/databases/product_data_${this.id}.json`, newData2, (err) => {
        // Error checking
        if (err) throw err;
        console.log(`Node ${this.id}:Product data updated`);
    });
}
}

// ------------------main---------------------grpc----------------
const id = parseInt(process.argv[2]);
const port = parseInt(process.argv[3]);
const totalNodes = parseInt(process.argv[4]);

var classObj = new Node(id, port, totalNodes);

function getProductsOnSale(call, callback) {
  products = classObj.getProductsOnSale(call.request.userID);
  newData = { responseType: "SUCCESS", data: products };
  console.log("Got Products", products);
  callback(null, {
    responseType: newData.responseType,
    items: newData.data,
  });
}

function putItemOnSale(call, callback) {
  var item = {
    itemName: call.request.itemName,
    itemDescription: call.request.itemDescription,
    itemPrice: call.request.itemPrice,
    quantity: call.request.quantity,
    username: call.request.username,
    itemId: call.request.itemId,
    keywords: call.request.keywords,
  };
  console.log(item);
  classObj.sendRequest(id, item, "addProduct");
  newData = { responseType: "SUCCESS", data: "Item put on sale" };
  console.log("Putting item on sale");
  callback(null, {
    responseType: newData.responseType,
    message: newData.data,
  });
}

function changeSalePrice(call, callback) {
  var reqContentObj = {
    itemId: call.request.itemId,
    salePrice: call.request.salePrice,
    method: "changeSalePrice",
  };

  classObj.sendRequest(id, reqContentObj);

  // productDB.changeSalePrice(call.request.itemId, call.request.salePrice);
  newData = { responseType: "SUCCESS", data: "Sale price changed" };
  console.log("Changing sale price");
  callback(null, { status: JSON.stringify(newData) });
}

function removeItemFromSale(call, callback) {

  classObj.sendRequest(id,call.request.itemId, "removeItemFromSale");
  newData = {
    responseType: "SUCCESS",

    data: "Item removed from sale",
  };
  console.log("Removed item from sale");
  callback(null, {
    responseType: newData.responseType,
    message: newData.data,
  });
}

function main() {
  var server = new grpc.Server();
  server.addService(productdb.ProductDB.service, {
    // changeSalePrice: changeSalePrice,
    getProductsOnSale: getProductsOnSale,
    putItemOnSale: putItemOnSale,
    removeItemFromSale: removeItemFromSale,
    // addProduct: addProduct,
    // searchItem: searchItem,
    // getProductSeller: getProductSeller,
    // addFeedback: addFeedback
  });
  server.bindAsync(
    `0.0.0.0:${60052 + id}`,
    grpc.ServerCredentials.createInsecure(),
    () => {
      server.start();
    }
  );
}

main();

process.on("message", (msg) => {
  if (msg === "shutdown") {
    console.log("Received shutdown message. Shutting down gracefully.");
    process.exit();
  }
});
