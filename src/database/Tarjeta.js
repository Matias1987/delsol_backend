const mysql_connection = require("../lib/mysql_connection");

const obtener_tarjetas = (callback) => {
  const connection = mysql_connection.getConnection();
  connection.connect();
  connection.query(
    "select t.* from tarjeta t where t.activo = 1",
    (err, rows, fields) => {
      return callback(rows);
    }
  );
  connection.end();
};

const agregar_tarjeta = (data, callback) => {
  const connection = mysql_connection.getConnection();
  connection.connect();
  var sql = "insert into tarjeta (nombre) values (?)";

  var values = [[data.nombre]];

  connection.query(sql, values, (err, result) => {
    return callback(result.insertId);
  });
  connection.end();
};

const desactivar_tarjeta = (data, callback) => {
  const connection = mysql_connection.getConnection();
  connection.connect();
  const query = `update tarjeta t set t.activo = if(t.activo = 0, 1,0) where t.idtarjeta=${data.idtarjeta};`;
  //console.log(query)
  connection.query(query, (err, resp) => {
    callback(resp);
  });
  connection.end();
};

const cobros_tarjeta = (data, callback) => {
  const connection = mysql_connection.getConnection();
  connection.connect();
  const query = `SELECT 
    c.idcobro,
    cmp.monto,
    cmp.cant_cuotas, 
    cmp.tarjeta,
    c.fecha,
    c.tipo,
    CONCAT(cl.apellido,' ', cl.nombre) AS 'cliente'
    FROM 
    ( SELECT cmp0.*, t.nombre AS 'tarjeta' from cobro_has_modo_pago cmp0 INNER JOIN tarjeta t ON cmp0.fk_tarjeta = t.idtarjeta AND cmp0.modo_pago='tarjeta' ) cmp, 
    cobro c , cliente cl 
    WHERE  
    cl.idcliente = c.cliente_idcliente AND 
    c.idcobro = cmp.cobro_idcobro AND 
    c.anulado=0 AND 
    DATE(c.fecha) = DATE('${data.fecha}')
    ORDER BY cmp.idcobro_mp DESC;`;
   // console.log(query);
  connection.query(query, (err, resp) => {
    callback(resp);
  });
  connection.end();
};

const cuotas_pendientes = (data, callback) => {
  const connection = mysql_connection.getConnection();
  connection.connect();
  const query = `SELECT 
                  c1.*,
                  date_format(c1.fecha,'%d/%m/%Y') AS 'fecha_f', 
                  t.nombre AS 'tarjeta' 
                FROM 
                  tarjeta t,
                  (
                    SELECT 
                      c.idcobro, 
                      TIMESTAMPDIFF(MONTH,DATE(c.fecha),DATE('${data.fecha}')) AS 'diff',
                      TIMESTAMPDIFF(
                      MONTH, 
                      DATE(CONCAT(YEAR(c.fecha),'-',MONTH(c.fecha),'-1')),
                      DATE(CONCAT(YEAR('${data.fecha}'),'-',MONTH('${data.fecha}'),'-1'))
                      ) AS 'diff2',
                      
                      cmp.cant_cuotas, 
                      c.fecha, 
                      cmp.fk_tarjeta 
                      
                    FROM 
                      cobro c 
                      INNER JOIN cobro_has_modo_pago cmp ON cmp.cobro_idcobro = c.idcobro 
                      AND c.anulado = 0 
                      AND cmp.modo_pago = 'tarjeta' 
                      AND cmp.fk_tarjeta IS NOT null
                      WHERE DATE(c.fecha) < DATE('${data.fecha}')
                  ) c1 
                WHERE 
                  t.idtarjeta = c1.fk_tarjeta AND 
                  c1.diff>0 AND 
                  DATE_ADD(
                    DATE(c1.fecha), 
                    INTERVAL CAST(c1.cant_cuotas AS UNSIGNED) MONTH
                  ) >= DATE('${data.fecha}') 
                  AND DATE(c1.fecha) > DATE_ADD(
                    DATE('${data.fecha}'), 
                    INTERVAL - (
                      CAST(c1.cant_cuotas AS UNSIGNED) + 1
                    ) MONTH
                  )
                  AND DAY(c1.fecha) = DAY('${data.fecha}')
                ;`;
  console.log(query);
  connection.query(query, (err, resp) => {
    callback(resp);
  });
  connection.end();
}

module.exports = {
  obtener_tarjetas,
  agregar_tarjeta,
  desactivar_tarjeta,
  cobros_tarjeta,
  cuotas_pendientes,
};
