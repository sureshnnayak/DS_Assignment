var net = require('net');

const process = require('process');
process.chdir(__dirname)
console.log(process.cwd());

var customerDB  = require('../Backend/startCustomerDB');

var server  = net.createServer(function(socket) {
    socket.on('data', function(data) {
		const req = JSON.parse(data);
        console.log("Request received")
		console.log(req);
        newData = { "responseType": "SUCCESS",
        "message": "SUCCESS"};
        switch(req.requestType){
            case "ADD_USER":
                customerDB.addUser(req.data)
                newData = { "responseType": "SUCCESS",
                "message": "Request processed successfully"};
                break;
            case "LOGIN":
                user = customerDB.getUser(req.data.username)
                console.log(user);
                if (user != null && user.password == req.data.password) {
                    newData = { "responseType": "SUCCESS",
                    "message": "Request processed successfully"};
                }
                else {
                    newData = { "responseType": "FAILURE",
                    "message": "Invalid username or password"};
                }
                console.log(newData);
                break;
            
        }
        console.log("Sending response")
        console.log(newData)
        socket.write(JSON.stringify(newData));
    });


    socket.on('close', function(data) {
		console.log('Connection closed');
	});

	socket.on('error', function (error) {
		console.error(JSON.stringify(error));
	});
});


server.listen(1339, function(){
	console.log('Customer Data Server listening on port 1339');
	server.	on('error', function (error) {
		console.error(JSON.stringify(error));
	});
	server.on('close', function (error) {
		console.error(JSON.stringify(error));
	});
});