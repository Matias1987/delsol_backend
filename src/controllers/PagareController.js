const pagareService = require("../services/PagareService")

const agregarPagare = ( req, res ) => {
    const {body} = req
    pagareService.agregarPagare(body,(resp)=>{
        res.status(201).send({status:'OK', data:resp});
    
    })
}

const obtenerPagaresCliente = (req,res) => {
    const {params:{idcliente}} = req
    pagareService.obtenerPagaresCliente(body,(resp)=>{
        res.status(201).send({status:'OK', data:resp});
    
    })
}

const obtenerPagare = (req,res) => {
    const {params:{idpagare}} = req
    pagareService.obtenerPagare(body,(resp)=>{
        res.status(201).send({status:'OK', data:resp});
    })
}

module.exports = {obtenerPagaresCliente,obtenerPagare, agregarPagare}