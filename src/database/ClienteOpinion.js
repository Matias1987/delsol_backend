const { doQuery, escapeHelper, doQueryV2 } = require("./helpers/queriesHelper");

const obtenerOpinionVenta = ({ idventa }, callback) => {};

const guardarOpinionCliente = async (data, callback) => {
  const { sucursal, vendedor, puntaje, comentario } = data;
  const query = `INSERT INTO 
                        cliente_opinion 
                        ( 
                            sucursal,
                            vendedor,
                            puntaje, 
                            comentario,
                            id_tipo_opinion
                        ) 
                        VALUES (?);`;

  const values = [sucursal ?? null, vendedor ?? null, puntaje, comentario, 3];
 
  const response = await doQueryV2(query, [values]);

  callback(response);
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
