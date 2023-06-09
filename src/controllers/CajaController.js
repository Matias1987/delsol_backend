const cajaService = require("../services/CajaService");

const obtenerCajas = (req,res)=>{}

const agregarCaja = (req,res)=>{
    const {body} = req;

    const nueva_caja = {
        'sucursal_idsucursal': body.sucursal_idsucursal,
        'monto_inicial': body.monto_inicial,
    }

    cajaService.agregarCaja(nueva_caja,(id)=>{
        res.status(201).send({status:'OK', data:id});
    })
}

const cerrarCaja = (req,res) => {}


module.exports={
    obtenerCajas,
    agregarCaja,
    cerrarCaja
}