const mysql_connection = require("../lib/mysql_connection")

const doQuery = (query, callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect()
    if (!connection) {
        console.error('Database connection failed');
        return callback(new Error('Database connection failed'));
    }
    connection.query(query,  (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return callback(err);
        }
        console.log("Query executed successfully:", query);
        callback(null, results);
    });
    connection.end();
};

// Create FondoFijo
function create(params, callback) {
    const sql = `INSERT INTO caja (sucursal_idsucursal, monto_inicial, estado, nro) VALUES (?, ?, ?, ?)`;
    doQuery(sql, (err, results) => {
        if (err) return callback(err);
        const id = results.insertId;
        callback({ id, ...params });
    });
}

// Get all FondoFijo
function getAll(callback) {
    console.log("get all......")
    const sql = 'SELECT * FROM caja c where c.nro=2 and c.estado="ABIERTO"';
    doQuery(sql, (err, results) => {
        if (err) {
            console.log("error....")
            return callback(err);
        }
        callback(results);
    });
}

// Get FondoFijo by ID
function getById(id, callback) {
    const sql = 'SELECT * FROM fondofijo WHERE id = ?';
    doQuery(sql, (err, results) => {
        if (err) return callback(err);
        callback(results[0]);
    });
}

function getForSucursal(idsucursal, callback) {
    const sql = `SELECT * FROM caja c WHERE c.sucursal_idsucursal=? AND c.estado='ABIERTO' AND c.nro=2;`;
    doQuery(sql,  (err, results) => {
        if (err) return callback(err);
        callback(results[0]);
    });
}


function getBalance(idsucursal, callback) {
    const sql = `SELECT op.* from (
                    SELECT e.idegreso AS 'id', 'egreso' AS 'tipo', e.fecha, e.monto FROM c_egreso e WHERE e.fk_caja=0 
                    UNION 
                    SELECT i.idingreso AS 'id', 'ingreso' AS 'tipo', i.fecha, i.monto FROM c_ingreso i WHERE i.fk_caja=0
                    ) op ORDER BY op.id ;`
    doQuery(sql, (err, results) => {
        if (err) return callback(err);
        callback(results);
    });
}

module.exports = {
    create,
    getAll,
    getById,
    getForSucursal,
    getBalance,
};