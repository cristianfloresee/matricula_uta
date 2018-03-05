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

// FUNCIONES
function initWebServer() {

    app = express();
    httpServer = http.Server(app);
    io = socket(httpServer);

    //app.use(user_routes);

    // CARGO MIDDLEWARES
    app.use(cors({ origin: '*' }));
    app.use(bodyParser.urlencoded({ extended: false })); //EN CADA PETICIÓN SE EJECUTARÁ ESTE MIDDLEWARE
    app.use(bodyParser.json()); //CONVIERTE LA INFO QUE RECIBA EN PETICIÓN A JSON

    pool.createPool2(() => {
        //console.log("res: ", res);
        console.log("pool was created...")
        httpServer.listen(server_port, () => {
            console.log('webserver listening on localhost:3000');
        });
    })

}