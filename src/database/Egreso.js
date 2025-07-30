// Example CRUD methods for Egreso with 'params' and 'callback' arguments

const db = require('./db'); // Adjust this to your DB connection module

// Create
function createEgreso(params, callback) {
    const connection = db.getconnection();
    if (!connection) {return callback(new Error('No database connection')); }

    const sql = 'INSERT INTO egresos SET ?';
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

// Read
function getEgreso(params, callback) {
    const connection = db.getconnection();
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
    const connection = db.getconnection();
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
    const connection = db.getconnection();
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
    const connection = db.getconnection();
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