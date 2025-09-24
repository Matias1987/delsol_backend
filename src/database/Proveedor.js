const { parse_date_for_mysql } = require("../lib/helpers");
const mysql_connection = require("../lib/mysql_connection");
const { doQuery } = require("./helpers/queriesHelper");

const agregar_proveedor = (data, callback) => {
  const connection = mysql_connection.getConnection();
  connection.connect();
  connection.query(
    `SELECT p.idproveedor FROM proveedor p WHERE p.cuit = ${connection.escape(
      data.cuit
    )}`,
    (err, resp) => {
      if (resp.length > 0) {
        callback(-1);
      } else {
        connection.query(
          "INSERT INTO `proveedor` (`cuit`, `nombre`) VALUES (" +
            connection.escape(data.cuit) +
            ", " +
            connection.escape(data.nombre) +
            ");",
          (err, result, fields) => {
            callback(result.insertId);
          }
        );
      }
      connection.end();
    }
  );
};

const obtener_proveedores = (callback) => {
  const connection = mysql_connection.getConnection();
  connection.connect();
  connection.query(
    "SELECT * FROM proveedor p order by p.nombre asc;",
    (err, rows, fields) => {
      callback(rows);
    }
  );
  connection.end();
};

const obtener_ficha_proveedor = (data, callback) => {
  const query = `SELECT 
                    op.*,
                    if(op.tipo='FACTURA' || op.tipo='CM', op.monto, 0) AS 'debe',
                    if(op.tipo='PAGO',op.monto,0) AS 'haber' 
                    FROM (
                        SELECT 
                        'FACTURA' AS 'tipo', 
                        concat(if(f.es_remito=1 , 'Remito ', 'Factura '), f.numero) as 'detalle',
                        f.idfactura AS 'id', 
                        f.monto, 
                        date_format(f.fecha , '%d-%m-%y') AS 'fecha_f',
                        f.fecha
                        FROM factura f 
                        WHERE 
                            f.proveedor_idproveedor=${data.idproveedor} and 
                            f.activo=1 and 
                            (case when '${
                              data.modo
                            }'='-1' then true else f.es_remito=${
    data.modo == 0 ? 1 : 0
  } end)
                        UNION
                        (
                            SELECT 'PAGO' AS 'tipo', 
                            'Pago' as 'detalle',
                            pp.id AS 'id',  
                            pp.monto, 
                            date_format(pp.fecha , '%d-%m-%y') AS 'fecha_f',
                            pp.fecha
                            FROM pago_proveedor pp 
                            WHERE 
                                pp.fk_proveedor=${data.idproveedor} and 
                                pp.activo=1 and 
                                (case when '${
                                  data.modo
                                }'='-1' then true else pp.modo_ficha=${
    data.modo
  } end)
                        )
                        UNION
                        (
                            SELECT 
                            'CM' AS 'tipo', 
                            concat('Carga Manual: ', cm.comentarios)  as 'detalle',
                            cm.id AS 'id',  
                            cm.monto, 
                            date_format(cm.fecha , '%d-%m-%y') AS 'fecha_f',
                            cm.fecha
                            FROM  carga_manual_proveedor cm 
                            WHERE 
                                cm.fk_proveedor=${data.idproveedor} and 
                                cm.activo=1 and 
                                (case when '${
                                  data.modo
                                }'='-1' then true else cm.modo_ficha=${
    data.modo
  } end)
                        )
                    ) op
                    ORDER BY op.fecha asc 
                    ;`;

  //console.log(query)

  const connection = mysql_connection.getConnection();

  connection.connect();

  connection.query(query, (err, rows) => {
    callback(rows);
  });

  connection.end();
};

const detalle_proveedor = (data, callback) => {
  const query = `select * from proveedor p where p.idproveedor= ${data} `;
  //console.log(query)
  const connection = mysql_connection.getConnection();
  connection.connect();
  connection.query(query, (err, rows) => {
    callback(rows);
  });
  connection.end();
};

