// Requiring fs module
const fs = require("fs");

var fileName = null;
var customerData = null;
var customerDataObject = null;

function updateFile(fileId) {
  fileName = "../ConfigsAndDB/databases/customer_data_" + fileId+ ".json";
  customerData = fs.readFileSync(fileName);
  customerDataObject = JSON.parse(customerData);
}


function addUser(user) {
  customerDataObject.push(user);
  console.log("User added", user);

  fs.writeFileSync(fileName, JSON.stringify(customerDataObject));
}

function updateUser(user) {
  for (var i = 0; i < customerDataObject.length; i++) {
    if (customerDataObject[i].username == user.username) {

      // customerDataObject[i].username= user.username;
      // customerDataObject[i].password= user.password;
      // customerDataObject[i].id= user.id;
      customerDataObject[i].itemsBought = user.itemsBought;
      customerDataObject[i].sessionID= user.sessionID;
      customerDataObject[i].cart=  user.cart;
      customerDataObject[i].loginSessions  = user.loginSessions;



      console.log("User updated", customerDataObject[i]);
      fs.writeFileSync(fileName, JSON.stringify(customerDataObject));
      return true;
    }
  }
  return false;
}

function getUser(username,sessionID) {
  console.log(username, sessionID);
  for (var i = 0; i < customerDataObject.length; i++) {
    if (sessionID && customerDataObject[i].sessionID == sessionID) {
      console.log("sessionID", customerDataObject[i]);
      return customerDataObject[i] ;
    }
    else if (customerDataObject[i].username == username) {
      console.log("username", customerDataObject[i]);
      return customerDataObject[i];
    }
  }
  return null;
}


// function login(userId) {
//   for (var i = 0; i < customerDataObject.length; i++) {
//     if (customerDataObject[i].id == userId) {
//       customerDataObject[i].loginSessions += 1;
//       return true;
//     }
//   }
//   return false;
// }

// function isLogedIn(sessionID) {
//   for (var i = 0; i < customerDataObject.length; i++) {
//     if (customerDataObject[i].sessionID == sessionID) {
//       return customerDataObject[i] ;
//     }
//   }
//   return null;
// }


// function logoutCustomer(sessionID) {
//   console.log("logoutCustomer Backend");
//   for (var i = 0; i < customerDataObject.length; i++) {

//     if (customerDataObject[i].sessionID == sessionID) {
//       if (customerDataObject[i].loginSessions != 0) {
//         customerDataObject[i].loginSessions -= 1;
//         if (customerDataObject[i].loginSessions == 0) {
//           customerDataObject[i].sessionID = null;
//         } 
//       }
//       return true;
//     }
//   }
//   return false;
// }


module.exports = { addUser, getUser, updateUser, updateFile };
