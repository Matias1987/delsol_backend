const anotacionService = require("../services/AnotacionService")

const agregarAnotacion = (req,res)=>{
    const {body} = req
    anotacionService.agregarAnotacion(body,(resp)=>{
        res.send({status:"OK", data: resp})
    })    
}
const obtenerAnotacion = (req,res)=>{
    const {params:{idanotacion}} = req
    anotacionService.obtenerAnotacion(idanotacion,(resp)=>{
        res.send({status:"OK", data: resp})
    })
}

const obtenerAnotaciones = (req, res) => {
    const {body} = req
    anotacionService.obtenerAnotaciones(body,(resp)=>{
        res.send({status:"OK", data: resp})
    })
}

module.exports = {agregarAnotacion, obtenerAnotacion, obtenerAnotaciones}