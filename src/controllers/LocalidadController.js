const localidadService = require("../services/LocalidadService")

const obtenerLocalidadesPorProvincia = (req,res) => 
{
    const {params:{idprovincia}} = req
    
    localidadService.obtenerLocalidadesPorProvincia(idprovincia,(rows)=>
    {
        res.send({status:"OK", data: rows})
    })
}

const obtenerProvincias = (req,res) =>{
    localidadService.obtenerProvincias((rows)=>{
        res.send({status:"OK", data: rows})
    })
}

module.exports = {obtenerLocalidadesPorProvincia, obtenerProvincias}