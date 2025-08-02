const TransferenciaDB = require("../database/TransferenciaCajaV2")

const agregar_transferencia = (data,callback)=>{
    TransferenciaDB.generarTransferenciaCaja(data,(result)=>{
        callback(result)
    })
}
const obtener_transferencias_enviadas = (data,callback)=>{
    TransferenciaDB.obtener_transferencias_enviadas(data,(result)=>{
        callback(result)
    })
}
const obtener_transferencias_recibidas = (data,callback)=>{
    
}

module.exports = {
    agregar_transferencia,
    obtener_transferencias_enviadas,
    obtener_transferencias_recibidas
}