var oracledb = require('oracledb');
var connectionPool;

// CALLBACK FUNCTION
function createPool(callback) {
    oracledb.createPool(
        {
            user: "hr",
            password: "hr",
            connectString: "localhost:1522/orcl12c",
            poolMin: 2,
            poolMax: 20,
            poolIncrement: 2,
            poolTimeout: 12000
        },
        (err, pool) => {
            if (err) throw err;
            connectionPool = pool;
            callback(pool);
        }
    );
}

// PROMISE FUNCTION
/*function createPool2() {
    return new Promise((resolve, reject) => {
        oracledb.createPool(
            {
                user: "hr",
                password: "hr",
                connectString: "localhost:1522/orcl12c",
                poolMin: 2,
                poolMax: 20,
                poolIncrement: 2,
                poolTimeout: 12000
            },
            (err, pool) => {
                if (err) reject(err);
                connectionPool = pool;
                resolve(pool);
            }
        );
    });
}*/


function createPool3() {
    return new Promise(async (resolve, reject) => {
        let conn;
        try {
            conn = await oracledb.createPool(
                {
                    user: "hr",
                    password: "hr",
                    connectString: "localhost:1522/orcl12c",
                    poolMin: 2,
                    poolMax: 20,
                    poolIncrement: 2,
                    poolTimeout: 12000
                });
            connectionPool = conn;
            resolve(conn);
        }
        catch (err) {
            reject(err)
        }
    })

}

module.exports.createPool3 = createPool3;

function getPool() {
    return connectionPool;
}

module.exports.getPool = getPool;