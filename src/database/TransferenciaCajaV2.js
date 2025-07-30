const mysql_connection = require("../lib/mysql_connection")

const doQuery = (query, params, callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(query, params, (err, rows, fields) => {
        callback(rows);
    })
    connection.end();
}

const agregar_transferencia = (data,callback) => {

    const query_egreso =`INSERT INTO caja_master.c_egreso (monto, fk_caja, fk_motivo) VALUE (0,0,0);`;
    const query_ingreso = `INSERT INTO caja_master.c_ingreso ( monto, fk_caja ) VALUE (0,0);`;

    doQuery(query_egreso, [], (egreso) => {
        doQuery(query_ingreso, [], (ingreso) => {   
            const query_transferencia = `INSERT INTO transferencia_caja (c_egreso_idegreso, c_ingreso_idingreso, monto, id_caja_origen, id_caja_destino) 
                                         VALUES (${egreso.insertId}, ${ingreso.insertId}, ${data.monto}, ${data.fkorigen}, ${data.fkdestino});`;
            doQuery(query_transferencia, [], (transferencia) => {
                callback(transferencia);
            });
        });
    });
}

const obtener_transferencias_enviadas = (data, callback) => {
    const query = `SELECT tc.*, c1.nombre AS caja_origen, c2.nombre AS caja_destino 
               FROM transferencia_caja tc 
               JOIN caja c1 ON tc.id_caja_origen = c1.idcaja 
               JOIN caja c2 ON tc.id_caja_destino = c2.idcaja 
               WHERE tc.id_caja_origen = ?`;
    doQuery(query, [data.id_caja_origen], (result) => {
        callback(result);
    });
}
const obtener_transferencias_recibidas = (data, callback) => {
    const query = `SELECT tc.*, c1.nombre AS caja_origen, c2.nombre AS caja_destino 
               FROM transferencia_caja tc 
               JOIN caja c1 ON tc.id_caja_origen = c1.idcaja 
               JOIN caja c2 ON tc.id_caja_destino = c2.idcaja 
               WHERE tc.id_caja_destino = ?`;
    doQuery(query, [data.id_caja_destino], (result) => {
        callback(result);
    });
}




module.exports = {
    agregar_transferencia,
    obtener_transferencias_enviadas,
    obtener_transferencias_recibidas,

}