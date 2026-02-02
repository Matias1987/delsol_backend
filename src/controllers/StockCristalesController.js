const service = require("../services/StockCritalesService");

const guardar_stock_cristales = (req,res)=>{
    const {body} = req;
    service.guardar_stock_cristales(body,(response)=>{
        res.status(201).send({status:'OK', data:response});
    })
}
const obtener_grilla = (req,res)=>{
    const {body} = req;
    service.obtener_grilla(body,(response)=>{
        res.status(201).send({status:'OK', data:response});
    })
}
const obtener_stock = (req,res)=>{
    const {body} = req;
    service.obtener_stock(body,(response)=>{
        res.status(201).send({status:'OK', data:response});
    })
}

const obtener_codigos_cristales = (req, res) =>{ 
    service.obtener_codigos_cristales(response=>{
        res.status(201).send({status:'OK', data:response});
    })
}

module.exports = {guardar_stock_cristales,obtener_grilla, obtener_stock, obtener_codigos_cristales}


