const service = require("../services/ObjetivoSucursalService")

const obtener_objetivo_sucursal = (req, res) =>{
    const {body} = req
    service.obtener_objetivo_sucursal(body,(response=>{
        res.status(201).send({msg:"OK", data:response})
    }))
}
const establecer_objetivo_sucursal = (req, res) =>{
    const {body} = req
    service.establecer_objetivo_sucursal(body,response=>{
        res.status(201).send({msg:"OK", data:response})
    })
}
const obtener_progreso_sucursal_objetivo = (req, res) =>{
    const {body} = req
    service.obtener_progreso_sucursal_objetivo(body,response=>{
        res.status(201).send({msg:"OK", data:response})
    })
}


module.exports = {
    obtener_objetivo_sucursal,
    obtener_progreso_sucursal_objetivo,
    establecer_objetivo_sucursal,
}