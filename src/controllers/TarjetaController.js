const tarjetaService = require("../services/TarjetaService");

const obtenerTarjetas = (req,res) => {
    tarjetaService.obtenerTarjetas((rows)=>{
        res.status(201).send({status:'OK', data:rows});
    })
}

const obtenerTarjeta = (req,res) => {}

const agregarTarjeta = (req,res) => {
    const {body} = req;

    const nueva_tarjeta = {
        'nombre': body.nombre
    }

    tarjetaService.agregarTarjeta(nueva_tarjeta,(id)=>{
        res.status(201).send({status:'OK', data:id});
    })
}

const editarTarjeta = (req,res) => {}

const desactivar_tarjeta = (req, res) => {
    //const {params:{idtarjeta}} = req
    const {body} = req
    tarjetaService.desactivar_tarjeta(body,(_)=>{
        res.status(201).send({status:'OK', data:1});
    })
}

const cobros_tarjeta = (req,res) => {
    const {body} = req
    tarjetaService.cobros_tarjeta(body,(resp)=>{
        res.status(201).send({status:'OK', data:resp});
    })
}

const cuotas_pendientes = (req,res) => {
    const {body} = req
    tarjetaService.cuotas_pendientes(body,(resp)=>{
        res.status(201).send({status:'OK', data:resp});
    })
}

module.exports = {
    desactivar_tarjeta,
    obtenerTarjeta,
    obtenerTarjetas,
    agregarTarjeta,
    editarTarjeta,
    cobros_tarjeta,
    cuotas_pendientes,
}