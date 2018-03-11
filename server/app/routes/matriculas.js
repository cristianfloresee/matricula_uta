'use strict'

var express = require('express');
var matriculas_controller = require('../controllers/matriculas');

var api = express.Router();

//CQN ORACLE
api.get('/orcl12c', matriculas_controller.getMatriculas); 

//CLIENTE
api.get('/api/matriculas', matriculas_controller.getMatriculas);

module.exports = api;