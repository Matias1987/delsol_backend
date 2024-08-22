const opticaService = require("../services/OpticaService")

const agregar_optica = (req, res) => 
{
    const {body} = req
    opticaService.agregar_optica(body,(response)=>{
        res.status(201).send({status:'OK', data:response});
    })
}

const modificar_optica = (req, res) => {
    const {body} = req
    opticaService.modificar_optica(body,(response)=>{
        res.status(201).send({status:'OK', data:response});
    })
}

const obtener_opticas = (req, res) => {
    opticaService.obtener_opticas((rows)=>{
        res.status(201).send({status:'OK', data:rows});
    })
}

const obtener_saldo_cliente_optica = (req, res) => {
    //for get method
    const {params:{idcliente,idoptica}} = req
    opticaService.obtener_saldo_cliente_optica({idcliente:idcliente, idoptica:idoptica},(response)=>{
        res.status(201).send({status:'OK', data:response});
    })
}

const obtener_optica = (req, res) => {
    const {params:{idoptica}} = req
    opticaService.obtener_optica(idoptica,(response)=>{
        res.status(201).send({status:'OK', data:response});
    })
}

module.exports = {agregar_optica, modificar_optica, obtener_opticas,obtener_saldo_cliente_optica, obtener_optica,}