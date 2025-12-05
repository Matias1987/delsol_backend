const gastoService = require("../services/GastoService");

const obtenerGastosSucursal = (req,res) => {
    const {params:{idsucursal}} = req;

    gastoService.obtenerGastosSucursal(idsucursal,(_rows)=>{
        res.status(201).send({status:'OK', data:_rows});
    })
}

const obtenerGastosCaja = (req,res) => {
    const {params:{idcaja}} = req;

    gastoService.obtenerGastosCaja(idcaja,(rows)=>{
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

const anularGasto = (req,res) => {
    const {body} = req;

    gastoService.anularGasto(body,(response)=>{
        res.status(201).send({status:'OK', data:response});
    })
}


module.exports = {
    obtenerGasto,
    obtenerGastosSucursal,
    agregarGasto,
    editarGasto,
    obtenerGastosCaja,
    anularGasto
}