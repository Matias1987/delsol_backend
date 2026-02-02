const db = require("../database/StockCristales");

const guardar_stock_cristales = (data, callback) =>{
    db.guardar_stock_cristales(data,(response)=>{
        callback(response);
    })

}

const obtener_grilla = (data, callback) =>{
    db.obtener_grilla(data,(response)=>{
        callback(response)
    })

}

const obtener_stock = (data, callback) =>{
    db.obtener_stock(data,(response)=>{
        callback(response)
    })

}

const obtener_codigos_cristales = (callback)=>{
    db.obtener_codigos_cristales(response=>{
        callback(response)
    })
}


module.exports = {guardar_stock_cristales,obtener_grilla, obtener_stock, obtener_codigos_cristales}



