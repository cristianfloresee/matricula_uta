var oracledb = require('oracledb');
var connectionPool;

//createPool is invoked in a separate test file (not shown)


function createPool2() {
    console.log("holi");
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
            function (err, pool) {
                console.log("voila");
                if (err) reject(err);

                connectionPool = pool;
                resolve(pool);
            }
        );
    });
}

module.exports.createPool2 = createPool2;

function getPool() {
    return connectionPool;
}

module.exports.getPool = getPool;