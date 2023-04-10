// Requiring fs module
const fs = require("fs");

var customerData = fs.readFileSync("../ConfigsAndDB/databases/customer_data.json");
var customerDataObject = JSON.parse(customerData);

function addUser(user) {
  customerDataObject.push(user);
  console.log("User added", user);

  fs.writeFileSync("../ConfigsAndDB/databases/customer_data.json", JSON.stringify(customerDataObject));
}

function getUser(username) {
  console.log(username);
  for (var i = 0; i < customerDataObject.length; i++) {
    if (customerDataObject[i].username == username) {
      return customerDataObject[i];
    }
  }
  return null;
}

function login(userId) {
  for (var i = 0; i < customerDataObject.length; i++) {
    if (customerDataObject[i].id == userId) {
      customerDataObject[i].loginSessions += 1;
      return true;
    }
  }
  return false;
}

function logoutCustomer(sessionID) {
  console.log("logoutCustomer Backend");
  for (var i = 0; i < customerDataObject.length; i++) {

    if (customerDataObject[i].sessionID == sessionID) {
      if (customerDataObject[i].loginSessions != 0) {
        customerDataObject[i].loginSessions -= 1;
        if (customerDataObject[i].loginSessions == 0) {
          customerDataObject[i].sessionID = null;
        } 
      }
      return true;
    }
  }
  return false;
}

module.exports = { addUser, getUser, logoutCustomer, login };
