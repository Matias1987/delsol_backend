const { doQuery, escapeHelper } = require("./helpers/queriesHelper");

const obtenerOpinionVenta = ({idventa}, callback) => {

}

const guardarOpinionCliente = (data, callback) => {
    const {idcliente, idventa, idvendedor, idsucursal, puntaje, comentario, tipo_operacion} = data;
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
                        );`
    console.log(query);
    doQuery(query, (resp) => {
        return callback(resp);
    });

}


module.exports = {
    obtenerOpinionVenta,
    guardarOpinionCliente,
}