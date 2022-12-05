/*
* File Name: Rest.js
* Programmer: Shivansh Kaushik
* Created for: RS Technologies Coding Challenge
* Date Submitted: 05/12/2022
* Javascript file with node.js implementation for a rest api that exposes multiple
* endpoints for creation, updation and search of records.
* The rest application has been created using the express framework.
* Lowdb is a simple to use JSON database and it's in-memory adapter has been used
* to store product data for this application.
 */

//Importing the necessary packages
import express from 'express';
import {LowSync, MemorySync} from 'lowdb'
//enclosing the code in a try-catch block to catch unforeseen errors.
try {
    var app = express();
    app.use(express.json())  //setting the app to use middleware function to parse incoming JSON requests
    const adapter = new MemorySync() //initializing the synchronous in-memory adapter to read and write to the db
    const db = new LowSync(adapter) //initializing the synchronous adapter for the db
    db.data ||= {posts: []}
    try {
        db.write() //inserting initial parent JSON tag to the database.
    }catch(dberror)
    {
        console.log("Error while writing to db! Description: "+ dberror.toString())
    }

    //The following function runs the server on the specified port(8080)
    try {
        var server = app.listen(8080, function () {
            var port = server.address().port
            console.log("Api listening on port: %s", port)
        })
    }
    catch(servererror)
    {
        console.log("Error while running server. Description: "+servererror.toString())
    }


//Function to create a JS object for the output of the rest methods having status and message fields.
    function output(status, message) {
        this.status = status
        this.message = message
    }

    // Function to return a failure response if the rest api receives a JSON body that cannot be parsed.
    app.use((error, request, response, next) => {
        if (error instanceof SyntaxError) {
            const out = new output("Failure!", "Bad Request. JSON syntax incorrect.")
            response.status(400).send(out);
        }
        else
            next();
    });


//get request handler to search for products with the stock_number given in the request parameter
    app.get('/products/:stock_no', function (req, res) {

            //encapsulating the handler code in try catch block to catch  any uncaught errors
            try {
                //Returning request status as failure if stock_no is not provided, is null or empty
                if (req.params.stock_no == undefined || req.params.stock_no == null || req.params.stock_no.trim() == "") {
                    const out = new output("Failure!", "Bad Request. Request parameter(stock_no) cannot be empty.")
                    return res.status(400).json(out);
                }
                //setting  the db adapter to read mode
                try {
                    db.read()
                }catch(dberror)
                {
                    const out = new output("Error while reading the db!", dberror.toString())
                    return res.status(500).json(out)
                }
                //finding the record in the db with the given stock_no
                var data = db.data.posts.find((p) => p.stock_number === req.params.stock_no)
                //Returning request status as failure if record of product with given stock_no is not found in db
                if (data == undefined || data == null) {
                    const out = new output("Error!", "Cannot find record. Product with stock_number=" + req.params.stock_no + " does not exist in the database.")
                    return res.status(404).json(out);
                }
                //Returning the data of the product with the given stock number.
                return res.status(200).json(data);
            } catch (error) {
                const out = new output("Error!", error.toString())
                return res.status(500).json(out)
            }
        }
    )

//post request handler to create record of the product with the data provided in the request body
    app.post('/products', function (req, res) {
        //encapsulating the handler code in try catch block to catch  any uncaught errors
        try {
            console.log(req.body)
            // Checking if request body is null or empty.
            // Returning t[he request response as failure if it is empty or null.
            if (!Object.keys(req.body).length) {
                const out = new output("Failure!", "Bad Request. Request body cannot be empty.")
                return res.status(400).json(out);
            }
            console.log(req.body.stock_number);
            //setting  the db adapter to read mode
            try {
                db.read()
            }catch(dberror)
            {
                const out = new output("Error while reading the db!", dberror.toString())
                return res.status(500).json(out)
            }
            // Checking if product with the provided stock number exists in the db.
            // If it exists, request response will be returned as failure and a new record will not be added to the db
            var data = db.data.posts.find((p) => p.stock_number === req.body.stock_number)
            if (data != undefined && data != null) {
                const out = new output("Error!", "Cannot create product entry as product with stock_number=" + req.body.stock_number + " already exists in the database.")
                return res.status(403).json(out);
            }
            // Pushing the record of the product with details provided in the request body
            if (req.body.stock_number == undefined || req.body.stock_number == null || req.body.stock_number.trim() == "") {
                const out = new output("Error!", "Cannot create product entry as stock_number field cannot be null or empty.")
                return res.status(400).json(out);
            }
            db.data.posts.push(req.body)
            //writing the changes into the db.
            try {
                db.write()
            }catch(dberror)
            {
                const out = new output("Error while writing to db!", dberror.toString())
                return res.status(500).json(out)
            }
            // Returning successful response.
            const out = new output("Success!", "Product with stock_number=" + req.body.stock_number + " added to the database.")
            return res.status(201).json(out);
        } catch (error) {
            const out = new output("Error!", error.toString())
            return res.status(500).json(out)
        }
    })

//put request handler to update record of the product with stock number provided as a request parameter.
// The product record will be updated with the product details provided in the request body.
    app.put('/products/:stock_no', function (req, res) {
        //encapsulating the handler code in try catch block to catch  any uncaught errors
        try {
            //Returning request status as failure if stock_no is not provided, is null or empty.
            if (req.params.stock_no == undefined || req.params.stock_no == null) {
                const out = new output("Failure!", "Bad Request. Request parameter(stock_no) cannot be empty.")
                return res.status(400).json(out);
            }
            // Checking if request body is null or empty.
            // Returning t[he request response as failure if it is empty or null.
            if (!Object.keys(req.body).length) {
                const out = new output("Failure!", "Bad Request. Request body cannot be empty.")
                return res.status(400).json(out);
            }
            //setting  the db adapter to read mode.
            try {
                db.read()
            }catch(dberror)
            {
                const out = new output("Error while reading the db!", dberror.toString())
                return res.status(500).json(out)
            }
            // Checking if product with the provided stock number exists in the db.
            // If it does not exist, request response will be returned as failure and record will not be updated.
            var data = db.data.posts.find((p) => p.stock_number == req.params.stock_no)
            if (data == undefined || data == null) {
                const out = new output("Error!", "Cannot update record as product with stock_number=" + req.params.stock_no + " does not exist in the database.")
                return res.status(404).json(out);
            }
            // If record is found in the db, product details will be updated with the product details provided in the
            // request body.
            data.name = req.body.name
            data.Description = req.body.Description
            data.Price = req.body.Price
            // Writing the changes into the db.
            try {
                db.write()
            } catch(dberror)
            {
                const out = new output("Error while writing to db!", dberror.toString())
                return res.status(500).json(out)
            }
            // Sending success response
            const out = new output("Success!", "Record of product with stock_number=" + req.params.stock_no + " updated in the database.")
            return res.status(200).json(out)
        } catch (error) {
            const out = new output("Error!", error.toString())
            return res.status(500).json(out)
        }
    })
}catch(error)
{
    console.log("An error occured during the execution of the code. Description: "+error.toString())
}