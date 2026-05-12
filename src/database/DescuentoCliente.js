const { doQuery } = require("./helpers/queriesHelper");

const  obtenerDescuentoClienteSubgrupo = (
  { idcliente, idsubgrupo },
  callback,
    ) => {
    const query = `SELECT * FROM         
    (  
        SELECT 1 AS p, dc.id_descuento, dc.porcentaje FROM descuento_cliente dc WHERE dc.fk_cliente=${idcliente} AND  dc.activo=1 AND dc.fk_subgrupo=${idsubgrupo}
        UNION  
        SELECT 0 AS p, dc.id_descuento, dc.porcentaje FROM descuento_cliente dc WHERE dc.todos=1 AND dc.fk_cliente IS NULL AND dc.activo=1 AND dc.fk_subgrupo=${idsubgrupo}
    ) dd
    ORDER BY dd.p DESC LIMIT 1`;

    doQuery(query, (response) => {
        return callback?.(response.data);
    });
};

const agregarDescuentoClienteSubgrupo = (data, callback) => {
  const { idclientes, idsubgrupo, porcentaje, descuentoGral } = data;

  const query = descuentoGral ? `INSERT INTO descuento_cliente (fk_cliente, fk_subgrupo, porcentaje, todos) VALUES (NULL, ${idsubgrupo}, ${porcentaje}, 1)` : 
                                `INSERT INTO descuento_cliente (fk_cliente, fk_subgrupo, porcentaje) VALUES ${idclientes.map((idcliente) => `(${idcliente}, ${idsubgrupo}, ${porcentaje})`).join(",")}`;

  console.log("query", query);

  doQuery(query, (response) => {
    return callback?.(response.data);
  });
};

const obtenerListado = (callback) => {
  const query = `SELECT 
                  dc.*,
                  if(c.idcliente IS NULL , '' , CONCAT(c.apellido,' ',c.nombre)) AS 'cliente',
                  sg.nombre_corto AS 'subgrupo'
                  FROM 
                  descuento_cliente dc LEFT JOIN cliente c ON dc.fk_cliente = c.idcliente , 
                  subgrupo sg
                  WHERE
                  sg.idsubgrupo = dc.fk_subgrupo AND 
                  dc.activo=1
                  `;
  doQuery(query,(response)=>{
    callback?.(response.data);
  })
}

const cambiarEstadoDescuento = (data, callback) =>{
  const query = `UPDATE descuento_cliente dc SET dc.activo = ${data.activo} WHERE dc.id_descuento=${data.id_descuento};`  ;
  doQuery(query,response=>{
    callback({ok:"1"});
  })
}

module.exports = {
  obtenerDescuentoClienteSubgrupo,
  agregarDescuentoClienteSubgrupo,
  obtenerListado,
  cambiarEstadoDescuento,
};
