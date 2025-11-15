const service = require("../services/InformeVentasService");

const informe_venta_montos_mes = (req,res) => {
    const {body} = req;
    service.informe_venta_montos_mes(body,response=>{
        res.status(201).send({status:'OK', data:response})
    })

}

const informe_ventas_medicos = (req, res) => {
    const {body} = req;
    service.informe_ventas_medicos(body,response=>{
        res.status(201).send({status:"OK", data: response})
    })
}

const informe_ventas_filtros = (req, res) =>{
    const {body} = req;
    service.informe_ventas_filtros(body,response=>{
        res.status(201).send({status:"OK", data:response})
    })
}

module.exports = {informe_venta_montos_mes, informe_ventas_medicos, informe_ventas_filtros}