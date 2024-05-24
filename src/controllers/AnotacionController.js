const anotacionService = require("../services/AnotacionService")

const agregarAnotacion = (req,res)=>{
    const {body} = req
    anotacionService.agregarAnotacion(body,(resp)=>{
        res.sta
    })    
}
const obtenerAnotacion = (req,res)=>{
    const {params:{idanotacion}} = req
    anotacionService.agregarAnotacion(idanotacion,(resp)=>{
        res.sta
    })
}

const obtenerAnotaciones = (req, res) => {
    anotacionService.agregarAnotacion((resp)=>{
        res.sta
    })
}

module.exports = {agregarAnotacion, obtenerAnotacion, obtenerAnotaciones}