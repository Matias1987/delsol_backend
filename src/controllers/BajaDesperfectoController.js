const bajaDesperfectoService = require("../services/BajaDesperfectoService")

const agregarBajaDesperfecto = (req,res) => {
    const {body} = req;

    bajaDesperfectoService.agregarBajaDesperfecto(body,(response)=>{
        res.send({status:"OK", data: response})
    })
}

const obtener_lista = (req,res)=>{
    bajaDesperfectoService.obtener_lista((rows)=>{
        res.send({status:"OK", data: rows})
    })
}

module.exports = {agregarBajaDesperfecto,obtener_lista}