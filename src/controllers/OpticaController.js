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

module.exports = {agregar_optica, modificar_optica, obtener_opticas}