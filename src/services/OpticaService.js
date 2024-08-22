const OpticaDB = require("../database/Optica")

const agregar_optica = (data, callback) => {
    OpticaDB.agregar_optica(data,(response)=>{
        callback(response)
    })
}

const modificar_optica = (data, callback) => {
    OpticaDB.modificar_optica(data,(response)=>{
        callback(response)
    })
}

const obtener_opticas = (callback) => {
    OpticaDB.obtener_opticas((response)=>{
        callback(response)
    })
}

const  obtener_saldo_cliente_optica = (data,callback) =>{
    OpticaDB.obtener_saldo_cliente_optica(data,(response)=>{
        callback(response)
    })
}

const obtener_optica = (idoptica,callback) => {
    OpticaDB.obtener_optica(idoptica,(rows)=>{
        callback(rows)
    })
}

module.exports = {agregar_optica, modificar_optica, obtener_opticas, obtener_saldo_cliente_optica, obtener_optica}