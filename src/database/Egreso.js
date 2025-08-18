const mysql_connection = require("../lib/mysql_connection");
// Example CRUD methods for Egreso with 'params' and 'callback' arguments
// Create
function createEgreso(params, callback) {
    const connection = mysql_connection.getConnection();
    if (!connection) {return callback(new Error('No database connection')); }

    const sql = `insert into caja_master.c_egreso (fk_caja, fk_motivo, monto) values (${connection.escape(params.idcaja)}, ${connection.escape(1)}, ${connection.escape(params.monto)})`;
    console.log(sql)
    connection.connect();

    connection.query(sql, (err,results)=>{
        if (err) {
            return callback(err);
        }
        // Assuming results.insertId contains the ID of the newly created record
        callback(null, { id: results.insertId, ...params });
    });
    connection.end();
}

// Read
function getEgreso(params, callback) {
    const connection = mysql_connection.getConnection();
    if (!connection) {return callback(new Error('No database connection')); }

    const sql = 'SELECT * FROM egresos WHERE id = ?';
    connection.connect();

    connection.query(sql, params, (err,results)=>{
        if (err) {
            return callback(err);
        }
        // Assuming results.insertId contains the ID of the newly created record
        callback(null, { id: results.insertId, ...params });
    });
    connection.end();
}

// Update
function updateEgreso(params, callback) {
    const connection = mysql_connection.getConnection();
    if (!connection) {return callback(new Error('No database connection')); }

    const sql = 'UPDATE egresos SET ? WHERE id = ?';
    connection.connect();

    connection.query(sql, params, (err,results)=>{
        if (err) {
            return callback(err);
        }
        // Assuming results.insertId contains the ID of the newly created record
        callback(null, { id: results.insertId, ...params });
    });
    connection.end();
}

// Delete
function deleteEgreso(params, callback) {
    const connection = mysql_connection.getConnection();
    if (!connection) {return callback(new Error('No database connection')); }

    const sql = 'DELETE FROM egresos WHERE id = ?';
    connection.connect();

    connection.query(sql, params, (err,results)=>{
        if (err) {
            return callback(err);
        }
        // Assuming results.insertId contains the ID of the newly created record
        callback(null, { id: results.insertId, ...params });
    });
    connection.end();
}

function getEgresoList(callback) {
    const connection = mysql_connection.getConnection();
    if (!connection) {return callback(new Error('No database connection')); }

    const sql = 'SELECT * FROM egresos';
    connection.connect();

    connection.query(sql, (err, results) => {
        if (err) {
            return callback(err);
        }
        callback(null, results);
    });
    connection.end();
}

module.exports = {
    createEgreso,
    getEgreso,
    updateEgreso,
    deleteEgreso,
    getEgresoList,
};