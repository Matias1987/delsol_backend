const LlamadaDB = require("../database/LlamadaCliente")

const agregarLlamadaCliente = (data,callback) => {
    LlamadaDB.AgregarLlamadaCliente(data,(resp)=>{
        callback(resp)
    })
}

const listaLlamadasCliente = (data,callback) => {
    LlamadaDB.ObtenerLlamadasCliente(data,(rows)=>{
        callback(rows)
    })
}

module.exports = {agregarLlamadaCliente, listaLlamadasCliente, }