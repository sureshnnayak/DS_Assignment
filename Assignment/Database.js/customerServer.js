const debug = require('diagnostics')('raft');
const argv = require('argh').argv;
const LifeRaft = require('@markwylde/liferaft');
//const LifeRaft = require('../');
const net = require('net');


const raftPorts = [
  8081, 8082,
  8083, 8084,
  8085
];

const grpcPorts = [
  50051, 50052,
  50053, 50054,
  50055
];


var RESPSUCESS =  {
  responseType: "SUCCESS",
  message: "Request processed successfully",
};



// variable initialization 
const grpcPort = grpcPorts[+argv.id ];
const raftPort = raftPorts[+argv.id ];




//
// Create a custom Raft instance which uses a plain TCP server and client to
// communicate back and forth.
//
class TCPRaft extends LifeRaft {
  /**
   * Initialized, start connecting all the things.
   *
   * @param {Object} options Options.
   * @api private
   */
  // SN: all the updates are coming to this function
  initialize (options) {
    const server = net.createServer((socket) => {
    
    socket.on('data', async  buff => {
      
      let data;
      try { 
        data = JSON.parse(buff.toString());
        //console.log('INTI: got data :', data);  // uncomment this to check the message at leader
        if (data && data.data && data.data.type == 'sequence') {
          //console.log('INTI: got data sequencing :', data);
          var newData =  {
            type: "commit",
            function : data.data.function,
            data: data.data.data,
          }
          // var newData =  {
          //   type: "commit",
          //   function : "login",
          //   username:  data.data.username,
          //   password:  data.data.password,
          // }
         // console.log('preparing packet for commiting :');
          var packet = await raft.packet('data', newData);
          console.log('INTI: prepeared dara for commiting :', packet);
          raft.message( LifeRaft.FOLLOWER, packet, printMsg);
        } else if (data && data.data && data.data.type == 'commit') {
          commitData(data.data.function, data.data.data)
          //console.log("AFTER COMMIT");
          //console.log('got a commit message init :', data);
        }
        //console.log("STILL INSIDE TRY");
        debug(this.address + ':packet#data', data);
        this.emit('data', data, data => {
          debug(this.address + ':packet#reply', data);
          socket.write(JSON.stringify(data));
          socket.end();
        });
        //console.log("END OF TRY");
      } catch (e) {console.log(buff.toString()); return fn(e);//console.log("catching the error");
      }
    });
    }).listen(this.address);

    this.once('end', function enc () {
      server.close();
    });
  }

  /**
   * The message to write.
   *
   * @TODO implement indefinitely sending of packets.
   * @param {Object} packet The packet to write to the connection.
   * @param {Function} fn Completion callback.
   * @api private*/

  // SN : updates come to this fucntiuon when the node is elected as leader 
  write (packet, fn) {
    const socket = net.connect(this.address);
    //console.log(this.address + ':packet#write', packet);
    //
    //console.log(this.address + ':packet#write', packet);
    debug(this.address + ':packet#write', packet);
    socket.on('error', fn);
    socket.on('data', async buff => {
      let data;
      //console.log(' # from write got a message :', packet);
      try { 
        data = JSON.parse(buff.toString());
 
        if (data && data.data && data.data.type == 'sequence') {
          //console.log('got a sequence message :', data);
          var packet = await raft.packet('data',
          {
              type: "commit",
              function : data.data.function,
              data: data.data.data,
            }
          );
          raft.message( LifeRaft.FOLLOWER, packet, printMsg);
        }
        else if (data && data.data && data.data.type ==='commit') {
          //console.log('got a commit message :', data);
          commitData(data.data.function, data.data.data)
        }
      } catch (e) { 
        console.log("error" );
        return fn(e); 
      }

      debug(this.address + ':packet#callback', packet);
      fn(undefined, data);
    });

    socket.setNoDelay(true);
    socket.write(JSON.stringify(packet));
  }
}

const printMsg = (msg) => {
  console.log('----------------------------------');
  console.log(msg);
  
}

//
// We're going to start with a static list of servers. A minimum cluster size is
// 4 as that only requires majority of 3 servers to have a new leader to be
// assigned. This allows the failure of one single server.
//



//
// Now that we have all our variables we can safely start up our server with our
// assigned port number.
//
const raft = new TCPRaft(raftPort, {
  'election min': 2000,
  'election max': 5000,
  heartbeat: 1000
});
console.log("starting a raft server at port:" + raftPort);

raft.on('heartbeat timeout', () => {
  debug('heart beat timeout, starting election');
});

raft.on('term change', (to, from) => {
  debug('were now running on term %s -- was %s', to, from);
}).on('leader change', function (to, from) {
  debug('we have a new leader to: %s -- was %s', to, from);
}).on('state change', function (to, from) {
  debug('we have a state to: %s -- was %s', to, from);
});

raft.on('leader', () => {
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
  console.log('I am elected as leader');
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
});

raft.on('candidate', () => {
  console.log('----------------------------------');
  console.log('I am starting as candidate');
  console.log('----------------------------------');
});

//
// Join in other nodes so they start searching for each other.
//
raftPorts.forEach(nr => {
  if (!nr || raftPort === nr) return;

  raft.join(nr);
});

/////////////////////////////////////////////////////////////////////////////

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

customerDB.updateFile(+argv.id);
// Generate a session ID using SHA-256 hashing
function generateSessionID() {
  let date = new Date().valueOf().toString();
  let random = Math.random().toString();
  let sessionID = CryptoJS.SHA256(date + random).toString();
  return sessionID;
}

