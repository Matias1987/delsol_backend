const mysql_connection = require("../lib/mysql_connection");
const { doQuery } = require("./helpers/queriesHelper");

const obtener_facturas = (idprov, callback) => {
  const connection = mysql_connection.getConnection();
  connection.connect();
  connection.query(
    `SELECT f.*, p.nombre AS 'proveedor',  date_format(f.fecha,'%d-%m-%y') as 'fecha_formated' 
    FROM factura f, proveedor p 
    WHERE f.proveedor_idproveedor = p.idproveedor AND 
    (case when '-1'<>'${idprov}' then f.proveedor_idproveedor = ${idprov} else true end)
    ;`,
    (err, rows) => {
      callback(rows);
    }
  );
  connection.end();
};

const agregar_factura = (data, callback) => {
  const connection = mysql_connection.getConnection();
  connection.connect();
  connection.query(
    `INSERT INTO factura (numero, proveedor_idproveedor, monto, cantidad) VALUES ('${data.numero}', ${data.proveedor_idproveedor},${data.monto},${data.cantidad});`,
    (err, result) => {
      callback(result.insertId);
    }
  );
  connection.end();
};

const detalle_factura = (data, callback) => {
  const connection = mysql_connection.getConnection();
  connection.connect();

  connection.query(
    `SELECT 
    DATE_FORMAT(f.fecha, '%d-%m-%y') AS 'fecha',
    f.numero,
    f.cantidad,
    f.monto,
    f.proveedor_idproveedor,
    p.nombre as 'proveedor',
    f.es_remito,
    c_n_gravados,
    neto_gravado,
    descuento,
    imp_int
    FROM 
    factura f, 
    proveedor p 
    WHERE p.idproveedor = f.proveedor_idproveedor AND f.idfactura = ${data};`,
    (err, rows) => {
      callback(rows);
    }
  );
  connection.end();
};

const lista_elementos_factura = (data, callback) => {
  const connection = mysql_connection.getConnection();
  connection.connect();
  connection.query(
    `SELECT 
    c.codigo,
    cf.cantidad,
    cf.costo
     FROM codigo_factura cf, codigo c WHERE
    cf.stock_codigo_idcodigo = c.idcodigo AND
    cf.factura_idfactura=${data};`,
    (err, rows) => {
      callback(rows);
    }
  );
  connection.end();
};

