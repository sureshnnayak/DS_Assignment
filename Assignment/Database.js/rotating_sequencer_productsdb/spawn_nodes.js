const { fork } = require("child_process");
const dgram = require("dgram");
const uuid = require("uuid");
const readline = require("readline");

const totalNodes = 5;
const basePort = 12345;

const childProcesses = [];

for (let i = 0; i < totalNodes; i++) {
  const child = fork("./node_instance.js", [i, basePort + i, totalNodes]);
  childProcesses.push(child);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askKey() {
  rl.question("Press to send Message: ", (key) => {
    sendMessage();
    askKey();
  });
}

function sendMessage() {
  const exampleNodeId = 0;
  const exampleRequestContent = "Example request from Node 0";
  const targetPort = basePort + exampleNodeId;
  const exampleRequestMessage = {
    type: "seed",
    requestId: uuid.v4(),
    senderId: exampleNodeId,
    localSequenceNumber: 0, // This assumes that it's the first request sent by Node 0
    requestContent: exampleRequestContent,
  };
  const messageBuffer = Buffer.from(JSON.stringify(exampleRequestMessage));
  const socket = dgram.createSocket("udp4");
  socket.send(
    messageBuffer,
    0,
    messageBuffer.length,
    targetPort,
    "localhost",
    (err) => {
      socket.close();
    }
  );
}

process.on('SIGINT', () => {
  console.log('Received SIGINT signal.');
  childProcesses.forEach((child) => {
    child.send('shutdown');
  });
  process.exit();
});

askKey();