const LlamadaService = require("../services/LlamadaClienteService")

const agregarLlamada = (req,res) => {
    const {body} = req

    LlamadaService.agregarLlamadaCliente(body,(data)=>{
        res.status(201).send({status:'OK', data:data});
    })
}

const listaLlamadasCliente = (req, res) => {
    const {params:{idcliente}} = req
    LlamadaService.listaLlamadasCliente(idcliente,(rows)=>{
        res.status(201).send({status:'OK', data:rows});
    }) 
}

module.exports = {agregarLlamada, listaLlamadasCliente}