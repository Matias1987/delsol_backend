const ControlStockService = require("../services/ControlStockService");

const agregar_control = (req,res) => {
    const {body} =  req
    ControlStockService.agregar_control(body,(resp)=>{
        res.status(201).send({status:'OK', data: resp})
    })
}

const obtener_lista_controles = (req,res) =>{
    ControlStockService.obtener_lista_controles((rows)=>{
        res.status(201).send({status: 'OK', data:rows});
    })

}

module.exports={obtener_lista_controles, agregar_control,}