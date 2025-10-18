const db = require("../database/InformesVentas")
const informe_venta_montos_mes = (data, callback) =>{
    db.informe_venta_montos_mes(data,(response)=>{
        callback(response)
    })
}

const informe_ventas_medicos = (data, callback) => {
    db.informe_ventas_medicos(data, response=>{
        callback(response)
    })
}

module.exports = {informe_venta_montos_mes, informe_ventas_medicos}