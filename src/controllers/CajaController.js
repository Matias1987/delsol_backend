const cajaService = require("../services/CajaService");

const obtener_caja = (req, res) =>{
    const {params:{idsucursal}} = req;
    cajaService.obtener_caja(idsucursal,(resp)=>{
        res.status(201).send({status:'OK', data:resp});
    })
}

const obtenerCajas = (req,res)=>{}

const agregarCaja = (req,res)=>{
    const {body} = req;

    cajaService.agregarCaja(body,(id)=>{
        res.status(201).send({status:'OK', data:id});
    })
}

const cerrarCaja = (req,res) => {
    const {params:{idcaja}} = req;

    cajaService.cerrarCaja(idcaja, (resp)=>{
        res.status(201).send({status:'OK', data:resp});
    })

}


module.exports={
    obtenerCajas,
    agregarCaja,
    cerrarCaja,
    obtener_caja
}