const agregar_factura_v2 = (data, callback) => {
  console.log(JSON.stringify(data));
  if(data.nro==="" || +data.fkproveedor===-1 ){
    console.log("Error en datos de factura");
    callback(-1);
    return;
  }
  const connection = mysql_connection.getConnection();

  const _fecha = data.fecha == "" ? "now()" : data.fecha;
  let idfactura = -1;

  let query_factura = `INSERT INTO factura (numero, proveedor_idproveedor, monto, cantidad, tipo, punto_venta, es_remito, fecha, descuento, c_n_gravados, imp_int) VALUES (
    ${connection.escape(data.nro)}, 
    ${connection.escape(data.fkproveedor)},
    ${connection.escape(data.total)},
    ${connection.escape(data.cant_productos)},
    ${connection.escape(data.tipo)},
    ${connection.escape(data.puntoVenta)}, 
    ${connection.escape(data.esremito)},
    date(${connection.escape(data.fecha)}),
    ${connection.escape(data.descuento)},
    ${connection.escape(parseFloat(data.conceptosNoGravados||"0"))},
    ${connection.escape(parseFloat(data.impuestosInternos||"0"))}
    );`; //toDo

  let query_iva = `INSERT INTO factura_iva (fk_factura, monto, tipo) VALUES `;
  let query_retenciones = `INSERT INTO factura_retencion (fk_factura, monto, tipo) VALUES `;
  let query_percepciones = `INSERT INTO factura_percepcion (fk_factura, monto) VALUES `;
  let query_productos = `INSERT INTO codigo_factura (factura_idfactura, stock_codigo_idcodigo, cantidad, costo) VALUES `;
  let query_increase_quantities = (
    _idfactura
  ) => `UPDATE stock s, ( SELECT * from codigo_factura cf0 WHERE cf0.factura_idfactura=${_idfactura} ) cf
                                SET s.cantidad = s.cantidad + cf.cantidad
                                WHERE
                                s.codigo_idcodigo = cf.stock_codigo_idcodigo AND  
                                s.sucursal_idsucursal = ${data.idsucursal};`;

  const _process = (_queries) => {
    if (_queries.length < 1) {
      callback(idfactura);
      return;
    }
    const query = _queries.pop();
    console.log("Executing query: " + query);
    doQuery(query, ({ data }) => {
      _process(_queries);
    });
  };

  //first insert factura
  doQuery(query_factura, (result) => {
    let idfactura = result.data.insertId;
    let _iva = "";
    let _retenciones = "";
    let _percepciones = "";

    data.iva.forEach((row) => {
      _iva +=
        (_iva.length > 0 ? "," : "") +
        `(${idfactura}, ${connection.escape(row.monto)}, ${connection.escape(
          row.tipo
        )})`;
    });

    data.retenciones.forEach((row) => {
      _retenciones +=
        (_retenciones.length > 0 ? "," : "") +
        `(${idfactura}, ${connection.escape(row.monto)}, ${connection.escape(row.tipo)})`;
    });

    data.percepciones.forEach((row) => {
      _percepciones +=
        (_percepciones.length > 0 ? "," : "") +
        `(${idfactura}, ${connection.escape(row.monto)})`;
    });

    data.productos.forEach((row) => {
      query_productos +=
        (query_productos.endsWith("VALUES ") ? "" : ",") +
        `(${idfactura}, ${connection.escape(row.idcodigo)}, ${connection.escape(
          row.cantidad
        )}, ${connection.escape(+row.precio)})`;
    });

    let queries = [];

    if (data.iva.length > 0) {
      queries.push(query_iva + _iva);
    }

    if (data.retenciones.length > 0) {
      queries.push(query_retenciones + _retenciones);
    }

    if (data.percepciones.length > 0) {
      queries.push(query_percepciones + _percepciones);
    }
    if (data.productos.length > 0) {
      queries.push(query_increase_quantities(idfactura));
      queries.push(query_productos);
    }

    _process(queries);
  });
};
const agregar_factura_v3 = (data, callback) => {
  console.log(JSON.stringify(data));
  if(data.nro==="" || +data.fkproveedor===-1 ){
    console.log("Error en datos de factura");
    callback(-1);
    return;
  }
  const connection = mysql_connection.getConnection();

  const _fecha = data.fecha == "" ? "now()" : data.fecha;
  let idfactura = -1;

  let query_factura = `INSERT INTO factura (numero, proveedor_idproveedor, monto, cantidad, tipo, punto_venta, es_remito, fecha, descuento, c_n_gravados, imp_int, neto_gravado) VALUES (
    ${connection.escape(data.nro)}, 
    ${connection.escape(data.fkproveedor)},
    ${connection.escape(data.total)},
    ${connection.escape(data.cant_productos)},
    ${connection.escape(data.tipo)},
    ${connection.escape(data.puntoVenta)}, 
    ${connection.escape(data.esremito)},
    date(${connection.escape(data.fecha)}),
    ${connection.escape(data.descuento)},
    ${connection.escape(parseFloat(data.netoNoGravado||"0"))},
    ${connection.escape(parseFloat(data.impuestosInternos||"0"))},
    ${connection.escape(parseFloat(data.netoGravado||"0"))}
    );`; //toDo

  let query_iva = `INSERT INTO factura_iva (fk_factura, monto, tipo) VALUES `;
  let query_retenciones = `INSERT INTO factura_retencion (fk_factura, monto, tipo) VALUES `;
  let query_percepciones = `INSERT INTO factura_percepcion (fk_factura, monto) VALUES `;
  let query_productos = `INSERT INTO codigo_factura (factura_idfactura, stock_codigo_idcodigo, cantidad, costo) VALUES `;
  let query_increase_quantities = (
    _idfactura
  ) => `UPDATE stock s, ( SELECT * from codigo_factura cf0 WHERE cf0.factura_idfactura=${_idfactura} ) cf
                                SET s.cantidad = s.cantidad + cf.cantidad
                                WHERE
                                s.codigo_idcodigo = cf.stock_codigo_idcodigo AND  
                                s.sucursal_idsucursal = ${data.idsucursal};`;

  const _process = (_queries) => {
    if (_queries.length < 1) {
      callback(idfactura);
      return;
    }
    const query = _queries.pop();

    doQuery(query, ({ data }) => {
      _process(_queries);
    });
  };

  //first insert factura
  doQuery(query_factura, (result) => {
    let idfactura = result.data.insertId;
    let _iva = "";
    let _retenciones = "";
    let _percepciones = "";

    data.iva.forEach((row) => {
      _iva +=
        (_iva.length > 0 ? "," : "") +
        `(${idfactura}, ${connection.escape(row.monto)}, ${connection.escape(
          row.tipo
        )})`;
    });

    data.retenciones.forEach((row) => {
      _retenciones +=
        (_retenciones.length > 0 ? "," : "") +
        `(${idfactura}, ${connection.escape(row.monto)}, ${connection.escape(row.tipo)})`;
    });

    data.percepciones.forEach((row) => {
      _percepciones +=
        (_percepciones.length > 0 ? "," : "") +
        `(${idfactura}, ${connection.escape(row.monto)})`;
    });

    data.productos.forEach((row) => {
      query_productos +=
        (query_productos.endsWith("VALUES ") ? "" : ",") +
        `(${idfactura}, ${connection.escape(row.idcodigo)}, ${connection.escape(
          row.cantidad
        )}, ${connection.escape(+row.precio)})`;
    });

    let queries = [];

    if (data.iva.length > 0) {
      queries.push(query_iva + _iva);
    }

    if (data.retenciones.length > 0) {
      queries.push(query_retenciones + _retenciones);
    }

    if (data.percepciones.length > 0) {
      queries.push(query_percepciones + _percepciones);
    }
    if (data.productos.length > 0) {
      queries.push(query_increase_quantities(idfactura));
      queries.push(query_productos);
    }

    _process(queries);
  });
};

