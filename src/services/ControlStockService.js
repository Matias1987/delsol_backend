const ControlStockDB = require("../database/ControlStock");

const obtener_lista_controles = (callback) =>{
    ControlStockDB.obtener_lista_controles((rows)=>{
        callback(rows)
    })
}

module.exports={obtener_lista_controles}