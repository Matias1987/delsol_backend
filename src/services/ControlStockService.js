const ControlStockDB = require("../database/ControlStock");

const obtener_lista_controles = (idsucursal, callback) =>{
    ControlStockDB.obtener_lista_controles(idsucursal,(rows)=>{
        callback(rows)
    })
}

const agregar_control = (data,callback) => {
    ControlStockDB.agregar_control(data,(resp)=>{
        callback(resp)
    })
}

module.exports={obtener_lista_controles, agregar_control}