'use strict'

var oracledb = require('oracledb');
var db_config = require('./db_config.js');
var connectionPool;

function createPool() {
    return new Promise(async (resolve, reject) => {
        let conn
        try {
            conn = await oracledb.createPool(db_config)
            connectionPool = conn;
            resolve(conn)
        }
        catch (err) {
            reject(err)
        }
    })
}

function getPool() {
    return connectionPool;
}

module.exports = {
    createPool,
    getPool
};