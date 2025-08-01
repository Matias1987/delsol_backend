const mysql_connection = require("../lib/mysql_connection")

const doQuery = (query, params, callback) => {
    const connection = mysql_connection.getConnection();
    connection.open();
    if (!connection) {
        console.error('Database connection failed');
        return callback(new Error('Database connection failed'));
    }
    connection.query(query, params, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return callback(err);
        }
        callback(null, results);
    });
    connection.end();
};

function getBalance(idsucursal, callback) {
    const sql = `SELECT op.* from (
                    SELECT e.idegreso AS 'id', 'egreso' AS 'tipo', e.fecha, e.monto FROM c_egreso e WHERE e.fk_caja=0 
                    UNION 
                    SELECT i.idingreso AS 'id', 'ingreso' AS 'tipo', i.fecha, i.monto FROM c_ingreso i WHERE i.fk_caja=0
                    ) op ORDER BY op.id ;`
                     ;
    doQuery(sql, [], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
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
                            cmp.modo_pago='efectivo'
                        GROUP BY cb.caja_idcaja
                    ) op
                    WHERE 
                    c.idcaja = op.caja_idcaja
                    ;`;
    doQuery(sql, [], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
}

module.exports = {
    getBalance,
    getCajasSucursales
};