const { obtenerCajaAbierta } = require("./queries/cajaQueries");
const cobro_queries = require("./queries/cobroQueries");
const {
  doQuery,
  escapeHelper,
  doTransaction,
} = require("./helpers/queriesHelper");

const doQuery2 = (query, callback = null) => {
  if (query.length < 1) {
    callback?.({ error: true }, null);
    return;
  }
  doQuery(query, (response) => {
    callback?.(!response ? { error: true } : null, response.data);
  });
};

const agregar_cobro = (data, callback) => {
  //do_agregar_cobro(data,callback)
  insert_cobro_transaction(data, callback);
};

const lista_cobros = (data, callback) => {
  const _idcliente =
    typeof data.idcliente === "undefined" ? "" : data.idcliente;
  const _idventa = typeof data.idventa === "undefined" ? "" : data.idventa;
  const _idsucursal =
    typeof data.idsucursal === "undefined" ? "" : data.idsucursal;
  const _idcobro = typeof data.idcobro === "undefined" ? "" : data.idcobro;
  const _fecha = typeof data.fecha === "undefined" ? "" : data.fecha;
  const _anulado = typeof data.anulado === "undefined" ? "" : data.anulado;

  const _q = `SELECT 
    c.* , 
    date_format(c.fecha,'%d-%m-%Y') as 'fecha_formated',
    cl.dni AS 'cliente_dni',  
    CONCAT(cl.apellido,', ', cl.nombre) AS 'cliente_nombre',
    s.nombre as sucursal 
    FROM cobro c, cliente cl , sucursal s
    WHERE 
    c.sucursal_idsucursal = s.idsucursal and 
    c.cliente_idcliente = cl.idcliente and
    (case when '' <> '${_idsucursal}' then c.sucursal_idsucursal = '${_idsucursal}' else true end) and 
    (case when '' <> '${_idcliente}' then '${_idcliente}' = c.cliente_idcliente ELSE TRUE end) and 
    (case when '' <> '${_idventa}' then '${_idventa}' = c.venta_idventa ELSE TRUE end) and 
    (case when '' <> '${_idcobro}' then '${_idcobro}' = c.idcobro ELSE TRUE end) and
    (case when '' <> '${_anulado}' then '${_anulado}' = c.anulado else true end)  and 
    (case when '' <> '${_fecha}' then date('${_fecha == "" ? `1970-01-01` : _fecha}') = date(c.fecha) ELSE TRUE end) 
    order by c.idcobro desc
    limit 1000;`;
  //console.log(_q);
  doQuery2(_q, (err, results) => {
    callback(results);
  });
};

const detalle_cobro = (idcobro, callback) => {
  doQuery2(cobro_queries.queryDetalleCobro(idcobro), (err, results) => {
    callback(results);
  });
};

const lista_mp_cobro = (idcobro, callback) => {
  const query = `
    SELECT 
    cmp.* ,
    if(t.idtarjeta is null, '', t.nombre) as 'tarjeta',
    if(m.idmutual is null, '', m.nombre) as 'mutual',
    if(bco.idbanco is null, '', bco.nombre) as 'banco' 
    FROM 
    cobro_has_modo_pago cmp 
        left join tarjeta t on t.idtarjeta=cmp.fk_tarjeta
        left join mutual m on m.idmutual = cmp.mutual_idmutual
        left join banco bco on bco.idbanco = cmp.banco_idbanco 
    WHERE cmp.cobro_idcobro=${escapeHelper(idcobro)};`;

  doQuery2(query, (err, rows) => {
    callback(rows);
  });
};

const anular_cobro = ({ idcobro }, callback) => {
  const update_cobro_query = `update cobro c set c.anulado=1 where c.idcobro = ${idcobro}`;

  const update_venta_query = `
		update venta v inner join cobro c on c.venta_idventa = v.idventa and  c.idcobro = ${idcobro} 
		set  v.haber = cast( v.haber as float )- c.monto, v.saldo = cast(v.saldo as float) + c.monto limit 1`;

  doQuery2(update_cobro_query, (response) => {
    doQuery2(update_venta_query, (resp1) => {
      callback(resp1);
    });
  });
};

