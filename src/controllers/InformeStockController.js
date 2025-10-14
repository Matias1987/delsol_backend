const service = require("../services/InformeStockService")

const totalesStock =  (req, res) => {
    const {body} = req
    service.totales_stock(body,response=>{
        res.status(201).send({status:'OK', data:response})
    })

}

const totales_venta_codigo_periodo = (req, res) => {
    const {body} = req
    service.totales_venta_codigo_periodo(body,response=>{
        res.status(201).send({status:'OK', data:response})
    })

}

module.exports = {totalesStock, totales_venta_codigo_periodo};