'use strict'

// LIBS
var express = require('express');
var http = require('http');
var socket = require('socket.io');
var bodyParser = require('body-parser');
var cors = require('cors');

// EXTRA IMPORTS
var pool = require('./app/database/pool');
//var user_routes = require('./app/routes/cities')

// VARIABLES
var server_port = process.env.PORT || 3000;
var app;
var httpServer;
var io;

initWebServer();

// FUNCTIONS
function initWebServer() {

    app = express();
    httpServer = http.Server(app);
    io = socket(httpServer);

    //app.use(user_routes);

    // LOAD MIDDLEWARES
    app.use(cors({ origin: '*' }));
    app.use(bodyParser.urlencoded({ extended: false })); //EN CADA PETICIÓN SE EJECUTARÁ ESTE MIDDLEWARE
    app.use(bodyParser.json()); //CONVIERTE LA INFO QUE RECIBA EN PETICIÓN A JSON

    // USING CALLBACKS
    /*
    pool.createPool(() => {
        console.log(`pool was created...`)
        httpServer.listen(server_port, () => {
            console.log(`webserver listening on http://localhost: ${server_port}...`);
        });
    })*/

    // USING PROMISES
    /*
    pool.createPool2()
        .then(() => {
            console.log(`pool was created...`)
            return httpServer.listen(server_port)
        })
        .then(() => console.log(`webserver listening on http://localhost: ${server_port}...`))
        .catch(err => console.log(err))
    
    */

    // USING ASYNC/AWAIT
    (async () => {
        try {
            let conn = await pool.createPool3()
            console.log(`pool was created...`)
            let server = await httpServer.listen(server_port)
            console.log(`webserver listening on http://localhost: ${server_port}...`);
        } catch (err) {
            console.log(err)
        }

    })()

}

function getSocket() {
    return io;
}

module.exports.getSocket = getSocket;