const obtener_lista_mp = (data) => {
  const add = (arr, val, idx) =>
    parseFloat(val.monto) == 0 ? arr : [...arr, val];

  const get_mp_obj = (vars) => ({
    monto: isNaN(vars.monto) ? 0 : vars.monto,
    tipo: vars.tipo,
    tarjeta: typeof vars.tarjeta === "undefined" ? null : vars.tarjeta,
    fkmutual: typeof vars.fkmutual === "undefined" ? null : vars.fkmutual,
    fkbanco: typeof vars.fkbanco === "undefined" ? null : vars.fkbanco,
    cant_cuotas: typeof vars.cant_cuotas === "undefined" ? 0 : vars.cant_cuotas,
    monto_cuota: typeof vars.monto_cuota === "undefined" ? 0 : vars.monto_cuota,
    fk_tarjeta: typeof vars.fk_tarjeta === "undefined" ? null : vars.fk_tarjeta,
  });

  var _mp = [];

  _mp = add(
    _mp,
    get_mp_obj({
      monto: data.mp.efectivo_monto,
      tipo: "efectivo",
    }),
    "efectivo_monto",
  );

  _mp = add(
    _mp,
    get_mp_obj({
      monto: data.mp.tarjeta_monto,
      tipo: "tarjeta",
      cant_cuotas: data.mp.tarjeta_tarjeta,
      fk_tarjeta: data.mp.fk_tarjeta,
    }),
    "tarjeta_monto",
  );
  _mp = add(
    _mp,
    get_mp_obj({
      monto: data.mp.ctacte_monto,
      tipo: "ctacte",
      cant_cuotas: data.mp.ctacte_cuotas,
      monto_cuota: data.mp.ctacte_monto_cuotas,
    }),
    "ctacte_monto",
  );
  _mp = add(
    _mp,
    get_mp_obj({
      monto: data.mp.mutual_monto,
      tipo: "mutual",
      fkmutual: data.mp.fk_mutual,
    }),
    "mutual_monto",
  );
  _mp = add(
    _mp,
    get_mp_obj({
      monto: data.mp.cheque_monto,
      tipo: "cheque",
      fkbanco: data.mp.fk_banco,
    }),
    "cheque_monto",
  );

  _mp = add(
    _mp,
    get_mp_obj({
      monto: data.mp.mercadopago_monto,
      tipo: "mercadopago",
    }),
    "mercadopago_monto",
  );

  _mp = add(
    _mp,
    get_mp_obj({
      monto: data.mp.transferencia_monto,
      tipo: "transferencia",
      fkbanco: data.mp.fk_banco_transferencia,
    }),
    "transferencia_monto",
  );

  _mp = add(
    _mp,
    get_mp_obj({
      monto: data.mp.tarjeta1_monto,
      tipo: "tarjeta",
      cant_cuotas: data.mp.tarjeta1_tarjeta,
      fk_tarjeta: data.mp.fk_tarjeta1,
    }),
    "tarjeta1_monto",
  );

  return _mp;
};

const obtener_mp_cobro_queries = (idcobro, _mp) => {
  var _cobro_mp_item = ``;

  var total = 0;

  _mp.forEach((mp) => {
    _cobro_mp_item +=
      (_cobro_mp_item.length > 0 ? "," : "") +
      `(${idcobro},
                    '${mp.tipo}',
                    ${mp.fkbanco},
                    ${mp.fkmutual},
                    '${mp.monto}',
                    '${mp.cant_cuotas}',
                    '${mp.monto_cuota}', 
                    '${parseFloat(mp.cant_cuotas) * parseFloat(mp.monto_cuota)}',
                    ${escapeHelper(mp.fk_tarjeta)}
                    )`;

    if (mp.tipo != "ctacte") {
      total += parseFloat(mp.monto);
    }
  });
  return cobro_queries.queryInsertMP + _cobro_mp_item;
};

const obtener_mp_venta_query = (data, _mp) => {
  var _venta_mp_item = ``;
  if (typeof data.idventa !== "undefined") {
    _mp.forEach((mp) => {
      _venta_mp_item +=
        (_venta_mp_item.length > 0 ? "," : "") +
        `
                (
                    ${data.idventa},
                    '${mp.tipo}',
                    ${mp.fkbanco},
                    ${mp.fkmutual},
                    ${mp.monto},
                    ${parseFloat(mp.cant_cuotas) * parseFloat(mp.monto_cuota)}, 
                    ${mp.cant_cuotas},
                    ${mp.monto_cuota},
                    ${escapeHelper(mp.fk_tarjeta)})
                `;
    });
  } else return "";

  return cobro_queries.queryInsertVentaMP + _venta_mp_item;
};

const insert_cobro_transaction = (data, callback) => {
  const __logic = async (connection) => {
    if (data.removeMPRows && +data?.removeMPRows == 1) {
      console.log("removing mp rows");
      console.log(cobro_queries.queryRemoveMPRows(data));
      await connection.query(cobro_queries.queryRemoveMPRows(data));
    }
    if (data.removeCtaCteRow && +data?.removeCtaCteRow == 1) {
      console.log("removing cta cte rows");
      console.log(cobro_queries.queryRemoveCtaCteRows(data));
      await connection.query(cobro_queries.queryRemoveCtaCteRows(data));
    }
    if (data.monto == data.mp.ctacte_monto && data.mp.ctacte_monto > 0) {
      const __query_venta_mp = cobro_queries.queryInsertarMPCtaCte(data);
      console.log("inserting cta cte mp");
      console.log(__query_venta_mp);
      await connection.query(__query_venta_mp);
      await connection.query(
        `UPDATE venta  v SET v.descuento=${data.descuento}, debe=v.subtotal-${data.descuento},  monto_total=v.subtotal-${data.descuento}  WHERE v.idventa=${data.idventa};`,
      );
      return;
    }

    const mps = obtener_lista_mp(data);
    var total = 0;

    mps.forEach((mp) => {
      if (mp.tipo != "ctacte") {
        total += parseFloat(mp.monto);
      }
    });

    const cajaResponse = await connection.query(
      obtenerCajaAbierta(data.sucursal_idsucursal),
    );
    console.log("cajaResponse", cajaResponse[0]);
    const idcaja = cajaResponse[0][0].idcaja;

    const cobroResponse = await connection.query(
      cobro_queries.queryAgregarCobroV2(idcaja, data),
    );
    console.log("cobroResponse", cobroResponse);
    const idcobro = cobroResponse[0].insertId;
    console.log("idcobro", idcobro);
    const query_cobro_mp = obtener_mp_cobro_queries(idcobro, mps);
    const query_venta_mp = obtener_mp_venta_query(data, mps);

    const update_venta_montos_query = cobro_queries.queryUpdateVentaMontos(
      data,
      total,
    );

    if (query_venta_mp.length < 1) {
      await connection.query(update_venta_montos_query);
      if (mps.length > 0) {
        await connection.query(query_cobro_mp);
      }
      return idcobro;
    }
    await connection.query(query_cobro_mp);
    await connection.query(query_venta_mp);
    await connection.query(update_venta_montos_query);
    return idcobro;
  };

  doTransaction(__logic, ({ data, err }) => {
    if (err) {
      console.log("error");
      return callback({ error: 1 });
    }
    console.log("success, return id: ", data);
    return callback(data);
  });
};

