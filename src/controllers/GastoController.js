const gastoService = require("../services/GastoService");

const obtenerGastos = (req,res) => {
    gastoService.obtenerGastos((rows)=>{
        res.status(201).send({status:'OK', data:rows});
    })
}

const obtenerGasto = (req,res) => {}

const agregarGasto = (req,res) => {
    const {body} = req;

    const nuevo_gasto = {
        'caja_idcaja':body.caja_idcaja,
        'usuario_idusuario':body.usuario_idusuario,
        'concepto_gasto_idconcepto_gasto':body.concepto_gasto_idconcepto_gasto,
        'monto':body.monto,
        'sucursal_idsucursal':body.sucursal_idsucursal,
    }

    gastoService.agregarGasto(nuevo_gasto,(id)=>{
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