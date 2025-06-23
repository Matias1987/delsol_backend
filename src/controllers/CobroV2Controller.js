const service = require("../services/CobroV2Service")

const agregarCobro = (req,res) =>{
    const {body} = req

    service.agregarCobro(req, response=>{
         res.status(201).send({status:'OK', data: response})
    })
}

module.exports = agregarCobro;