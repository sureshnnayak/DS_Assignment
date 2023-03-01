// Requiring fs module
const fs = require("fs");

var customerData = fs.readFileSync("../Backend/data/customer_data.json");
var customerDataObject = JSON.parse(customerData);

function addUser(user) {
  customerDataObject.push(user);
  console.log("User added",user);

  //fs.writeFileSync("../Backend/data/customer_data.json", JSON.stringify(customerDataObject));
}

function getUser(username) {
    console.log(username)
    for (var i = 0; i < customerDataObject.length; i++) {
        console.log(customerDataObject[i].username)
        if (customerDataObject[i].username == username) {
            console.log(customerDataObject[i])
            return customerDataObject[i];
            
        }
    }
    return null;
}




module.exports = { addUser, getUser };