const agregar_pago_proveedor = (data, callback) => {
  const connection = mysql_connection.getConnection();
  connection.connect();
  const query = `INSERT INTO pago_proveedor (monto, fk_proveedor, modo_ficha, fecha) VALUES (${
    data.monto
  }, ${data.fk_proveedor}, ${data.modo}, '${parse_date_for_mysql(
    data.fecha
  )}')`;
  //console.log(query)
  connection.query(query, (err, resp) => {
    if (data.efectivo.checked) {
      const _q = `INSERT INTO pago_proveedor_modo (modo_pago, fk_pago_proveedor, monto) VALUES ('efectivo', ${resp.insertId}, ${data.efectivo.monto});`;
      connection.query(_q);
    }
    if (data.cheque.checked) {
      const _q = `INSERT INTO pago_proveedor_modo (modo_pago, fk_pago_proveedor, monto, fk_banco) VALUES ('cheque', ${resp.insertId}, ${data.cheque.monto}, ${data.cheque.fkbanco});`;
      connection.query(_q);
    }
    if (data.transferencia.checked) {
      const _q = `INSERT INTO pago_proveedor_modo (modo_pago, fk_pago_proveedor, monto, fk_banco) VALUES ('transferencia', ${resp.insertId}, ${data.transferencia.monto}, ${data.transferencia.fkbanco});`;
      //console.log(_q)
      connection.query(_q);
    }
    callback(resp);
    connection.end();
  });
};

const agregar_cm_proveedor = (data, callback) => {
  const connection = mysql_connection.getConnection();
  connection.connect();
  const query = `INSERT INTO carga_manual_proveedor  (fk_proveedor, monto, comentarios, modo_ficha) VALUES (${data.fk_proveedor}, ${data.monto}, '${data.comentarios}', ${data.modo})`;
  //console.log(query)
  connection.query(query, (err, resp) => {
    callback(resp);
  });
  connection.end();
};

const pagos_atrasados_proveedores = (data, callback) => {
  const query = `SELECT 
                    p0.nombre,
                    p0.idproveedor,
                    ops.*
                    FROM proveedor p0 INNER JOIN 
                    (
                        SELECT 
                        ff.proveedor_idproveedor,
                        ff.monto AS 'd',
                        pps.monto AS 'h'
                        FROM 
                        (
                            SELECT SUM(f.monto) AS 'monto', f.proveedor_idproveedor FROM factura f WHERE DATE(f.fecha) < DATE_ADD(DATE(NOW()), INTERVAL -1 MONTH ) GROUP BY f.proveedor_idproveedor
                        ) AS ff,
                        (
                            SELECT 
                                SUM(pp.monto) AS 'monto',
                                SUM(pp.intime) AS 'intime', 
                                pp.idproveedor 
                                FROM  
                                (
                                    SELECT 
                                    DATE('1970-1-1') AS 'fecha',
                                    0 AS 'intime',		
                                    0 AS 'monto',
                                    p.idproveedor 
                                    FROM proveedor p
                                    UNION
                                    SELECT 
                                    DATE(pp1.fecha) AS 'fecha',
                                    if(DATE(pp1.fecha) >= DATE_ADD(DATE(NOW()), INTERVAL -3 MONTH) , 1 , 0) AS 'intime',
                                    pp1.monto,
                                    pp1.fk_proveedor AS 'idproveedor' 
                                    FROM pago_proveedor pp1
                                )pp 
                            GROUP BY pp.idproveedor
                        ) pps
                            WHERE 
                            pps.intime = 0 AND 
                            pps.monto < ff.monto AND 
                            pps.idproveedor = ff.proveedor_idproveedor
                    ) ops ON ops.proveedor_idproveedor = p0.idproveedor;
                        ;
                    `;

        doQuery(query,(response)=>{
            //console.log(JSON.stringify(response.data))
            callback(response.data)
        })
};

module.exports = {
  agregar_proveedor,
  obtener_proveedores,
  obtener_ficha_proveedor,
  detalle_proveedor,
  agregar_pago_proveedor,
  agregar_cm_proveedor,
  pagos_atrasados_proveedores,
};
