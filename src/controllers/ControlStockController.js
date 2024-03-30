const ControlStockService = require("../services/ControlStockService");

const obtener_lista_controles = (req,res) =>{
    ControlStockService.obtener_lista_controles((rows)=>{
        res.status(201).send({status: 'OK', data:rows});
    })

}

module.exports={obtener_lista_controles}