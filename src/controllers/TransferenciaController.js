const transferenciaService = require("../services/TransferenciaService");

const agregar_transferencia = (req,res) => {
    const {body} = req;
    transferenciaService.agregar_transferencia(body,(id)=>{
        res.status(201).send({status:'OK', data:id});
    })
}

const obtener_transferencias_enviadas = (req,res) => {
    const {params:{idsucursal,idcaja}} = req;
    res.status(201).send({status:'OK', data:[]});
    /*transferenciaService.obtener_transferencias_enviadas({idsucursal, idcaja},(rows)=>{
        res.status(201).send({status:'OK', data:[]});
    })*/
}

const obtener_transferencias_recibidas = (req,res) => {
    const {params:{idsucursal,idcaja}} = req;
    res.status(201).send({status:'OK', data:[]});
    /*transferenciaService.obtener_transferencias_recibidas({idsucursal, idcaja},(rows)=>{
        res.status(201).send({status:'OK', data:rows});
    })*/
}

module.exports = {
    agregar_transferencia,
    obtener_transferencias_enviadas,
    obtener_transferencias_recibidas,
}