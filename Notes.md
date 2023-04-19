
##How to run :
#1. install required node modules
'''bash
npm install
'''

To run the program:
'''bash
node 
'''



customer DB fields:
      username: call.request.username,
      password: call.request.password,
      id: call.request.username + Date.now(),
      itemsBought: 0,
      sessionID: null,
      cart: [],
      loginSessions: 0,

