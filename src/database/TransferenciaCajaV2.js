const mysql_connection = require("../lib/mysql_connection");
const dbEgreso = require("../database/Egreso");
const dbIngreso = require("../database/Ingreso");

const doQuery = (query, params, callback) => {
  const connection = mysql_connection.getConnection();
  connection.connect();
  connection.query(query, params, (err, rows, fields) => {
    callback(rows);
  });
  connection.end();
};
 /**
   * first generate the egreso and ingreso, then generate the transferencia
   *
   * @param {Object} data - The data for the transferencia
   */
const generarTransferenciaCaja = (data, callback) => {

  console.log("Agregar transferencia");
  console.log(JSON.stringify(data));
  //return callback({}); //only for testing
  dbEgreso.createEgreso(
    {
      idcaja: data.id_sucursal_origen,
      monto: data.monto,
    },
    (err, egreso) => {
      if (err) return callback(err);
      console.log("EGRESO CREADO CON ID " + egreso.id);
      dbIngreso.createIngreso(
        {
          idcaja: data.id_sucursal_destino,
          monto: data.monto,
        },
        (err, ingreso) => {
          if (err) return callback(err);
          console.log("INGRESO CREADO CON ID " + ingreso.id);

          generar_transferencia(
            {
              c_egreso_idegreso: egreso.id,
              c_ingreso_idingreso: ingreso.id,
              c_caja_origen: data.id_sucursal_origen,
              c_caja_destino: data.id_sucursal_destino,
              monto: data.monto,
              observaciones: data.observaciones,
            },
            (err, transferencia) => {
              if (err) return callback(err);
              callback(null, { egreso, ingreso, transferencia });
            }
          );
        }
      );
    }
  );
};

const generar_transferencia = (data, callback) => {
  const query = `
    insert into caja_master.transferencia_caja
    (
      c_egreso_idegreso,
      c_ingreso_idingreso,
      monto, 
      id_caja_origen, 
      id_caja_destino,
      fecha
    )
    values
  (
    ${data.c_egreso_idegreso},
    ${data.c_ingreso_idingreso},
    ${data.monto},
    ${data.id_caja_origen},
    ${data.id_caja_destino},
    date(now())
  )
  `;
  doQuery(query, [], (result) => {
    callback(result);
  });
};

const obtener_transferencias_enviadas = (data, callback) => {
  const query = `SELECT tc.*, c1.nombre AS caja_origen, c2.nombre AS caja_destino 
               FROM transferencia_caja tc 
               JOIN caja c1 ON tc.id_caja_origen = c1.idcaja 
               JOIN caja c2 ON tc.id_caja_destino = c2.idcaja 
               WHERE tc.id_caja_origen = ?`;
  doQuery(query, [data.id_caja_origen], (result) => {
    callback(result);
  });
};
const obtener_transferencias_recibidas = (data, callback) => {
  const query = `SELECT tc.*, c1.nombre AS caja_origen, c2.nombre AS caja_destino 
               FROM transferencia_caja tc 
               JOIN caja c1 ON tc.id_caja_origen = c1.idcaja 
               JOIN caja c2 ON tc.id_caja_destino = c2.idcaja 
               WHERE tc.id_caja_destino = ?`;
  doQuery(query, [data.id_caja_destino], (result) => {
    callback(result);
  });
};

module.exports = {
  generarTransferenciaCaja,
  obtener_transferencias_enviadas,
  obtener_transferencias_recibidas,
};
