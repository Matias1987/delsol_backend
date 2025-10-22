// Example CRUD methods for Egreso with 'params' and 'callback' arguments

const mysql_connection = require("../lib/mysql_connection")

const doQuery = (query,  callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(query, (err, response, fields) => {
        console.log("Query executed: " + query);
        if(err)
        {
            console.error("Database error:", err);
            return callback(err);
        }
        console.log("Query result:" + response);
        callback(response);
    })
    connection.end();
} 

// Create
function createIngreso(params, callback) {
    console.log("creando ingreso......")
    const query = `insert into caja_master.c_ingreso (fk_caja, comentarios, monto) values (${params.idcaja}, '${params.fuente}', ${params.monto})`;
    console.log(query)
    doQuery(query, (result) => {
        console.log(result.insertId)
        if (typeof result.insertId !== 'undefined') {
            console.log("returning")
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