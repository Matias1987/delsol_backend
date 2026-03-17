const { doQuery, escapeHelper } = require("./helpers/queriesHelper");
const { obtenerCajaAbierta, obtenerFFSucursal } = require("./queries/cajaQueries");
const UsuarioDB = require("./Usuario");

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

  doQuery(query, (resp) => {
    callback(resp.data);
  });

};

const obtener_gastos_sucursal = (idsucursal, callback) => {
  doQuery(
    `SELECT 
    g.*, date_format(g.fecha_alta,'%d-%m-%y') as 'fecha_f', cg.nombre AS 'concepto_gasto'
    FROM gasto g, concepto_gasto cg WHERE g.concepto_gasto_idconcepto_gasto = cg.idconcepto_gasto 
    and g.sucursal_idsucursal = ${idsucursal} AND
    g.anulado=0
    ORDER BY g.idgasto DESC;
    `,
    (resp) => {
      return callback(resp.data);
    }
  );
};

const obtener_gastos_caja = (idcaja, callback) => {
  doQuery(
    `SELECT 
    g.*, date_format(g.fecha,'%d-%m-%y') as 'fecha_f', cg.nombre AS 'concepto_gasto'
    FROM gasto g, concepto_gasto cg WHERE g.concepto_gasto_idconcepto_gasto = cg.idconcepto_gasto 
    and g.caja_idcaja = ${idcaja} AND
    g.anulado=0 
    ORDER BY g.idgasto DESC;
    `,
    (resp) => {
      return callback(resp.data);
    }
  );
};

const obtener_gasto = (callback) => {
  doQuery("select * from gasto", (resp) => {
    return callback(resp.data);
  });
};

const do_agregar_gasto = (data, callback) => {
  doQuery(obtenerCajaAbierta(data.sucursal_idsucursal),
    (resp) => {
      const _rows = resp.data;
      if (_rows.length < 1) {
        console.log("No hay caja!!!!!");
        callback(null);
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
                ${escapeHelper(idcaja)},
                ${escapeHelper(data.usuario_idusuario)},
                ${escapeHelper(data.idmotivo)},
                ${escapeHelper(data.monto)},
                ${escapeHelper(data.sucursal_idsucursal)},
                ${escapeHelper(data.comentarios)}
            )`;

        doQuery(sql, (resp) => {
          const result = resp.data; 
          return callback(result.insertId);
        });
      }
    }
  );
};

const agregar_gasto = (data, callback) => {

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
	doQuery(query,(response)=>{
		callback(response.data);
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