const obtener_factura_por_nro = (nro, callback) => {
  const query = `select * from factura f where f.numero = ${nro}}`;
  const connection = mysql_connection.getConnection();
  connection.connect();
  connection.query(query, (err, resp) => {
    callback(resp);
  });
  connection.end();
};

const obtener_facturas_filtros = (data, callback) => {
  const provids = data.idprovs.length < 1 ? ["0"] : data.idprovs;
  const from = data.desde == "" ? "2000-01-01" : data.desde;
  const to = data.hasta == "" ? "2000-01-01" : data.hasta;
  var _q = +data.ver_facturas == 1 ? " f.es_remito=0 " : "";
  _q +=
    _q.length > 0
      ? +data.ver_remitos == 1
        ? " or f.es_remito=1 "
        : ""
      : +data.ver_remitos == 1
      ? " f.es_remito=1"
      : " f.es_remito=-1 ";

  const query = `SELECT DATE_FORMAT(f.fecha,'%d-%m-%y') AS 'fecha_f', f.*, p.nombre AS 'proveedor' FROM factura f, proveedor p WHERE
                p.idproveedor=f.proveedor_idproveedor and 
                (case when '${
                  data.idprovs.length
                }'<>'0' then f.proveedor_idproveedor IN (${provids.map(
    (id) => id
  )}) ELSE TRUE END) AND 
                (case when '${
                  data.desde
                }'<>'' then DATE(f.fecha)>=DATE('${from}') ELSE TRUE END ) AND 
                (case when '${
                  data.hasta
                }'<>'' then DATE(f.fecha)<=DATE('${to}') ELSE TRUE END ) AND 
                (${_q})
                ;  
                `;
  //console.log(query)

  const connection = mysql_connection.getConnection();
  connection.connect();
  connection.query(query, (err, rows) => {
    callback(rows);
  });
  connection.end();
};

const obtener_factura_montos_adic = (idfactura, callback) => {
  const query = `SELECT 
                fi.monto, 
                'IVA' AS 't', 
                concat(fi.tipo, '%') AS 'detalle' 
                FROM factura_iva fi WHERE fi.fk_factura=${idfactura}
                union
                SELECT 
                fp.monto, 
                'PERCEPCION' AS 't',  
                '' AS 'detalle' 
                FROM factura_percepcion fp WHERE fp.fk_factura=${idfactura}
                union
                SELECT 
                fr.monto, 
                'RETENCION' AS 't', 
                fr.tipo AS 'detalle'
                FROM factura_retencion fr WHERE fr.fk_factura=${idfactura}
                ;`;
  doQuery(query, (resp) => {
    callback(resp.data);
  });
}

module.exports = {
  obtener_facturas_filtros,
  obtener_factura_por_nro,
  obtener_facturas,
  agregar_factura,
  detalle_factura,
  lista_elementos_factura,
  agregar_factura_v3,
  obtener_factura_montos_adic
};
