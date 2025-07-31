const mysql_connection = require("../lib/mysql_connection")

const doQuery = (query, params, callback) => {
    const connection = mysql_connection.getConnection();
    connection.open();
    if (!connection) {
        console.error('Database connection failed');
        return callback(new Error('Database connection failed'));
    }
    connection.query(query, params, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return callback(err);
        }
        callback(null, results);
    });
    connection.end();
};

// Create FondoFijo
function create(params, callback) {
    const sql = `INSERT INTO caja (sucursal_idsucursal, monto_inicial, estado, nro) VALUES (?, ?, ?, ?)`;
    doQuery(sql, params, (err, results) => {
        if (err) return callback(err);
        const id = results.insertId;
        callback(null, { id, ...params });
    });
}

// Get all FondoFijo
function getAll(callback) {
    const sql = 'SELECT * FROM caja c where c.nro=2 and c.estado="ABIERTO"';
    doQuery(sql, [], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
}

// Get FondoFijo by ID
function getById(id, callback) {
    const sql = 'SELECT * FROM fondofijo WHERE id = ?';
    doQuery(sql, [id], (err, results) => {
        if (err) return callback(err);
        callback(null, results[0]);
    });
}

function getForSucursal(idsucursal, callback) {
    const sql = `SELECT * FROM caja c WHERE c.sucursal_idsucursal=? AND c.estado='ABIERTO' AND c.nro=2;`;
    doQuery(sql, [idsucursal], (err, results) => {
        if (err) return callback(err);
        callback(null, results[0]);
    });
}


function getBalance(idsucursal, callback) {
    const sql = `SELECT op.* from (
                    SELECT e.idegreso AS 'id', 'egreso' AS 'tipo', e.fecha, e.monto FROM c_egreso e WHERE e.fk_caja=0 
                    UNION 
                    SELECT i.idingreso AS 'id', 'ingreso' AS 'tipo', i.fecha, i.monto FROM c_ingreso i WHERE i.fk_caja=0
                    ) op ORDER BY op.id ;`
                     ;
    doQuery(sql, [], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
}

module.exports = {
    create,
    getAll,
    getById,
    getForSucursal,
    getBalance,
};