const mysql_connection = require("../lib/mysql_connection");
const { obtenerCajaAbierta, obtenerFFSucursal } = require("./queries/cajaQueries");
const UsuarioDB = require("./Usuario");
const CajaDB = require("./Caja");
const { usar_ff_para_gastos } = require("../lib/global");

const doQuery = (query, callback=null) => {
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,response)=>{
        if(err)
        {
            console.log("Error " + err)
            return callback?.(err,null)
        }
        callback?.(err,response)
    })
    connection.end()
}

const lista_gastos_admin = (callback) => {
  const query = `SELECT 
    cg.nombre AS 'concepto',
    s.nombre AS 'sucursal',
    g.monto
    FROM
    sucursal s,
    concepto_gasto cg,
    gasto g 
    WHERE
    g.sucursal_idsucursal = s.idsucursal AND 
    g.concepto_gasto_idconcepto_gasto = cg.idconcepto_gasto AND
    g.anulado=0;`;

  const connection = mysql_connection.getConnection();

  connection.connect();

  connection.query(query, (err, rows) => {
    callback(rows);
  });

  connection.end();
};

const obtener_gastos_sucursal = (idsucursal, callback) => {
  const connection = mysql_connection.getConnection();
  connection.connect();

  connection.query(
    `SELECT 
    g.*, date_format(g.fecha_alta,'%d-%m-%y') as 'fecha_f', cg.nombre AS 'concepto_gasto'
    FROM gasto g, concepto_gasto cg WHERE g.concepto_gasto_idconcepto_gasto = cg.idconcepto_gasto 
    and g.sucursal_idsucursal = ${idsucursal} AND
    g.anulado=0
    ORDER BY g.idgasto DESC;
    `,
    (err, rows) => {
      return callback(rows);
    }
  );
  connection.end();
};
const obtener_gastos_caja = (idcaja, callback) => {
  const connection = mysql_connection.getConnection();
  connection.connect();
  /* console.log(`SELECT 
    g.*, date_format(g.fecha,'%d-%m-%y') as 'fecha_f', cg.nombre AS 'concepto_gasto'
    FROM gasto g, concepto_gasto cg WHERE g.concepto_gasto_idconcepto_gasto = cg.idconcepto_gasto 
    and g.caja_idcaja = ${idcaja} AND
    g.anulado=0
    ORDER BY g.idgasto DESC;
    `)*/
  connection.query(
    `SELECT 
    g.*, date_format(g.fecha,'%d-%m-%y') as 'fecha_f', cg.nombre AS 'concepto_gasto'
    FROM gasto g, concepto_gasto cg WHERE g.concepto_gasto_idconcepto_gasto = cg.idconcepto_gasto 
    and g.caja_idcaja = ${idcaja} AND
    g.anulado=0 
    ORDER BY g.idgasto DESC;
    `,
    (err, rows) => {
      return callback(rows);
    }
  );
  connection.end();
};

const obtener_gasto = (callback) => {
  const connection = mysql_connection.getConnection();
  connection.connect();
  connection.query("select * from gasto", (err, rows, fields) => {
    return callback(rows);
  });
  connection.end();
};

const do_agregar_gasto = (data, callback) => {
  const connection = mysql_connection.getConnection();
  connection.connect();

  //connection.query(usar_ff_para_gastos ? obtenerFFSucursal(data.sucursal_idsucursal) : obtenerCajaAbierta(data.sucursal_idsucursal),
  connection.query(obtenerCajaAbierta(data.sucursal_idsucursal),
    (err, _rows) => {
      if (_rows.length < 1) {
        console.log("No hay caja!!!!!");
        callback(null);
        connection.end();
        return;
      } else {
        const idcaja = _rows[0].idcaja;

        var sql = `insert into gasto (
                caja_idcaja, 
                usuario_idusuario,
                concepto_gasto_idconcepto_gasto,
                monto,
                sucursal_idsucursal,
                comentarios
                ) values (
                ${connection.escape(idcaja)},
                ${connection.escape(data.usuario_idusuario)},
                ${connection.escape(data.idmotivo)},
                ${connection.escape(data.monto)},
                ${connection.escape(data.sucursal_idsucursal)},
                ${connection.escape(data.comentarios)}
            )`;

        connection.query(sql, (err, result) => {
          return callback(result.insertId);
        });
        connection.end();
      }
    }
  );
};

const agregar_gasto = (data, callback) => {
  /*CajaDB.obtener_caja_gasto({idsucursal:data.sucursal_idsucursal},(idcaja)=>{
        do_agregar_gasto(data, callback, idcaja)
    })*/
  UsuarioDB.validar_usuario_be(
    { tk: data.tk },
    () => {
      do_agregar_gasto(data, callback);
    },
    () => {}
  );
};

const anular_gasto = ({idgasto}, callback) => {
	const query = `update gasto g set g.anulado=1 where g.idgasto = ${idgasto} limit 1`
	console.log(query);
	doQuery(query,(response)=>{
		callback(response);
	})
}

module.exports = {
  obtener_gasto,
  agregar_gasto,
  anular_gasto,
  obtener_gastos_sucursal,
  obtener_gastos_caja,
  lista_gastos_admin,
};
