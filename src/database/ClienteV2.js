const queries = require("./queries/clienteQueries");
const UsuarioDB = require("./Usuario");
const { doQuery, escapeHelper } = require("./helpers/queriesHelper");

const update_cliente = (data, callback) => {
  const _q = `UPDATE cliente c SET c.direccion='${data.direccion}', c.nombre='${data.nombre}', c.apellido='${data.apellido}', c.telefono1='${data.telefono}' WHERE c.idcliente=${data.idcliente};`;

  doQuery(_q, (resp) => {
    if (!resp) {
      console.log("Error al actualizar cliente");
      return callback(null);
    }
    callback(resp);
  });
};

const lista_ventas_general = (idcliente, callback) => {
  const query = `SELECT s.nombre AS 'sucursal', date_format(v.fecha,'%d-%m-%y') as 'fecha_f' , v.* FROM venta  v, sucursal s WHERE 
    v.sucursal_idsucursal = s.idsucursal and v.estado<>'ANULADO'and 
    v.cliente_idcliente=${idcliente} order by v.idventa desc;`;

  doQuery(query, (resp) => {
    if (!resp) {
      console.log("Error");
      return callback(null);
    }
    callback(resp);
  });
};

const do_agregar_cliente = (data, callback) => {

  const query =`SELECT c.idcliente FROM cliente c WHERE trim(c.dni)=trim(${escapeHelper(data.dni)});`;

  doQuery(
    query,
    (resp) => {
      if (!resp) {
        callback(-1);
        console.log("Error");
        connection.end();
        return;
      }
      const rows = resp.data;
      if (rows.length < 1) {
        
        doQuery(
          queries.queryAgregarCliente(),
          [
            [
              data.localidad_idlocalidad,
              data.nombre,
              data.apellido,
              data.direccion,
              data.dni,
              data.telefono1,
              data.telefono2,
              data.destinatario,
              data.fechaNac,
            ],
          ],
          (resp) => {
            return callback(resp.data.insertId);
          },
        );
      }
    },
  );
};

const agregar_cliente = (data, callback) => {
  UsuarioDB.validar_usuario_be(
    { tk: data.tk },
    () => {
      do_agregar_cliente(data, callback);
    },
    () => {},
  );
};

const obtener_lista_clientes = (callback) => {
  const query = `SELECT c.*, 
    CONCAT(c.apellido,', ', c.nombre) AS 'nombre_completo'
     FROM cliente c where c.destinatario=0 limit 50;`;

  doQuery(query, (resp) => {
    if (!resp) {
      console.log("Error");
      return callback(null);
    }
    callback(resp.data);
  });
};

const detalle_cliente_dni = (dni, callback) => {
  doQuery(queries.queryObtenerClientebyDNI(dni), (resp) => {
    if (!resp) {
      console.log("Error");
      return callback(null);
    }
    callback(resp.data);
  });
};

const detalle_cliente = (id, callback) => {
  doQuery(queries.queryObtenerClientebyID(id), (resp) => {
    if (!resp) {
      console.log("Error");
      return callback(null);
    }
    callback(resp.data);
  });
};

const buscar_cliente = (value, callback) => {
  var _value = decodeURIComponent(value);
  const parts = _value.split(" ");

  var _q = "";
  parts.forEach((p) => {
    if (p.length > 0) {
      _q +=
        (_q.length > 0 ? " AND " : "") +
        `( c.apellido LIKE '%${p}%' OR c.nombre LIKE '%${p}%' OR c.dni LIKE '%${p}%' ) `;
    }
  });

  const _query = `SELECT c.* FROM cliente c WHERE ${_q}`;

  doQuery(_query, (resp) => {
    if (!resp) {
      console.log("Error");
      return callback(null);
    }
    callback(resp.data);
  });
};

