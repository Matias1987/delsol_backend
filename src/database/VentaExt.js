const { doQuery } = require("./helpers/queriesHelper");

const ventas_mes_vendedor = ({mes, anio, idvendedor, idsucursal}, callback) => {
  const query = `SELECT v.*, CONCAT(c.apellido,' ', c.nombre) AS 'cliente', c.dni, date_format(v.fecha_retiro, '%d-%m-%Y') AS 'fecha_retiro' FROM 
    venta v INNER JOIN 
    cliente c ON v.cliente_idcliente = c.idcliente
    WHERE 
    month(v.fecha_retiro) = ${mes} AND 
    YEAR(v.fecha_retiro) = ${anio} AND 
    v.usuario_idusuario = ${idvendedor} AND 
    v.estado='ENTREGADO' AND 
    (case when '${idsucursal}'<>'-1' then v.sucursal_idsucursal=${idsucursal} ELSE TRUE END)
    ;`;
    console.log("query ventas_mes_vendedor: ", query);
  doQuery(query, (res) => {
    if (!res || res.err) {
      console.log("error: ", err);
      callback(null);
      return;
    }
    //console.log(JSON.stringify(res));
    callback(res.data);
  });
};

module.exports = {
  ventas_mes_vendedor,
};
