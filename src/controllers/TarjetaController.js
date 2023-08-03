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


module.exports = {
    obtenerTarjeta,
    obtenerTarjetas,
    agregarTarjeta,
    editarTarjeta
}