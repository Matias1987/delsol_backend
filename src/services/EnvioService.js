const EnvioDB = require("../database/Envio")

const obtenerEnvio = (idenvio, callback) => {
    EnvioDB.detalle_envio(idenvio,(rows)=>{
        return callback(rows);
    })
}

const obtenerEnvios = (callback) => {
    EnvioDB.obtenerEnvios((rows)=>{
        return callback(rows);
    })
}

const agregarEnvio = (data, callback) => {
    EnvioDB.agregar_envio(
        data, (id)=>{
            return callback(id);
        }
    )
}

const editarEnvio = (req,res) => {}

const obtener_envios_codigo = (idcodigo, callback) => {
    EnvioDB.obtener_envios_codigo(idcodigo,(rows)=>{
        return callback(rows);
    })
}

const obtener_envios_pendientes_sucursal = (idsucursal, callback) => {
    EnvioDB.obtener_envios_pendientes_sucursal(idsucursal,(rows)=>{
        return callback(rows)
    })
}

const cargarEnvio = (idenvio, idsucursal, callback) => {
    EnvioDB.cargarEnvio(idenvio, idsucursal,(resp)=>{
        return callback(resp)
    })
}

const anular_envio = (idenvio, callback) => {
    EnvioDB.anular_envio(idenvio,(resp)=>{
        return callback(resp)
    })
}

const buscarStockEnvio = (data, callback) =>{
    EnvioDB.search_stock_envio(data,(rows)=>{
        callback(rows)
    })
}

module.exports = {
    buscarStockEnvio,
    anular_envio,
    cargarEnvio,
    obtener_envios_pendientes_sucursal,
    obtenerEnvio,
    obtenerEnvios,
    agregarEnvio,
    editarEnvio,
    obtener_envios_codigo,
}