const AdicionalesDB = require("../database/ItemsAdicionales")



const agregar_item_adicional = (data,callback) => {
    AdicionalesDB.agregar_item_adicional(data,(resp)=>{
        callback(resp)
    })
}

const obtener_adicionales_venta = (data,callback) => {
    AdicionalesDB.obtener_adicionales_venta(data,(rows)=>{
        callback(rows)
    })
}

const obtener_uso_items_adic_subgrupo_periodo = (data, callback) => {
    AdicionalesDB.obtener_uso_items_adic_subgrupo_periodo(data,(rows)=>{
        callback(rows)
    })
}

module.exports = {
    agregar_item_adicional, 
    obtener_adicionales_venta,
    obtener_uso_items_adic_subgrupo_periodo
}