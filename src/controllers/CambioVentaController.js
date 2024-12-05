const service = require("../services/CambioVentaService")

const registrar_cambio_venta_item = (req, res) => {
    const {body}=req
    service.registrar_cambio_venta_item(body,(response)=>{
        res.status(201).send({status:'OK', data: response});
    })
}

module.exports = {registrar_cambio_venta_item,}