const operaciones_cliente = (data, callback) => {
  const query = `select * from
    (
        SELECT 
            2 as 'orden',
            c.idcobro as 'id',
            c.fecha_alta as 'fecha',
            date_format(c.fecha  , '%d-%m-%y') as 'fecha_f',
            'ENTREGA' as 'tipo',
            concat('ENTREGA @', s.nombre) as 'detalle',
            0 as 'debe',
            c.monto as 'haber',
            s.idsucursal
            FROM 
            cobro c, 
            venta_has_modo_pago vhmp, 
            venta v,
            sucursal s
            WHERE
            s.idsucursal = c.sucursal_idsucursal and 
            vhmp.venta_idventa = v.idventa AND 
            v.estado = 'ENTREGADO' AND 
            c.venta_idventa = vhmp.venta_idventa AND 
            vhmp.modo_pago='ctacte' AND 
            c.tipo<>'cuota' AND
            c.cliente_idcliente=${data.idcliente} AND
            c.anulado = 0
        UNION
            select 
            3 as 'orden',
            c.idcobro as 'id',
            c.fecha_alta as 'fecha',
            date_format(c.fecha  , '%d-%m-%y') as 'fecha_f',
            'PAGO CUOTA' as 'tipo',
            concat('PAGO CUOTA  @',s.nombre) as 'detalle',
            0 as 'debe',
            c.monto as 'haber',
            s.idsucursal
            from 
            cobro c, 
            sucursal s 
            where 
            s.idsucursal = c.sucursal_idsucursal and 
            c.cliente_idcliente=${data.idcliente} 
            AND c.tipo = 'cuota'
            AND c.anulado = 0
        union
            select 
            1 as 'orden',
            v.idventa as 'id',
            v.fecha as 'fecha',
            date_format(v.fecha  , '%d-%m-%y') as 'fecha_f',
            'VENTA'  as 'tipo',
            concat('VENTA Cuotas:', vhmp.cant_cuotas, ' Monto: ', format(vhmp.monto_cuota,2) , '  @', s.nombre)   as 'detalle',
            ((v.subtotal - vhmp.monto-v.descuento) + vhmp.cant_cuotas * vhmp.monto_cuota) as 'debe',
            0 as 'haber',
            s.idsucursal
            from 
            sucursal s, venta v INNER JOIN venta_has_modo_pago vhmp ON 
            (
                vhmp.venta_idventa = v.idventa AND  
                v.cliente_idcliente=${data.idcliente} AND 
                v.estado = 'ENTREGADO'  AND 
                vhmp.modo_pago='ctacte'
            )
            where v.sucursal_idsucursal = s.idsucursal 
        union
            select 
            0 as 'orden',
            cm.idcarga_manual as 'id',
            cm.fecha as 'fecha',
            date_format(cm.fecha , '%d-%m-%y')  as 'fecha_f',
            'CARGA MANUAL' as 'tipo',
            concat('CARGA MANUAL "', cm.concepto , '"  @', s.nombre) as 'detalle',
            cm.monto as 'debe',
            0 as 'haber',
            s.idsucursal
            from carga_manual cm, sucursal s  
            where 
            s.idsucursal = cm.sucursal_idsucursal and
            cm.cliente_idcliente=${data.idcliente} and 
            cm.anulado=0
     ) as ops
     where 
     (case when '${data.idsucursal}'='-1' then true else ${data.idsucursal} = ops.idsucursal end)     
     order by ops.fecha asc, ops.orden asc;`;

  doQuery(query, (resp) => {
    if (!resp) {
      console.log("Error");
      return callback(null);
    }
    callback(resp.data);
  });
};

const obtener_saldo_ctacte = (idcliente, callback) => {
  //FALTAN CONDICIONES EN LA CONSULTA, COMO POR  EJ. TENER EN CTA. QUE LA VENTA NO ESTE ANULADA
  const query = queries.queryObtenerBalance(idcliente);

  doQuery(query, (resp) => {
    if (!resp) {
      console.log("Error");
      return callback(null);
    }
    callback(resp.data);
  });
};

const actualizar_saldo_cliente = (idcliente, callback) => {
  const query = queries.queryObtenerBalance(idcliente);

  doQuery(query, (resp) => {
    if (!resp) {
      console.log("Error");
      return callback(null);
    }
    const rows = resp.data;

    if (rows.length > 0) {
      const debe = parseFloat(rows[0].debe);
      const haber = parseFloat(rows[0].haber);
      doQuery(
        `UPDATE cliente c SET c.saldo =${debe - haber} WHERE c.idcliente=${idcliente};`,
        (resp1) => {
          return callback(resp1.data);
        },
      );
    }
  });
};

const actualizar_saldo_en_cobro = (idcobro, callback) => {
  const query0 = `select c.cliente_idcliente from cobro c where c.idcobro=${idcobro}`;

  doQuery(query0, (resp) => {
    const __row = resp.data;

    if (__row.length > 0) {
      const query1 = queries.queryObtenerBalance(__row[0].cliente_idcliente);
      doQuery(query1, (resp1) => {
        const rows = resp1.data;
        if (rows.length > 0) {
          const debe = parseFloat(rows[0].debe);
          const haber = parseFloat(rows[0].haber);
          const query2 = `UPDATE cobro c SET c.saldo_actual = ${debe - haber} WHERE c.idcobro=${idcobro}`;
          doQuery(query2, (resp2) => {
            return callback(resp2.data);
          });
        }
      });
    }
  });
};

const bloquear_cuenta = (data, callback) => {
  const query = `update cliente c set c.bloqueado = 1 where c.idcliente = ${data.idcliente};`;

  doQuery(query, (resp) => {
    const query2 = `INSERT INTO anotacion (refId, tipo, nota, fksucursal, fkusuario) 
    VALUES (
    '${escapeHelper(data.idcliente)}',  
    '${"CLIENTE"}',  
    ${escapeHelper("Bloqueo: " + data.comentario)}, 
    ${escapeHelper(data.idsucursal)}, 
    ${escapeHelper(data.idusuario)});`;
    doQuery(query2, (resp2) => {
      callback(resp2.data);
    });
  });
};

