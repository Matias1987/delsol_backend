const db = require('./db');

// Create FondoFijo
function create(params, callback) {
    const sql = 'INSERT INTO fondofijo SET ?';
    db.query(sql, params, callback);
}

// Get all FondoFijo
function getAll(callback) {
    const sql = 'SELECT * FROM fondofijo';
    db.query(sql, callback);
}

// Get FondoFijo by ID
function getById(id, callback) {
    const sql = 'SELECT * FROM fondofijo WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) return callback(err);
        callback(null, results[0]);
    });
}

// Update FondoFijo
function update(id, params, callback) {
    const sql = 'UPDATE fondofijo SET ? WHERE id = ?';
    db.query(sql, [params, id], callback);
}

// Delete FondoFijo
function remove(id, callback) {
    const sql = 'DELETE FROM fondofijo WHERE id = ?';
    db.query(sql, [id], callback);
}

module.exports = {
    create,
    getAll,
    getById,
    update,
    remove
};