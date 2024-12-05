const db = require("../database/CambioVenta")

const registrar_cambio_venta_item = (data,callback) => {
    db.registrar_cambio_venta_item(data,(response)=>{
        callback(response)
    })
}

module.exports={registrar_cambio_venta_item,}