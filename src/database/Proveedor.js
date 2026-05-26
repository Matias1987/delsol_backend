const { parse_date_for_mysql } = require("../lib/helpers");
const mysql_connection = require("../lib/mysql_connection");
const { doQuery } = require("./helpers/queriesHelper");

const agregar_proveedor = (data, callback) => {
  const connection = mysql_connection.getConnection();
  connection.connect();
  connection.query(
    `SELECT p.idproveedor FROM proveedor p WHERE p.cuit = ${connection.escape(
      data.cuit,
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
          },
        );
      }
      connection.end();
    },
  );
};

const obtener_proveedores = (callback) => {
  const connection = mysql_connection.getConnection();
  connection.connect();
  connection.query(
    "SELECT * FROM proveedor p order by p.nombre asc;",
    (err, rows, fields) => {
      callback(rows);
    },
  );
  connection.end();
};

const obtener_ficha_proveedor = (
  { idproveedor, modo, moneda, agrupar, estado },
  callback,
) => {
  //console.log({ idproveedor, modo, moneda, agrupar });
  const query = `
  SELECT * FROM (
  SELECT 
	  'PREV' AS 'tipo', if('${agrupar}'='1', concat('Saldo Previo al ', date_format(date_add(date(NOW()), INTERVAL -1 MONTH), '%d-%m-%Y')) , '-')  AS 'detalle','' AS 'id','' AS 'fecha_f','01-01-1970' AS 'fecha',
     sum(if(op.tipo='f' || op.tipo='cm', op.monto, 0)) AS 'debe',
     sum(if(op.tipo='p',op.monto,0)) AS 'haber'
     FROM (
         SELECT
         'f' AS 'tipo',
         if('${estado}'='0', f.monto - f.haber, f.monto ) as 'monto'
         FROM factura f
         WHERE
             f.fk_moneda = '${moneda}' and
             f.proveedor_idproveedor=${idproveedor} and
             f.activo=1 and
             (case when '${modo}'='-1' then true else f.es_remito=${modo == 0 ? 1 : 0} END) AND 
             (case when '${agrupar}'='0' then FALSE else DATE(f.fecha) < DATE_ADD(NOW(), INTERVAL -1 MONTH) END ) AND
             (case when '${estado}'='1' then f.saldado=1 else true end) and
             (case when '${estado}'='0' then f.saldado=0 else true end) 
         UNION
         (
             SELECT 'p' AS 'tipo',
             pp.monto
             FROM pago_proveedor pp
             WHERE
                 pp.moneda='${moneda}' and
                 pp.fk_proveedor=${idproveedor} and
                 pp.activo=1 and
                 (case when '${modo}'='-1' then true else pp.modo_ficha=${modo} end) AND 
                 (case when '${agrupar}'='0' then FALSE else DATE(pp.fecha) < DATE_ADD(NOW(), INTERVAL -1 MONTH) END ) and 
                 (case when '${estado}'='1' then pp.saldado=1 else true end) and
                 (case when '${estado}'='0' then pp.saldado=0 else true end) 
         )
         UNION
         (
             SELECT
             'cm' AS 'tipo',
             if('${estado}'='0', cm.monto - cm.haber, cm.monto ) as 'monto'
             FROM  carga_manual_proveedor cm
             WHERE
                 cm.moneda='${moneda}' and
                 cm.fk_proveedor=${idproveedor} and
                 cm.activo=1 and
                 (case when '${modo}'='-1' then true else cm.modo_ficha=${modo} end) AND 
             	   (case when '${agrupar}'='0' then FALSE else DATE(cm.fecha) < DATE_ADD(NOW(), INTERVAL -1 MONTH) END ) AND
                 (case when '${estado}'='1' then cm.saldado=1 else true end) and
                 (case when '${estado}'='0' then cm.saldado=0 else true end) 
         )
     ) op
     
     union

  SELECT * FROM (
    SELECT 
      op.tipo, op.detalle, op.id, op.fecha_f, op.fecha,
      if(op.tipo='FACTURA' || op.tipo='CM', op.monto, 0) AS 'debe',
      if(op.tipo='PAGO',op.monto,0) AS 'haber' 
      FROM (
          SELECT 
          'FACTURA' AS 'tipo', 
          concat(if(f.es_remito=1 , 'Remito ', 'Factura '), f.numero, if('${estado}'='0', concat(' ($ ', format(f.monto,2), ')'), '')) as 'detalle',
          f.idfactura AS 'id', 
          if('${estado}'='0', f.monto - f.haber, f.monto ) as 'monto',
          date_format(f.fecha , '%d-%m-%y') AS 'fecha_f',
          f.fecha
          FROM factura f 
          WHERE 
              f.fk_moneda = '${moneda}' and
              f.proveedor_idproveedor=${idproveedor} and 
              f.activo=1 and 
              (case when '${modo}'='-1' then true else f.es_remito=${modo == 0 ? 1 : 0} end) and 
              (case when '${estado}'='1' then f.saldado=1 else true end) and
              (case when '${estado}'='0' then f.saldado=0 else true end) 
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
                  pp.moneda='${moneda}' and
                  pp.fk_proveedor=${idproveedor} and 
                  pp.activo=1 and 
                  (case when '${modo}'='-1' then true else pp.modo_ficha=${
                    modo
                  } end) and 
                  (case when '${estado}'='1' then pp.saldado=1 else true end) and
                  (case when '${estado}'='0' then pp.saldado=0 else true end) 
          )
          UNION
          (
              SELECT 
              'CM' AS 'tipo', 
              concat('Carga Manual:', cm.comentarios , if('${estado}'='0', concat(' ($ ', format(cm.monto,2), ')'), '')) as 'detalle',
              cm.id AS 'id',  
              if('${estado}'='0', cm.monto - cm.haber, cm.monto ) as 'monto',
              date_format(cm.fecha , '%d-%m-%y') AS 'fecha_f',
              cm.fecha
              FROM  carga_manual_proveedor cm 
              WHERE 
                  cm.moneda='${moneda}' and
                  cm.fk_proveedor=${idproveedor} and 
                  cm.activo=1 and 
                  (case when '${modo}'='-1' then true else cm.modo_ficha=${
                    modo
                  } end) AND
                  (case when '${estado}'='1' then cm.saldado=1 else true end) and
                  (case when '${estado}'='0' then cm.saldado=0 else true end) 
          )
      ) op
      ORDER BY op.fecha asc 
) q WHERE (case when '${agrupar}'='0' then TRUE ELSE DATE(q.fecha) > DATE_ADD(NOW(), interval -1 MONTH) END )      
 ) gl ORDER BY gl.fecha asc                             
;`;

  console.log(query);

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
  const query = `INSERT INTO pago_proveedor (monto, fk_proveedor, modo_ficha, fecha, moneda) VALUES (
  ${data.monto}, 
  ${data.fk_proveedor}, 
  ${data.modo}, 
  '${parse_date_for_mysql(data.fecha)}', 
  '${data.moneda}'
  )`;
  //console.log(query)
  connection.query(query, (err, resp) => {
    if (data.efectivo.checked) {
      const _q = `INSERT INTO pago_proveedor_modo (modo_pago, fk_pago_proveedor, monto) VALUES ('efectivo', ${resp.insertId}, ${data.efectivo.monto});`;
      connection.query(_q);
    }
    if (data.cheque.checked) {
      const _q = `INSERT INTO pago_proveedor_modo (modo_pago, fk_pago_proveedor, monto, fk_cuenta_bancaria) VALUES ('cheque', ${resp.insertId}, ${data.cheque.monto}, ${data.cheque.fkcta_bancaria});`;
      connection.query(_q);
    }
    if (data.transferencia.checked) {
      const _q = `INSERT INTO pago_proveedor_modo (modo_pago, fk_pago_proveedor, monto, fk_cuenta_bancaria) VALUES ('transferencia', ${resp.insertId}, ${data.transferencia.monto}, ${data.transferencia.fkcta_bancaria});`;
      //console.log(_q)
      connection.query(_q);
    }

    if (data.compras && data.compras.length > 0) {
      let compras_values = "";
      data.compras.forEach((compra) => {
        compras_values +=
          (compras_values.length > 0 ? "," : "") +
          `(${resp.insertId}, ${compra.idfactura}, ${compra.monto_a_pagar})`;
      });
      const query = `INSERT INTO pago_proveedor_compra (fk_pago, fk_compra, monto) VALUES ${compras_values};`;
      //console.log(query);
      doQuery(query, (_resp) => {
        callback(resp);
      });
    } else {
      callback(resp);
    }

    connection.end();
  });
};

const agregar_cm_proveedor = (data, callback) => {
  const connection = mysql_connection.getConnection();
  connection.connect();
  const query = `INSERT INTO carga_manual_proveedor  
  (fk_proveedor, monto, comentarios, modo_ficha, fecha, moneda) 
  VALUES (
  ${data.fk_proveedor}, 
  ${data.monto}, 
  '${data.comentarios}', 
  ${data.modo}, 
  date('${data.fecha}'), 
  '${data.moneda}'
  )`;
  //console.log(query)
  connection.query(query, (err, resp) => {
    callback(resp);
  });
  connection.end();
};

const pagos_atrasados_proveedores = (data, callback) => {
  const query = `SELECT 
                    q1.idproveedor, 
                    q1.nombre,
                    if(q2.proveedor_idproveedor IS NULL, 0 , q1.diff) AS 'atraso',
                    if(q2.proveedor_idproveedor IS NULL, '' , DATE_FORMAT(q1.fecha,'%d-%m-%Y')) AS 'ultimo_pago'
                  from
                  (
                    SELECT 
                    p.idproveedor, 
                    DATEDIFF(date(NOW()), if(p1.fk_proveedor IS NULL, DATE('1970-01-01'), DATE(p1.fecha))) AS 'diff',
                    if(p1.fk_proveedor IS NULL, DATE('1970-01-01'), DATE(p1.fecha)) AS 'fecha',
                    p.nombre
                    FROM proveedor p LEFT JOIN (
                      SELECT 
                        pp1.fk_proveedor, 
                        pp1.fecha 
                        FROM 
                        pago_proveedor pp1 
                        WHERE 
                        pp1.moneda = '${data.moneda}' AND
                        pp1.activo=1 AND 
                        pp1.fecha = 
                          (
                            SELECT MAX(pp.fecha) 
                            FROM 
                            pago_proveedor pp W
                            HERE 
                            pp.fk_proveedor = pp1.fk_proveedor AND 
                            pp.moneda = '${data.moneda}' AND
                            pp.activo=1
                          )
                    ) p1 ON p1.fk_proveedor = p.idproveedor
                    ORDER BY diff DESC 
                  )q1 
                  LEFT JOIN 
                  (
                    SELECT 
                    ff.proveedor_idproveedor
                    FROM 
                    (
                        SELECT SUM(_q.monto) AS 'monto', _q.proveedor_idproveedor FROM (
                          SELECT f.monto, f.proveedor_idproveedor FROM factura f WHERE DATE(f.fecha) < DATE_ADD(DATE(NOW()), INTERVAL -1 MONTH ) and f.activo=1 and f.fk_moneda = '${data.moneda}'
                          union 
                          SELECT cmp.monto, cmp.fk_proveedor AS 'proveedor_idproveedor' FROM carga_manual_proveedor cmp WHERE cmp.activo=1 and cmp.moneda = '${data.moneda}'
                        ) _q GROUP BY _q.proveedor_idproveedor
                    ) AS ff,
                    (
                        SELECT 
                            SUM(pp.monto) AS 'monto',
                            SUM(pp.intime) AS 'intime', 
                            pp.idproveedor 
                            FROM  
                            (
                                SELECT 
                                0 AS 'intime',		
                                0 AS 'monto',
                                p.idproveedor 
                                FROM proveedor p
                              UNION
                                SELECT 
                                if(DATE(pp1.fecha) >= DATE_ADD(DATE(NOW()), INTERVAL -1 MONTH) , 1 , 0) AS 'intime',
                                pp1.monto,
                                pp1.fk_proveedor AS 'idproveedor' 
                                FROM 
                                pago_proveedor pp1 
                                wHERE 
                                pp1.moneda = '${data.moneda}' AND
                                pp1.activo=1 
                            )pp 
                        GROUP BY pp.idproveedor
                    ) pps
                        WHERE 
                        pps.intime = 0 AND pps.monto < ff.monto AND pps.idproveedor = ff.proveedor_idproveedor
                  )q2
                    ON q1.idproveedor = q2.proveedor_idproveedor
                    ORDER BY if(q2.proveedor_idproveedor IS NULL, 0 , q1.diff) desc
                    `;

  doQuery(query, (response) => {
    //console.log(JSON.stringify(response.data))
    callback(response.data);
  });
};

const monedas_existentes = (data, callback) => {
  const query = `select * from contabilidad_moneda;`;

  doQuery(query, (response) => {
    callback(response.data);
  });
};

const obtener_pagos_no_saldados = ({idproveedor, moneda, modo}, callback) =>{
    const query = `SELECT * FROM pago_proveedor pp WHERE 
    pp.saldado=0 AND 
    pp.moneda='${moneda}' AND 
    pp.modo_ficha='${modo}' AND 
    pp.fk_proveedor=${idproveedor};`;
    
    doQuery(query, response=>{
        callback(response.data)
    })
}

const agregar_pago_compra = (data, callback) => {
  /* 
  {
  "idpago":61,
  "compras":[{
  "idfactura":236,
  "numero":"0002-00148144",
  "monto":"5308631.859999999",
  "monto_pagado":"0",
  "saldo":5308631.859999999,
  "checked":true,
  "monto_a_pagar":9000,
  "nuevo_saldo":0}]}
  */

  const queries = [];



 const saldados_compras = [];

 data.compras.forEach(c=>{
  if(c.saldado)
  {
    saldados_compras.push(c.idfactura);
    
  }
  queries.push(`update factura f set f.haber=f.haber+${c.monto_a_pagar} where f.idfactura=${c.idfactura};`);
 })
 const saldados_cm = [];

 data.cm.forEach(c=>{
  if(c.saldado)
  {
    saldados_cm.push(c.id);
    
  }
  queries.push(`update carga_manual_proveedor cm set cm.haber=cm.haber+${c.monto_a_pagar} where cm.id=${c.id};`);
 })

  console.log(data);

  let compras_values = "";
  data.compras.forEach((compra) => {
    compras_values +=
      (compras_values.length > 0 ? "," : "") +
      `(${data.idpago}, ${compra.idfactura}, ${compra.monto_a_pagar})`;
  });

  let cm_values = "";
  data.cm.forEach((cm)=>{
    cm_values +=
      (cm_values.length > 0 ? "," : "") +
      `(${data.idpago}, ${cm.id}, ${cm.monto_a_pagar})`;
  })




  queries.push(`update pago_proveedor pp set pp.saldado=1  where pp.id=${data.idpago}`); 

  if(compras_values.length>0){
    queries.push(`INSERT INTO pago_proveedor_compra (fk_pago, fk_compra, monto) VALUES ${compras_values};`);
  }
  if(cm_values.length>0){
    queries.push(`INSERT INTO pago_proveedor_cm (fk_pago, fk_cm, monto) VALUES ${cm_values};`);
  }
  if(saldados_compras.length>0){
    queries.push(`update factura f set f.saldado=1 where f.idfactura in (${saldados_compras.map(f=>f)})`);
  }
  if(saldados_cm.length>0){
    queries.push(`update carga_manual_proveedor cm set cm.saldado=1 where cm.id in (${saldados_cm.map(cm=>cm)})`);
  }

  const process = (_callback) => {
    if(queries.length>0)
    {
      const q = queries.pop();
      console.log("processing query:: ");
      console.log(q);
      doQuery(q,(_resp)=>{
        process(_callback)
      })
    }
    else{
      return _callback();
    }
  }

  process(_=>{
    callback({"ok":"1"});
  })
  /*
  doQuery(query, (response)=>{
    const q1 = `update pago_proveedor pp set pp.saldado=1 where pp.id=${data.idpago}`;
    console.log(q1);
    doQuery(q1,(response1)=>{
      if(saldados_compras.length>0)
      {
        const q2 = `update factura f set f.saldado=1 where f.idfactura in (${saldados_compras.map(f=>f)})`;
        console.log(q2);
        doQuery(q2,r2=>{callback({"ok":"1"})});
      }
      else{
        callback(response1);
      }
      
    })
    
  });*/
    
}

const obtener_cm_saldo = ({idproveedor, moneda, modo}, callback) =>{
  const query = `SELECT 
  cmp.id, 
  cmp.monto, 
  if(pp.fk_cm IS NULL, 0, pp.monto) AS 'pagado', 
  (cmp.monto - if(pp.fk_cm IS NULL, 0, pp.monto)) as 'saldo'
  FROM carga_manual_proveedor cmp LEFT JOIN 
                (SELECT ppcm.fk_cm, SUM(ppcm.monto) AS 'monto' FROM pago_proveedor_cm ppcm GROUP BY ppcm.fk_cm) pp
                ON pp.fk_cm = cmp.id 
                WHERE cmp.saldado=0 AND cmp.monto>0 AND cmp.fk_proveedor=${idproveedor} AND cmp.moneda='${moneda}' AND cmp.modo_ficha=${modo}`;

  console.log(query)

  doQuery(query, response=>{
    return callback(response.data);
  });
}

module.exports = {
  agregar_proveedor,
  obtener_proveedores,
  obtener_ficha_proveedor,
  detalle_proveedor,
  agregar_pago_proveedor,
  agregar_cm_proveedor,
  pagos_atrasados_proveedores,
  monedas_existentes,
  obtener_pagos_no_saldados,
  agregar_pago_compra,
  obtener_cm_saldo,
};
