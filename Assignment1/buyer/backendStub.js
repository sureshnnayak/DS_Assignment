var net = require('net');

/*
TCP Connection to connect to the Customer DB Server
*/
function getCustomerDbConnection(){

	var customerDbServer = new net.Socket();
	customerDbServer.connect(1339, 'localhost', function() {
		console.log('Connected');
		//customerDbServer.write(JSON.stringify(clData));
	});


	customerDbServer.on('close', function() {
		console.log('Connection closed');
	});

	customerDbServer.on('error', function (error) {
		console.error(JSON.stringify(error));
	});
	return customerDbServer;
}



/*
TCP Connection to connect to the Transaction DB Server
*/
function getTransactionDbConnection(){

	var transactionDbServer = new net.Socket();
	transactionDbServer.connect(1341, 'localhost', function() {
		console.log('Connected');
		//transactionDbServer.write(JSON.stringify(clData));
	});


	transactionDbServer.on('close', function() {
		console.log('Connection closed');
	});

	transactionDbServer.on('error', function (error) {
		console.error(JSON.stringify(error));
	});
	return transactionDbServer;
}


/*
TCP Connection to product to the Customer DB Server
*/
function getProductDbConnection(){

	var productDbServer = new net.Socket();
	productDbServer.connect(1340, 'localhost', function() {
		console.log('Connected');
		//productDbServer.write(JSON.stringify(clData));
	});


	productDbServer.on('close', function() {
		console.log('productDbServer Connection closed');
	});

	productDbServer.on('error', function (error) {
		console.error(JSON.stringify(error));
	});
	return productDbServer;
}


function sleep(ms) {
	return new Promise((resolve) => {
	  setTimeout(resolve, ms);
	});
}




/*
STUB FUNCTIONS
*/

const  addUser = async(data) => {
    return new Promise((resolve, reject) => {
        customerDbServerServer.write(data);
        customerDbServerServer.on('data',  function (response) {
			res = JSON.parse(response);
			resolve(res);
        });
    });
}

function getUser(data){
    return new Promise((resolve, reject) => {
        customerDbServerServer.write(data);
        customerDbServerServer.on('data',  function (response) {
        
            res = JSON.parse(response);
            resolve(res);
        });
    });
}

function searchProducts(data){
    return new Promise((resolve, reject) => {
        productDbServerServer.write(data);
        productDbServerServer.on('data',  function (response) {
            res = JSON.parse(response);
            resolve(res);
        });
    });
}
function getTransactions(data){
    return new Promise((resolve, reject) => {
        transactionDbServerServer.write(data);
        transactionDbServerServer.on('data',  function (response) {
            res = JSON.parse(response);
            resolve(res);
        });
    });
}

function  addTransactions(data){
    console.log("addTransactions");
    return new Promise((resolve, reject) => {
        transactionDbServerServer.write(data);
        transactionDbServerServer.on('data',  function (response) {
            res = JSON.parse(response);
            resolve(res);
        });
    });
}

function addFeedback(data){
    return new Promise((resolve, reject) => {
        transactionDbServerServer.write(data);
        transactionDbServerServer.on('data',  function (response) {
            res = JSON.parse(response);
            resolve(res);
        });
    });
}

function getSellerRating(data){
    return new Promise((resolve, reject) => {
        transactionDbServerServer.write(data);
        transactionDbServerServer.on('data',  function (response) {
            res = JSON.parse(response);
            resolve(res);
        });
    });
}

function getFeedback(data){
    return new Promise((resolve, reject) => {
        transactionDbServerServer.write(data);
        transactionDbServerServer.on('data',  function (response) {
            res = JSON.parse(response);
            resolve(res);
        });
    });
}

const productDbServerServer = getProductDbConnection();
const customerDbServerServer = getCustomerDbConnection();
const transactionDbServerServer = getTransactionDbConnection();


module.exports = { addUser, getUser, searchProducts, getTransactions, addTransactions, getFeedback, getSellerRating, addFeedback };