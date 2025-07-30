// Example CRUD methods for Egreso with 'params' and 'callback' arguments

const mysql_connection = require("../lib/mysql_connection")

const doQuery = (query, params, callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(query, params, (err, rows, fields) => {
        callback(rows);
    })
    connection.end();
} 

// Create
function createEgreso(params, callback) {
   const query = 'INSERT INTO egresos SET ?';
   doQuery(query, params, (result) => {
       if (result.insertId) {
           callback(null, { id: result.insertId, ...params });
       } else {
           callback(new Error('Error creating Egreso'));
       }
   });
}

// Read
function getEgreso(params, callback) {
    const query = 'SELECT * FROM egresos WHERE id = ?';
    doQuery(query, [params.id], (result) => {
        if (result.length > 0) {
            callback(null, result[0]);
        } else {
            callback(new Error('Egreso not found'));
        }
    });
}

// Update
function updateEgreso(params, callback) {
    const query = 'UPDATE egresos SET ? WHERE id = ?';
    doQuery(query, [params, params.id], (result) => {
        if (result.affectedRows > 0) {
            callback(null, { id: params.id, ...params });
        } else {
            callback(new Error('Error updating Egreso'));
        }
    });
}

// Delete
function deleteEgreso(params, callback) {
    const query = 'DELETE FROM egresos WHERE id = ?';
    doQuery(query, [params.id], (result) => {
        if (result.affectedRows > 0) {
            callback(null, { message: 'Egreso deleted successfully' });
        } else {
            callback(new Error('Error deleting Egreso'));
        }
    });
}

module.exports = {
    createEgreso,
    getEgreso,
    updateEgreso,
    deleteEgreso
};