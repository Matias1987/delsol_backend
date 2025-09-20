const db = require('../database/InformeStock')

const totales_stock = (data, callback) => {
    db.totales_stock(data,response=>{
        callback(response)
    });
}

module.exports = {totales_stock}