const desbloquear_cuenta = (idcliente, callback) => {
  const query = `update cliente c set c.bloqueado = 0 where c.idcliente = ${idcliente};`;

  doQuery(query, (resp) => {
    callback(resp.data||null);
  });
};

const obtener_clientes_morosos = (data, callback) => {
  const query = `SELECT c3.*, if(t2.idtarea is null,0,1) as 'checked' FROM 
(
    SELECT 
     cl2.dni,
     CONCAT(cl2.apellido, ' ', cl2.nombre) AS 'cliente',
     cl1.* 
     FROM
     (
     SELECT
     ops.idcliente,
     SUM(if(ops.t='d',ops.am,-ops.am)) AS 'saldo'
     FROM (
         SELECT v.cliente_idcliente AS 'idcliente', SUM(vmp.monto_int) AS 'am', 'd' AS 't' FROM venta v INNER JOIN venta_has_modo_pago vmp ON vmp.modo_pago='ctacte' AND vmp.venta_idventa = v.idventa WHERE v.estado='ENTREGADO' GROUP BY v.cliente_idcliente
         UNION
         SELECT cm.cliente_idcliente AS 'idcliente', SUM(cm.monto) AS 'am', 'd' AS 't' FROM carga_manual cm WHERE cm.anulado=0 GROUP BY cm.cliente_idcliente
         UNION
         SELECT c.cliente_idcliente AS 'idcliente', SUM(c.monto) AS 'am', 'h' AS 't' FROM cobro c WHERE c.tipo='cuota' AND c.anulado=0 GROUP BY c.cliente_idcliente
     ) AS ops
     GROUP BY ops.idcliente
     ) AS cl1,
     cliente cl2 
     WHERE
     cl2.bloqueado=0 AND
     cl2.idcliente = cl1.idcliente AND
     cl1.idcliente not IN (SELECT distinct c.cliente_idcliente FROM cobro c WHERE DATE(c.fecha) >= DATE_ADD(date(NOW()), INTERVAL -2 MONTH))
     
   ) c3 left JOIN  (SELECT * from tarea t WHERE t.fk_parent='${data.fk_parent || "0"}' AND t.activo=1) t2 ON t2.ref_id = c3.idcliente order by c3.saldo desc;
                    ;`;

  doQuery(query, (resp) => {
    callback(resp.data);
  });
};

const add_flag = (data, callback) => {
  const query = `update cliente c set c.flag='${data.flag}' where c.idcliente=${data.idcliente}`;

  doQuery(query, (resp) => {
    callback(resp.data||null);
  });
};

const obtener_ultimas_graduaciones = (data, callback) => {
  const query = `SELECT * FROM(
    SELECT vi.*, 'CR' as 'origen', 0 AS 'orden1' FROM 
        (SELECT MAX(v.idventa) AS 'id' FROM venta v WHERE v.cliente_idcliente=${data.idcliente} AND v.estado<>'ANULADO' AND (v.tipo=4 OR v.tipo=2 OR v.tipo=5)) vid,
        (  
            SELECT vs.*, c.codigo, v.tipo as 'tipo_venta' 
            FROM  venta_has_stock vs 
            INNER JOIN codigo c ON vs.stock_codigo_idcodigo = c.idcodigo 
            INNER JOIN venta v where v.idventa=vs.venta_idventa
        ) vi 
    WHERE
        vid.id = vi.venta_idventa 
    UNION
    SELECT vi.*, 'LC' as 'origen', 1 AS 'orden1' FROM 
        (SELECT MAX(v.idventa) AS 'id' FROM venta v WHERE v.cliente_idcliente=${data.idcliente} AND v.estado<>'ANULADO' AND ( v.tipo=6 OR v.tipo=3)) vid,
        (
            SELECT vs.*, c.codigo , v.tipo as 'tipo_venta'
            FROM  venta_has_stock vs 
            INNER JOIN codigo c ON vs.stock_codigo_idcodigo = c.idcodigo
            INNER JOIN venta v where v.idventa=vs.venta_idventa
        ) vi 
    WHERE
        vid.id = vi.venta_idventa 
    )_	ORDER BY _.orden1 ASC, _.orden ASC   `;

  doQuery(query, (resp) => {
    callback(resp.data||null);
  });
};

module.exports = {
  add_flag,
  obtener_clientes_morosos,
  update_cliente,
  bloquear_cuenta,
  desbloquear_cuenta,
  agregar_cliente,
  obtener_lista_clientes,
  detalle_cliente_dni,
  detalle_cliente,
  buscar_cliente,
  operaciones_cliente,
  obtener_saldo_ctacte,
  actualizar_saldo_cliente,
  actualizar_saldo_en_cobro,
  lista_ventas_general,
  obtener_ultimas_graduaciones,
};