module.exports = {
  agregar_cobro,
  lista_cobros,
  detalle_cobro,
  lista_mp_cobro,
  anular_cobro,
};

/*
const do_agregar_cobro = (data, callback) => {
  console.log("############# agregar pago");
  console.log(data);

  if (data.monto == data.mp.ctacte_monto && data.mp.ctacte_monto > 0) {
   
    agregar_venta_mp_ctacte(data, callback);
    return; //nothing else to do
  }

  const q_removeMPRows =
    data.removeMPRows && +data?.removeMPRows == 1
      ? cobro_queries.queryRemoveMPRows(data)
      : "";
  const q_removeCtaCteRow =
    data.removeCtaCteRow && +data?.removeCtaCteRow == 1
      ? cobro_queries.queryRemoveCtaCteRows(data)
      : "";

  doQuery2(q_removeMPRows, (err, resp) => {
    doQuery2(q_removeCtaCteRow, (err1, resp1) => {
      agregar_cobro_cont(data, callback);
    });
  });
};

const agregar_cobro_cont = (data, callback) => {
  const mps = obtener_lista_mp(data);
  var total = 0;

  mps.forEach((mp) => {
    if (mp.tipo != "ctacte") {
      total += parseFloat(mp.monto);
    }
  });

  doQuery2(obtenerCajaAbierta(data.sucursal_idsucursal), (err, rows) => {
    if (err) {
      callback(null);
      return;
    }
    if (rows.length < 1) {
      console.log("No hay caja!!!!!");
      callback(null);
      return;
    }

    const idcaja = rows[0].idcaja;
    const query_agregar_cobro = cobro_queries.queryAgregarCobroV2(idcaja, data);

    doQuery2(query_agregar_cobro, (err1, result1) => {
      if (err1) {
        console.log(err1);
        callback(-1);
        return;
      }

      const idcobro = result1.insertId;
      const query_cobro_mp = obtener_mp_cobro_queries(idcobro, mps);
      const query_venta_mp = obtener_mp_venta_query(data, mps);
      const update_venta_montos_query = cobro_queries.queryUpdateVentaMontos(
        data,
        total,
      );

      if (query_venta_mp.length < 1) {
        doQuery2(update_venta_montos_query);
        if (mps.length > 0) {
          doQuery2(query_cobro_mp, (err2, result2) => {
            callback(idcobro);
          });
        } else {
          callback(idcobro);
        }
      } else {
        doQuery2(query_cobro_mp, (err2, result2) => {
          if (err2) {
            console.log("error...........................");
            return callback(null);
          }
          doQuery2(query_venta_mp);
          doQuery2(update_venta_montos_query); //UPDATE DEBE AND HABER FIELDS IN VENTA
          callback(idcobro);
        });
      }
    });
  });
};

const agregar_venta_mp_ctacte = (data, callback) => {
  const __query_venta_mp = cobro_queries.queryInsertarMPCtaCte(data);

  const queries = [];
  const process = (onFinish) => {
    if (queries.length < 1) {
      return onFinish?.();
    }
    const q = queries.shift();
    console.log("Executing query: ", q);
    doQuery2(q, (err, resp) => {
      process(onFinish);
    });
  };

  if (data.removeMPRows && +data?.removeMPRows == 1) {
    queries.push(cobro_queries.queryRemoveMPRows(data));
  }

  if (data.removeCtaCteRow && +data?.removeCtaCteRow == 1) {
    queries.push(cobro_queries.queryRemoveCtaCteRows(data));
  }

  queries.push(__query_venta_mp);

  queries.push(
    `UPDATE venta  v SET v.descuento=${data.descuento}, debe=v.subtotal-${data.descuento},  monto_total=v.subtotal-${data.descuento}  WHERE v.idventa=${data.idventa};`,
  );

  process((_) => {
    callback(-1);
  });
};
*/
