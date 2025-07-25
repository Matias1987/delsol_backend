// Example CRUD methods for Egreso with 'params' and 'callback' arguments

const db = require('./db'); // Adjust this to your DB connection module

// Create
function createEgreso(params, callback) {
    const sql = 'INSERT INTO egresos SET ?';
    db.query(sql, params, callback);
}

// Read
function getEgreso(params, callback) {
    const sql = 'SELECT * FROM egresos WHERE id = ?';
    db.query(sql, [params.id], callback);
}

// Update
function updateEgreso(params, callback) {
    const sql = 'UPDATE egresos SET ? WHERE id = ?';
    db.query(sql, [params.data, params.id], callback);
}

// Delete
function deleteEgreso(params, callback) {
    const sql = 'DELETE FROM egresos WHERE id = ?';
    db.query(sql, [params.id], callback);
}

module.exports = {
    createEgreso,
    getEgreso,
    updateEgreso,
    deleteEgreso
};