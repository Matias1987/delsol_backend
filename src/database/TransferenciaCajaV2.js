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

const generarTransferenciaCaja = (data, callback) => {
  /**
   * first generate the egreso and ingreso, then generate the transferencia
   *
   * @param {Object} data - The data for the transferencia
   */

  dbEgreso.createEgreso(
    {
      fk_caja: data.caja_idcaja,
      monto: data.monto,
      observaciones: data.observaciones,
    },
    (err, egreso) => {
      if (err) return callback(err);

      dbIngreso.createIngreso(
        {
          fk_caja: data.caja_idcaja,
          monto: data.monto,
          observaciones: data.observaciones,
        },
        (err, ingreso) => {
          if (err) return callback(err);

          dbCajaMaster.generarTransferenciaCaja(
            {
              caja_idcaja: data.caja_idcaja,
              sucursal_idsucursal: data.sucursal_idsucursal,
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
