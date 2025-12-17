const mysql_connection = require("../lib/mysql_connection");
const tc2 = require("./TransferenciaCajaV2");
const doQuery = (query, callback) => {
  //console.log(query);
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

function getBalance({fullList},callback) {
  getCajaMaster((idCajaMaster) => {
    console.log("Caja master id: ", idCajaMaster);
    if (!idCajaMaster) return callback(null);

    const query = `SELECT * FROM (
                    SELECT 	
                        '1970-01-01' AS 'fecha',
                        '-' AS 'id',
                        CONCAT('Saldo al ', date_format(date_add(date(now()), interval -1 day),'%d-%m-%y')) AS 'fecha_f',
                        'SALDO' AS 'tipo',
                        SUM( if( o1.tipo = 'i', o1.monto, -o1.monto)) AS 'monto',
                        'SALDO PREVIO ' AS 'detalle',
                        0 AS 'ref_id'
                          FROM (
                          SELECT 
                            'e' as 'tipo',
                            e.fecha, 
                            e.monto
                          FROM caja_master.cm_egreso e inner join concepto_gasto cg on cg.idconcepto_gasto = e.fk_motivo WHERE e.fk_caja=${idCajaMaster} AND DATE(e.fecha)<DATE(NOW())  AND ${fullList ? 'FALSE' : 'TRUE'} 
                          union
                          SELECT 
                            'i' as 'tipo',
                            i.fecha, 
                            i.monto
                          FROM 
                          caja_master.cm_ingreso i left join caja_master.cm_transferencia_caja tc on tc.c_ingreso_idingreso = i.idingreso
                          WHERE 
                          i.fk_caja=${idCajaMaster} AND 
                          DATE(i.fecha)<DATE(NOW()) AND ${fullList ? 'FALSE' : 'TRUE'} 

                        ) o1
                      
                    UNION
                    (
                      SELECT 
                      o.fecha,
                      o.id,
                      o.fecha_f,
                      o.tipo, 
                      o.monto,
                      o.detalle,
                      o.ref_id
                      FROM (
                        SELECT 
                          e.fecha, 
                          e.idegreso AS 'id', 
                          date_format(e.fecha, '%d-%m-%y') AS 'fecha_f',  
                          'EGRESO' AS 'tipo', 
                          e.monto, 
                          cg.nombre as 'detalle' ,
                          0 as 'ref_id'
                        FROM caja_master.cm_egreso e inner join concepto_gasto cg on cg.idconcepto_gasto = e.fk_motivo WHERE e.fk_caja=${idCajaMaster} and ${fullList? 'TRUE' : 'date(e.fecha) = date(now())'}
                        union
                        SELECT 
                          i.fecha, 
                          i.idingreso AS 'id', 
                          DATE_FORMAT(i.fecha, '%d-%m-%y') AS 'fecha_f', 
                          'INGRESO' AS 'tipo', 
                          i.monto, 
                          i.comentarios as 'detalle',
                          if(tc.id_transferencia is null, 0 , tc.id_caja_origen) as 'ref_id'
                          FROM 
                          caja_master.cm_ingreso i left join caja_master.cm_transferencia_caja tc on tc.c_ingreso_idingreso = i.idingreso WHERE ${fullList ? 'TRUE' : 'date(i.fecha) = date(now())'} AND i.fk_caja=${idCajaMaster}
                      ) o
                      ORDER BY o.fecha asc
                      )
                      ) oo ORDER BY oo.fecha asc 
                    `;
   // console.log("Balance query: ", query);

    doQuery(query, (results) => {
      if (!results) return callback(null);
      callback(results);
    });
  });
}

function getCajasSucursales(callback) {
  ///////////////////////FALTAN LOS GASTOS!!
  const sql = `SELECT 
  s.nombre AS 'sucursal', 
  date_format(c.fecha, '%d-%m-%y') as 'fecha',
  c.estado,
  op.c,
  op.g,
  op.c -op.g  AS 's',
  c.idcaja
  FROM 
  caja c INNER join sucursal s ON s.idsucursal=c.sucursal_idsucursal,
  (
		SELECT 
			_o.caja_idcaja,
		 	sum(if(_o.tipo='c',  cast(_o.monto AS float), 0 )) AS 'c',
			sum(if(_o.tipo<>'c', cast(_o.monto AS float), 0 )) AS 'g'
		from
		(
		      SELECT 
					'c' AS 'tipo',
			       cb.caja_idcaja, 
			       SUM(cmp.monto) AS 'monto'
			   FROM 
			       cobro cb, 
			       cobro_has_modo_pago cmp
			   WHERE 
			       cmp.cobro_idcobro = cb.idcobro AND 
			       cb.caja_idcaja IN 
			       (
			           SELECT _c.idcaja
			           FROM caja _c
			           WHERE _c.control_pendiente=1 and _c.nro=1 and _c.estado='CERRADO'
			       ) AND 
			       cmp.modo_pago='efectivo'
			   GROUP BY cb.caja_idcaja
			union
			  SELECT 
			  		'e' AS 'tipo',
				  g.caja_idcaja, 
				  SUM(g.monto)  AS 'monto'
				FROM gasto g 
				WHERE 
				g.caja_idcaja IN (SELECT _c.idcaja FROM caja _c WHERE _c.control_pendiente=1 and _c.nro=1 and _c.estado='CERRADO')
				GROUP BY g.caja_idcaja
				) _o GROUP BY _o.caja_idcaja
  ) op
  WHERE 
  c.idcaja = op.caja_idcaja
  ;
  
  `;
  console.log("GET LISTADO CAJA SUCURSALES");
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
  console.log(sql);
  doQuery(sql, (results) => {
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
