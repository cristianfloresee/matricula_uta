'use strict'

// LIBS
var express = require('express');
var http = require('http');
var socket = require('socket.io');
var bodyParser = require('body-parser');
var cors = require('cors');

// EXTRA IMPORTS
var pool = require('./app/database/pool');
var user_routes = require('./app/routes/matriculas')

// VARIABLES
var server_port = process.env.PORT || 3000;
var num_connections = 0;
var app;
var httpServer;
var io;

initWebServer();

// FUNCTIONS
function initWebServer() {

	app = express()
	httpServer = http.Server(app)
	io = socket(httpServer)

	// LOAD MIDDLEWARES
	app.use(cors({ origin: '*' }));
	app.use(bodyParser.urlencoded({ extended: false })); //EN CADA PETICIÓN SE EJECUTARÁ ESTE MIDDLEWARE
	app.use(bodyParser.json()); //CONVIERTE LA INFO QUE RECIBA EN PETICIÓN A JSON
	app.use(user_routes);

	(async () => {
		try {
			let conn = await pool.createPool()
			console.log(`pool was created...`)
			let server = await httpServer.listen(server_port)
			console.log(`webserver listening on http://localhost: ${server_port}...`)

			io.on('connection', (socket) => {

				num_connections++;
				console.log(`\nuser ip ${socket.handshake.address} has connected...\nconnected users: ${num_connections}`)

				socket.on('disconnect', () => {
					num_connections--;
					console.log(`\nuser disconnected...\nconnected users: ${num_connections}`)
				})

			})
		} catch (err) {
			console.log(err)
		}
	})()
}

function getSocket() {
	return io;
}

module.exports.getSocket = getSocket;
