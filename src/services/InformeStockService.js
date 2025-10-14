const db = require('../database/InformeStock')

const totales_stock = (data, callback) => {
    db.totales_stock(data,response=>{
        callback(response)
    });
}

const totales_venta_codigo_periodo = (data, callback) => {
    db.totales_venta_codigo_periodo(data,response=>{
        callback(response)
    });
}

module.exports = {totales_stock, totales_venta_codigo_periodo}