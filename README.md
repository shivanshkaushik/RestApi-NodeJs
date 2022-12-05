# RestApi-Node.js
Implementation of a Rest Api in Node.js, performing basic Create Read and Update operations using Lowdb, a simple JSON based in-memory database.
The rest api exposes endpoints to perform the following functions:
<ol>
<li> A function that accepts a POST request to create product record in the database synchronously with the data provided in the JSON request body. The client recieves a failure response if the JSON body is ill-formatted, body is empty or if another product record with stock_number sent in the body is already present in the database.
<ul><li><b>Endpoint:</b> <i>http://localhost:8080/products</i></li>
<li><b>Type of request:</b> <i>POST</i></li>
<li><b>Sample request:</b> <i>curl -X POST -H "Content-Type: application/json" -d "{\"stock_number\":\"12345\",\"name\":\"Pro Batteries\",\"Description\":\"Batteries\",\"Price\":\"£1.99\"}" http://localhost:8080/products</i></li>
</ul>
</li>
<li> A function that accepts a PUT request to update product record in the database with the product details specified in the JSON request body. The stock_number is provided as a request parameter as stock_no, whose record is to be updated. The functions responds with a failure message if JSON is ill-formated, body is empty, stock_no parameter is not given or the product with the given stock_no does not exist in the database.
<ul><li><b>Endpoint:</b> <i>http://localhost:8080/products/{stock_no}</i></li>
<li><b>Type of request:</b> <i>PUT</i></li>
<li><b>Sample request:</b> <i>curl -X POST -H "Content-Type: application/json" -d "{\"stock_number\":\"12345\",\"name\":\"Updated Pro Batteries\",\"Description\":\"Updated Batteries\",\"Price\":\"£3.99\"}" http://localhost:8080/products/12345</i></li>
</ul>
<b>Note:</b> The function currently does not update the stock_number for the product, if provided in the request body.
</li>
<li> A function that accepts a get request with stock_no as a parameter and responds with the product data for the stock_no as present in the database. The request returns with a failure message if stock_no parameter is not provided or the product with the given stock_number is not present in the database.
<ul><li><b>Endpoint:</b> <i>http://localhost:8080/products/{stock_no}</i></li>
<li><b>Type of request:</b> <i>GET</i></li>
<li><b>Sample request:</b> <i>curl -H "Content-Type: application/json" http://localhost:8080/products/12345</i></li>
</ul>
</li>
  <h3>Dependencies</h3>
  <ul><li><b>Node.js</b> is required to run the application. Node.js can be installed through the following link <a href='https://nodejs.org/en/download/'>Node.js download</a> by following the instructions on the page.</li>
    <li> <b>Express</b> framework for node.js needs to be installed as the rest api is built and hosted using the functions in the express framework. To install, run the terminal and execute the command "npm install express".</li>
    <li> The api also requires the installation of <b>lowdb</b>, which is a lightweight and simple JSON database for node.js. It has database adapters to work as both traditional and in-memory databases. In our api, we have used the in-memory adapters. Lowdb can be installed by running the following command in the terminal "npm install lowdb".</li></ul>
<h3>Known Bugs:</h3>
<ul><li>Requests are processed as expected when they are sent using a client application such as Postman but fails when sent through CLI using cURL when the JSON body and/or headers are enclosed in single quotes('). The request is processed as expected when headers and JSON body are enclosed with double quotes(") and the quotes used for JSON key and values are escaped using backslash(\).<br>
<b>Incorrect format:</b> <i>curl -X POST -H "Content-Type: application/json" -d '{"stock_number":"12345","name":"Pro Batteries","Description":"Batteries","Price":"£1.99"}' http://localhost:8080/products</i><br>
<b>Incorrect format:</b> <i>curl -X POST -H 'Content-Type: application/json' -d '{"stock_number":"12345","name":"Pro Batteries","Description":"Batteries","Price":"£1.99"}' http://localhost:8080/products</i><br>
<b>Correct format:</b> <i>curl -X POST -H "Content-Type: application/json" -d "{\"stock_number\":\"12345\",\"name\":\"Pro Batteries\",\"Description\":\"Batteries\",\"Price\":\"£1.99\"}" http://localhost:8080/products</i>
</li><ul>
<h3>Future Scope</h3>
<ul><li> The rest api can be modified to work with asynchronous requests if required but it currently processes the requests synchronously.</li>
<li> The api can be integrated and can be used by clients created in node.js or any other programming language.</li></ul>
