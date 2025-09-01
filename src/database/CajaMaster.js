const mysql_connection = require("../lib/mysql_connection");
const tc2 = require("./TransferenciaCajaV2");
const doQuery = (query, callback) => {
  console.log(query)
  const connection = mysql_connection.getConnection();
  connection.connect();
  if (!connection) {
    console.error("Database connection failed");
    return callback(new Error("Database connection failed"));
  }
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return callback(err);
    }
    callback(results);
  });
  connection.end();
};

function getCajaMaster(callback) {
  const query = `SELECT c.* FROM caja c WHERE c.nro=3 AND c.estado='ABIERTA'; `;
  doQuery(query, (results) => {
    if (!results) return callback(null);
    if (results.length < 1) return callback(null);
    callback(results[0].idcaja);
  });
}

function getBalance(callback) {
  getCajaMaster((idCajaMaster) => {
    console.log("Caja master id: ", idCajaMaster);
    if (!idCajaMaster) return callback(null);

    const query = `SELECT 
                    o.id,
                    o.fecha_f,
                    o.tipo, 
                    o.monto
                    FROM (
                    SELECT e.idegreso AS 'id', date_format(e.fecha, '%d-%m-%y') AS 'fecha_f',  'EGRESO' AS 'tipo', e.monto FROM caja_master.c_egreso e WHERE e.fk_caja=${idCajaMaster}
                    union
                    SELECT i.idingreso AS 'id', DATE_FORMAT(i.fecha, '%d-%m-%y') AS 'fecha_f', 'INGRESO' AS 'tipo', i.monto  FROM caja_master.c_ingreso i WHERE i.fk_caja=${idCajaMaster}
                    ) o
                    ORDER BY o.fecha_f;
                    `;
    console.log("Balance query: ", query);

    doQuery(query, (results) => {
      if (!results) return callback(null);
      callback(results);
    });
  });
}

function getCajasSucursales(callback) {
  const sql = `SELECT 
                    s.nombre AS 'sucursal', 
                    c.estado,
                    op.monto_efectivo,
                    c.idcaja
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
  console.log(sql);
  doQuery(sql, (results) => {
    if (!results) return callback(null);
    //console.log("Cajas sucursales: ", results);
    callback(results);
  });
}
/*
function generarTransferenciaACajaMaster(data, callback) {
  //get caja master
  getCajaMaster((err, idCajaMaster) => {
    if (idCajaMaster == null) return callback(null);

    if (err) return callback(err);
    // Now you have the cajaMaster, you can use it
    tc2.generarTransferenciaCaja(
      {
        id_caja_origen: data.id_caja_origen,
        id_caja_destino: idCajaMaster,
        monto: data.monto,
        monto_real: data.monto_real ? data.monto_real : data.monto,
        comentarios: data.comentarios,
      },
      callback
    );
  });
}*/

function marcarCajaComoControlada(idcaja, callback) {
  const sql = `UPDATE caja SET control_pendiente=0 WHERE idcaja=${idcaja};`;
  doQuery(sql,  (results) => {
    if (!results) return callback(results);
    callback(results);
  });
}

module.exports = {
  getBalance,
  getCajasSucursales,
  marcarCajaComoControlada,
  //generarTransferenciaACajaMaster,
  getCajaMaster,
};
