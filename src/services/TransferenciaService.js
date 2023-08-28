const TransferenciaDB = require("../database/TransferenciaCaja")

const agregar_transferencia = (data,callback)=>{
    TransferenciaDB.agregar_transferencia(data,(id)=>{
        callback(id)
    })
}
const obtener_transferencias_enviadas = (data,callback)=>{
    TransferenciaDB.obtener_transferencias_enviadas(data,(rows)=>{
        callback(rows)
    })
}
const obtener_transferencias_recibidas = (data,callback)=>{
    TransferenciaDB.obtener_transferencias_recibidas(data,(rows)=>{
        callback(rows)
    })
}

module.exports = {
    agregar_transferencia,
    obtener_transferencias_enviadas,
    obtener_transferencias_recibidas
}