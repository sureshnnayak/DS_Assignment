# TCP based Ecommerce application

Github Repo: `https://github.com/sureshnnayak/DS_Assignment/tree/main/Assignment1`

This is a template project showing how to implement an ecommerce application with just basic TCP.


It has three main components:
- Seller (client and server).
- Buyer (client and server).
- Database (product database with a server, Customer database with server, transaction database with server)

The application can perform the following functionalities.
Seller
1. Create User account
2. Login
3. Logout
4. Put an item for sale
5. Change the sale price of an item
6. Remove an item from sale
7. Display items currently on sale put up by this seller

Buyer
1. Create User account
2. Login
3. Logout
4. Search items for sale
5. Add item to cart
6. Remove item from cart
7. Clear cart
8. Display cart

System Design
1. Database servers are started as a node applications that serves the data over a TCP connection. It gives two operations, GET_DATA (a simple GET request) and UPDATE_DATA which is used to change the data. The database server starts with some pre-filled data. Both the client and server in buyer/seller application have a standard set of messages that each of them send/receive. No messages other than are accepted.
2. Buyer/Seller client-server
The client to begin with connects to a server, and then gives the user a set of operation options to perform, based on the users choice the client either asks for more information or sends the request to the server. The server opens a TCP connection accepting any clients who want to connect. When a request is received from client, based on the messageId, the request gets routed to the right worker which then requests data from the database server bassed on the data type (Customer data, production data, Transaction Data). This process is synchronized using Promises, the data is received and worked on by the server and it then returns the data as a ResponseMessage to client.


assumptions:
1. client always strt the transaction by loggin using username and password.

# Latency  and throughput Details

|Buyer/Seller|Avg Responce time|Avg Throughput|
| --- | --- | --- | 
|1|2.78ms|2907|
|10|14.6ms|4057|
|100|125.3ms|6893|



The latency here is higher than expected because the buyer/seller server has to communicate with the database server in order to get data and put data. So an additional socket connection has to be made. And also the print statements take a good amount of time to compute and print the result.