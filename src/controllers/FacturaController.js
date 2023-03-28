const facturaService = require("../services/FacturaService")

const obtener_facturas = (req,res) => {
    //FROM https://stackoverflow.com/questions/47523265/jquery-ajax-no-access-control-allow-origin-header-is-present-on-the-requested
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    facturaService.obtener_facturas((rows)=>{
        res.status(201).send({status:'OK', data:rows})
    })
}

const agregar_factura = (req,res) => {
    const {body} = req
    const data = {}
    facturaService.agregar_factura(data,(id)=>{
        res.status(201).send({status:'OK', data:id})
    })

}

module.exports = {
    obtener_facturas,agregar_factura,
}