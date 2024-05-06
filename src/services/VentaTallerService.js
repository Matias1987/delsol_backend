const ventaTallerDB = require("../database/VentaTaller")

const agregar_pedido = (data, callback) => {
    ventaTallerDB.agregar_pedido(data,(resp)=>{
        callback(resp)
    })
}

const marcar_como_calibrando = (data, callback) => {
    ventaTallerDB.marcar_como_calibrando(data, (resp)=>{
        callback(resp)
    })
}

const marcar_como_terminado = (data, callback) => {
    ventaTallerDB.marcar_como_terminado(data,(resp)=>{
        callback(resp)
    })
}

const obtener_lista_operaciones = (data, callback) => {
    ventaTallerDB.obtener_lista_operaciones(data,(resp)=>{
        callback(resp)
    })
}

const obtener_items_operacion = (data, callback) => {
    ventaTallerDB.obtener_items_operacion(data,(resp)=>{
        callback(resp)
    })
}

module.exports = {marcar_como_calibrando, marcar_como_terminado, agregar_pedido, obtener_lista_operaciones, obtener_items_operacion}