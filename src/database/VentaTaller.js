const mysql_connection = require("../lib/mysql_connection");
const { doQuery } = require("./helpers/queriesHelper");

const agregar_pedido = (data, callback) => {
  /**
   * idcodigo
   * idventaitem
   * estado
   */

  if (data.items.length < 1) {
    callback({ data: "ERR" });
    return;
  }

  const query = `INSERT INTO venta_stock_pedido (fkSucursalPedido, fkcodigo, fkventa, tipo  ) VALUES `;

  //CALLBACK
  let values = ``;
  data.items.forEach((i) => {
    values +=
      (values.length > 1 ? "," : "") +
      `(${data.fksucursalpedido},${i.fkcodigo},${data.fkventa},'${i.tipo}')`;
  });

  const connection = mysql_connection.getConnection();
  connection.connect();
  connection.query(query + values, (err, resp) => {
    connection.query(
      `update venta v set v.estado_taller='PEDIDO' where v.idventa = ${data.fkventa}`,
      (err, resp) => {
        callback(resp);
      }
    );

    connection.end();
  });
};

const marcar_como_calibrando = (data, callback) => {
  const query = `update venta v set v.estado_taller='CALIBRADO' where v.idventa = ${data.idventa}`;
  const connection = mysql_connection.getConnection();
  connection.connect();
  connection.query(query, (err, resp) => {
    callback(resp);
  });
  connection.end();
};

const marcar_como_terminado = (data, callback) => {
  const query = `update venta v set v.estado_taller='TERMINADO', v.en_laboratorio='0' where v.idventa = ${data.idventa}`;
  const connection = mysql_connection.getConnection();
  connection.connect();
  connection.query(query, (err, resp) => {
    callback(resp);
  });
  connection.end();
};

const obtener_items_operacion = (data, callback) => {
  const query = `SELECT 
	c.idcodigo,
	c.codigo,
	vsp.fechaAlta,
	vsp.tipo,
	vsp.estado,
	vsp.cantidad
 FROM 
venta_stock_pedido vsp INNER JOIN 
codigo c ON c.idcodigo = vsp.fkcodigo
WHERE 
vsp.fkventa = ${data.idventa};


    ;`;
  // console.log(query)
  const connection = mysql_connection.getConnection();
  connection.connect();
  connection.query(query, (err, rows) => {
    callback(rows);
  });
  connection.end();
};

const obtener_lista_operaciones = (data, callback) => {
  const query = `SELECT 
    v.idventa,
    CONCAT(c.apellido,' ',c.nombre) AS 'cliente',
    u.nombre AS 'usuario',
    DATE_FORMAT(v.fecha_retiro,'%d-%m-%Y') AS 'fecha_retiro_f'
    FROM venta v, cliente c, usuario u 
    WHERE 
    v.estado='PENDIENTE' AND 
    v.estado_taller='${data.estado_taller}';`;
  const connection = mysql_connection.getConnection();
  connection.connect();
  connection.query(query, (err, rows) => {
    callback(rows);
  });
  connection.end();
};

const marcar_como_laboratorio = (data, callback) => {
  const query = `update venta v set v.estado_taller='LAB' where v.idventa = ${data.idventa}`;
  console.log(query);
  const connection = mysql_connection.getConnection();
  connection.connect();
  connection.query(query, (err, resp) => {
    callback(resp);
  });
  connection.end();
};

const informe_consumo_periodo = (data, callback) => {
  console.log("DATA SERVICE: " + JSON.stringify(data));
  const query = `SELECT * FROM 
                    (
                    SELECT op.fk_codigo, op.codigo, SUM(op.cantidad) AS 'cantidad' FROM (
                    SELECT sa.fk_sucursal, sa.fk_codigo, sa.tipo, sa.cantidad, sa.fecha_alta, v.idventa, v.fecha_retiro, v.cliente_idcliente, v.sucursal_idsucursal, c.codigo
                    FROM sobre_adicionales sa 
                    INNER JOIN  codigo c ON c.idcodigo = sa.fk_codigo 
                    INNER JOIN venta v ON v.idventa = sa.fk_venta
                    WHERE sa.fk_venta IN (SELECT v0.idventa FROM venta v0 WHERE date(v0.fecha_retiro)>=date('${data.fecha_desde}') AND date(v0.fecha_retiro)<=date('${data.fecha_hasta}') AND v0.estado='ENTREGADO')
                    ) op
                    GROUP BY op.fk_codigo
                    ) _o ORDER BY _o.cantidad desc;`;
  // console.log(query);
  doQuery(query, (resp) => {
    callback(resp.data);
  });
};

const detalle_consumo_codigo = (data, callback) => {
  console.log("DATA SERVICE DETALLE: " + JSON.stringify(data));
 //const query = `SELECT sa.fk_sucursal, sa.fk_codigo, sa.tipo, sa.cantidad, sa.fecha_alta, v.idventa, v.fecha_retiro, v.cliente_idcliente, v.sucursal_idsucursal
 //                  FROM sobre_adicionales sa 
 //                  INNER JOIN  codigo c ON c.idcodigo = sa.fk_codigo 
 //                  INNER JOIN venta v ON v.idventa = sa.fk_venta
 //                  
 //                  WHERE 
 //                  sa.fk_codigo=${data.fk_codigo} AND 
 //                  sa.fk_venta IN (SELECT v0.idventa FROM venta v0 WHERE date(v0.fecha_retiro)>=date('${data.fecha_desde}') AND date(v0.fecha_retiro)<=date('${data.fecha_hasta}') AND v0.estado='ENTREGADO');`;
  const query = `SELECT s.nombre AS 'sucursal', sa.fk_sucursal, sa.fk_codigo, sa.tipo, sa.cantidad, sa.fecha_alta, v.idventa, v.fecha_retiro, v.cliente_idcliente, v.sucursal_idsucursal, c.codigo
                    FROM sobre_adicionales sa
                    INNER JOIN  codigo c ON c.idcodigo = sa.fk_codigo,
                    venta v, 
                    sucursal s 
                    WHERE
                    v.idventa = sa.fk_venta AND 
                    s.idsucursal = v.sucursal_idsucursal AND 
                    sa.fk_codigo=${data.fk_codigo} AND 
                    sa.fk_venta IN (SELECT v0.idventa FROM venta v0 WHERE date(v0.fecha_retiro)>=date('${data.fecha_desde}') AND date(v0.fecha_retiro)<=date('${data.fecha_hasta}') AND v0.estado<>'ANULADO');`;
  //console.log(query);
  doQuery(query, (resp) => {
    callback(resp.data);
  });
};

const contadores_estado_taller = (data, callback) => {
  const query = `SELECT 
SUM(1) AS 'total',
SUM(if(v.estado_taller='LAB',1,0)) AS 'laboratorio',
SUM(if(v.estado_taller='CALIBRADO',1,0)) AS 'calibrado', 
SUM(if(v.estado_taller='PEDIDO',1,0)) AS 'pedido'
FROM venta v WHERE v.en_laboratorio=1;`;
  doQuery(query, (resp) => {
    callback(resp.data);
  });
}

module.exports = {
  obtener_items_operacion,
  obtener_lista_operaciones,
  marcar_como_calibrando,
  marcar_como_terminado,
  agregar_pedido,
  marcar_como_laboratorio,
  informe_consumo_periodo,
  detalle_consumo_codigo,
  contadores_estado_taller
};
