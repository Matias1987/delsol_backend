const mysql_connection = require("../lib/mysql_connection")
const tc2 = require("./TransferenciaCajaV2")
const doQuery = (query, callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    if (!connection) {
        console.error('Database connection failed');
        return callback(new Error('Database connection failed'));
    }
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return callback(err);
        }
        callback(null, results);
    });
    connection.end();
};

function getCajaMaster(callback) {

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
        callback(results);
    });
}

function getCajasSucursales(callback){
    const sql = `SELECT 
                    s.nombre AS 'sucursal', 
                    c.estado,
                    op.monto_efectivo
                    FROM 
                    caja c INNER join sucursal s ON s.idsucursal=c.sucursal_idsucursal,
                    (
                        SELECT 
                            cb.caja_idcaja, 
                            SUM(cmp.monto) AS 'monto_efectivo'
                        FROM 
                            cobro cb, 
                            cobro_has_modo_pago cmp
                        WHERE 
                            cmp.cobro_idcobro = cb.idcobro AND 
                            cb.caja_idcaja IN 
                            (
                                SELECT _c.idcaja
                                FROM caja _c
                                WHERE _c.control_pendiente=1
                            ) AND 
                            cmp.modo_pago='tarjeta'
                        GROUP BY cb.caja_idcaja
                    ) op
                    WHERE 
                    c.idcaja = op.caja_idcaja
                    ;`;
    console.log(sql)
    doQuery(sql, (err, results) => {
        if (err) return callback(err);
        //console.log("Cajas sucursales: ", results);
        callback(results);
    });
}

function generarTransferenciaACajaMaster(data, callback) {
    //get caja master
    getCajaMaster((err, idCajaMaster) => {
        if (err) return callback(err);
        // Now you have the cajaMaster, you can use it
        tc2.generarTransferenciaCaja({
            id_caja_origen: data.id_caja_origen,
            id_caja_destino: idCajaMaster,
            monto: data.monto,
            comentarios: data.comentarios,
        }, callback);
    });
}

function marcarCajaComoControlada(idcaja, callback) {
    const sql = `UPDATE caja SET control_pendiente=0 WHERE idcaja=?;`;
    doQuery(sql, [idcaja], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
}

module.exports = {
    getBalance,
    getCajasSucursales,
    marcarCajaComoControlada,
    generarTransferenciaACajaMaster
};