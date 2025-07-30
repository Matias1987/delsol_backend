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

function getBalance(idsucursal, callback) {
    const sql = `SELECT op.* from (
                    SELECT e.idegreso AS 'id', 'egreso' AS 'tipo', e.fecha, e.monto FROM c_egreso e WHERE e.fk_caja=0 
                    UNION 
                    SELECT i.idingreso AS 'id', 'ingreso' AS 'tipo', i.fecha, i.monto FROM c_ingreso i WHERE i.fk_caja=0
                    ) op ORDER BY op.id ;`
                     ;
    db.query(sql, [idsucursal], callback);
}

module.exports = {
    create,
    getAll,
    getById,
    update,
    remove
};