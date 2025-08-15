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
function createIngreso(params, callback) {
    const query = `insert into c_ingreso (fk_caja, comentarios, monto) values (${connection.escape(params.idcaja)}, ${""}, ${connection.escape(params.monto)})`;
    doQuery(query, params, (result) => {
        if (result.insertId) {
            callback(null, { id: result.insertId, ...params });
        } else {
            callback(new Error('Error creating Ingreso'));
        }
    });
}

// Read
function getIngreso(params, callback) {
    const query = 'SELECT * FROM ingresos WHERE id = ?';
    doQuery(query, [params.id], (result) => {
        if (result.length > 0) {
            callback(null, result[0]);
        } else {
            callback(new Error('Ingreso not found'));
        }
    });
}

// Update
function updateIngreso(params, callback) {
    const query = 'UPDATE ingresos SET ? WHERE id = ?';
    doQuery(query, [params, params.id], (result) => {
        if (result.affectedRows > 0) {
            callback(null, { id: params.id, ...params });
        } else {
            callback(new Error('Error updating Ingreso'));
        }
    });
}





module.exports = {
    createIngreso,
    getIngreso,
    updateIngreso,
};