/*wrapper raft message api*/
//creating a new packet to send to the leader/followers to process the request
async function sendPacketToLeader(functionName, data) {
  console.log("sending to leader:", functionName);
  var packet = await raft.packet('data', {
    type: "sequence" ,
    function : functionName,
    data : data
  });
    console.log("sending to leader:", packet);
    raft.message( LifeRaft.LEADER, packet, printMsg);
}


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

  sendPacketToLeader("addUser", user)
  //customerDB.addUser({ ...user });

  callback(null, {
    responseType: "SUCCESS",
    message: "Request processed successfully",
  });
}

// ------------------loginCustomer---------------------grpc----------------
async function loginCustomer(call, callback) {
/*
 * generate a session ID using and 
 */
  var reqdata = {
    username: call.request.username,
    password: call.request.password,
  };
  console.log("request for customer login for :", reqdata);

  // check if user exists and get the session ID from DB
  user = customerDB.getUser(reqdata.username,null);
  //console.log("obtained from DB:", user);
  if (user != null && user.password == reqdata.password) {
    if (user.sessionID == null) {
      user.sessionID = generateSessionID();

      // update the session ID in the DB
      sendPacketToLeader("updateUser", user)
      //customerDB.updateUser(user);
    }
    
    var newData = {
      responseType: "SUCCESS",
      message: "Request processed successfully",
      sessionID : user.sessionID,
      userID: user.id
    };
  } else {
    var newData = {
      responseType: "FAILURE",
      message: "Invalid username or password",
      sessionID: null,
      userID: null
    };
  }
  //console.log("sending response:");
  //console.log("sending response:", newData);
  callback(null, {
    responseType: newData.responseType,
    message: newData.message,
    sessionID: newData.sessionID,
    userID: newData.userID
  });
}

// ------------------logoutCustomer---------------------grpc----------------
function logoutCustomer(call, callback) {
  var reqdata = {
    sissionID: call.request.sessionID,
  };
  resp = RESPSUCESS;
  console.log("request for customer logout for :", reqdata);
  var user = customerDB.getUser(null,reqdata.sissionID);
  if (user != null) {
    user.sessionID = null;
    // update the session ID in the DB
    sendPacketToLeader("updateUser", user)
    //customerDB.updateUser(user);
  }
   else {
    resp = {
      responseType: "FAILURE",
      message: "Invalid session ID",
    };
  }
  console.log("obtained from DB:", result);
  console.log("sending response:", resp);
  callback(null, resp);
}

async function isLogedIn(call, callback) {
  var reqdata = {
    sissionID: call.request.sessionID,
  };
  resp = RESPSUCESS;
  console.log("request for isLoggedin :", call.request);
  user = await customerDB.getUser(null,call.request.sessionID);
 
  console.log("obtained from DB:", user);
  if (user == null) {
    resp = {
      responseType: "FAILURE",
      message: "Invalid session ID",
    };
  }
  console.log("sending response:", resp);
  callback(null, resp);
}


// ------------------addToCart---------------------grpc----------------
async function addToCart(call, callback) {
  var resp = RESPSUCESS;

  console.log("request for addToCart :", call.request);
  user = await customerDB.getUser(null,call.request.sessionID);
  //user = customerDB.isLogedIn(call.request.sessionID);
  console.log("obtained from DB:", user);
  if (user != null) 
  {
    user.cart.push(call.request.productID);
    // update the session ID in the DB
    sendPacketToLeader("updateUser", user);

  }
  if (user == null) {
    resp = {
      responseType: "FAILURE",
      message: "Invalid session ID",
    };
  }
  console.log("sending response:", resp);
  callback(null, resp);
}

async function clearCart(call, callback) {
  var resp = RESPSUCESS;
  console.log("request for clearCart :", call.request);
  user = await customerDB.getUser(null,call.request.sessionID);
  console.log("obtained from DB:", user);
  if (user != null)
  {
    user.cart = [];
    // update the session ID in the DB
    sendPacketToLeader("updateUser", user);
  }
  if (user == null) {
    resp = {
      responseType: "FAILURE",
      message: "Invalid session ID",
    };
  }
  console.log("sending response:", resp);
  callback(null, resp);
}
async function  getCart(call, callback) {
  var resp = RESPSUCESS;
  console.log("request for getCart :", call.request);
  user = await customerDB.getUser(null,call.request.sessionID);
  console.log("obtained from DB:", user);
  if (user != null)
  {
    resp = {
      responseType: "SUCCESS",
      message: "Request processed successfully",
      cart: user.cart.toString(),
    };
  }
  if (user == null) {
    resp = {
      responseType: "FAILURE",
      message: "Invalid session ID",
    };
  }
  console.log("sending response:", resp);
  callback(null, resp);
}





// ------------------main---------------------grpc----------------
function main() {
  console.log("starting grpc server on port:" + grpcPort );
  var server = new grpc.Server();
  server.addService(custdb.CustomerDB.service, {
    addCustomer: addCustomer,
    loginCustomer: loginCustomer,
    logoutCustomer: logoutCustomer,
    isLogedIn: isLogedIn,
    addToCart: addToCart,
    clearCart: clearCart,
    getCart: getCart,
    
  });
  server.bindAsync(
   // "0.0.0.0:50051",
     "0.0.0.0:" + grpcPort,
    grpc.ServerCredentials.createInsecure(),
    () => {
      server.start();
    }
  );
}


function commitData (fun, data) {
  console.log("commiting data to DB");
  console.log("function:", fun);
  console.log("data:", data);
  switch (fun) {
    case "addUser":
      console.log("adding user to DB");
      customerDB.addUser(data);
      break;
    case "updateUser":
      console.log("updating user data in DB");
      customerDB.updateUser(data);
      break;
    default:
      console.log("unknown function");
  }
  //console.log("ENDDDDD   data commited to DB");

}

main();
// ------------------end-------------------------------------
