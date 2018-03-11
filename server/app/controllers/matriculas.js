'use strict'

var oracledb = require('oracledb');
var pool = require('../database/pool');
var socket = require('../../index');

var object_format = { outFormat: oracledb.OBJECT };

async function getMatriculas(req, res) {
	
	try {
		let conn = await pool.getPool().getConnection()

		let matriculados = conn.execute(
			'SELECT * FROM V_RESUMEN_MATRICULADOS', {}, object_format
		)

		let nuevos_matriculados = conn.execute(
			'SELECT * FROM V_RESUMEN_MATRICULADOS_NUEVOS order by anio DESC, facultad, cc', {}, object_format
			//'SELECT * FROM V_RESUMEN_MATRICULADOS_NUEVOS order by facultad, car_cod_carrera', {}, object_format
		)

		let results = [await matriculados, await nuevos_matriculados]
		results[0] = results[0].rows;
		results[1] = results[1].rows;

		let release = await conn.release()

		//API
		if (req.url != '/orcl12c') {
			res.send(results) //RESPUESTA AL CLIENTE
		}
		//CQN ORACLE
		else {
			let io = socket.getSocket()
			io.emit('change_matriculas', results) //RESPUESTA AL CLIENTE POR SOCKET
			res.send(results) //RESPUESTA A LA DB
		}
	}
	catch (err) {
		console.log(err)
	}
}

module.exports = {
	getMatriculas
}