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

module.exports = {agregar_optica, modificar_optica, obtener_opticas}