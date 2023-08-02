const gastoService = require("../services/GastoService");

const obtenerGastos = (req,res) => {
    gastoService.obtenerGastos((rows)=>{
        res.status(201).send({status:'OK', data:rows});
    })
}

const obtenerGasto = (req,res) => {}

const agregarGasto = (req,res) => {
    const {body} = req;

    gastoService.agregarGasto(body,(id)=>{
        res.status(201).send({status:'OK', data:id});
    })
}

const editarGasto = (req,res) => {}


module.exports = {
    obtenerGasto,
    obtenerGastos,
    agregarGasto,
    editarGasto
}