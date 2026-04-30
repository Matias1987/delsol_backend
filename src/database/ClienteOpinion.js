const { doQuery, escapeHelper } = require("./helpers/queriesHelper");

const obtenerOpinionVenta = ({ idventa }, callback) => {};

const guardarOpinionCliente = (data, callback) => {
  const {
    idcliente,
    idventa,
    idvendedor,
    idsucursal,
    puntaje,
    comentario,
    tipo_operacion,
  } = data;
  const query = `INSERT INTO 
                        cliente_opinion 
                        (
                            id_cliente, 
                            id_vendedor, 
                            id_sucursal, 
                            id_operacion, 
                            puntaje, 
                            comentario,
                            tipo_operacion
                        ) 
                        VALUES (
                            ${escapeHelper(idcliente)},
                            ${escapeHelper(idvendedor)},
                            ${escapeHelper(idsucursal)},
                            ${escapeHelper(idventa)},
                            ${escapeHelper(puntaje)},
                           ${escapeHelper(comentario)},
                           ${escapeHelper(tipo_operacion)}
                        );`;
  console.log(query);
  doQuery(query, (resp) => {
    return callback(resp);
  });
};

const obtenerOpiniones = (callback) => {
  const query = `
  SELECT co.*, 
  date_format(co.fecha, '%d-%m-%Y') as 'fecha_formateada', 
  s.nombre AS 'sucursal' 
  FROM 
  cliente_opinion co, 
  sucursal s 
  WHERE 
  co.id_sucursal=s.idsucursal 
  order by co.idopinion desc;`;
  doQuery(query, (resp) => {
    return callback(resp.data);
  });
};

module.exports = {
  obtenerOpinionVenta,
  guardarOpinionCliente,
  obtenerOpiniones,
};
