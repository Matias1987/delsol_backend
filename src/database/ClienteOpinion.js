const obtenerOpinionVenta = ({idventa}, callback) => {

}

const guardarOpinionCliente = (data, callback) => {
    const {idcliente, idventa, idvendedor} = data;
    const query = `INSERT INTO 
                        cliente_opinion 
                        (
                            id_cliente, 
                            id_vendedor, 
                            id_sucursal, 
                            id_operacion, 
                            puntaje, 
                            comentario
                        ) 
                        VALUES (
                        );`

}


module.exports = {
    obtenerOpinionVenta,
    guardarOpinionCliente,
}