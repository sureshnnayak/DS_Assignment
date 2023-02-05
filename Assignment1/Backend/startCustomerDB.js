// Requiring fs module
const fs = require("fs");

var customerData = fs.readFileSync("../Backend/data/customer_data.json");
var customerDataObject = JSON.parse(customerData);

function addUser(user) {
  customerDataObject.push(user);
  console.log(customerDataObject);
  console.log("User added");
  fs.writeFileSync("../Backend/data/customer_data.json", JSON.stringify(customerDataObject));
}

function getUser(username) {
    for (var i = 0; i < customerDataObject.length; i++) {
        if (customerDataObject[i].username == username) {
            return customerDataObject[i];
        }
    }
    return null;
}


module.exports = { addUser };