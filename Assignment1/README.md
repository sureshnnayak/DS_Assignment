# TCP based Ecommerce application

Github Repo: `https://github.com/gauravmadarkal/tcp_ecommerce`

This is a template project showing how to implement an ecommerce application with just basic TCP.
With REST/RPC technology already available why do we want to do this?
well if you want to understand how REST/RPCs work underneath then this will help you. This project goes over how to use promises to syncronize TCP based message communication. It also shows how to implement your own protocol to create a commonly accepted communication between client and server.

It has three main components:
- Seller (client and server).
- Buyer (client and server).
- Database

The application can perform the following functionalities.
Seller
1. Put an item for sale
2. Change the sale price of an item
3. Remove an item from sale
4. Display items currently on sale put up by this seller

Buyer
1. Search items for sale
2. Add item to cart
3. Remove item from cart
4. Clear cart
5. Display cart

System Design
1. Database server is started as a node application that serves the data over a TCP connection. It gives two operations, GET_DATA (a simple GET request) and UPDATE_DATA which is used to change the data. The database server starts with some pre-filled data. Both the client and server in buyer/seller application have a standard set of messages that each of them send/receive. No messages other than are accepted.
2. Buyer/Seller client-server
The client to begin with connects to a server, and then gives the user a set of operation options to perform, based on the users choice the client either asks for more information or sends the request to the server. The server opens a TCP connection accepting any clients who want to connect. When a request is received from client, based on the messageId, the request gets routed to the right worker which then requests data from the database server. This process is synchronized using Promises, the data is received and worked on by the server and it then returns the data as a ResponseMessage to client.


# Latency Details
## BUYER
|Add item to cart|Remove from cart|Clear Cart|Search item for sale|Display cart|
| --- | --- | --- | --- | --- |
|13ms|13ms|3ms|33ms|9ms|

## SELLER
|Put item for sale|Change the sale price|Remove item from sale|Display items currently on sale|
| --- | --- | --- | --- |
|27ms|34ms|11ms|33ms|46ms|

The latency here is higher than expected because the buyer/seller server has to communicate with the database server in order to get data and put data. So an additional socket connection has to be made. And also the print statements take a good amount of time to compute and print the result.