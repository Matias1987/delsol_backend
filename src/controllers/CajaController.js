const cajaService = require("../services/CajaService");

const obtener_caja = (req, res) =>{
    const {params:{idsucursal}} = req;
    cajaService.obtener_caja(idsucursal,(resp)=>{
        res.status(201).send({status:'OK', data:resp});
    })
}

const obtenerCajasSucursal = (req,res)=>{
    const {params:{idsucursal}} = req;
    cajaService.obtenerCajasSucursal(idsucursal,(rows)=>{
        res.status(201).send({status:'OK', data:rows});
    })
}

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

const informe_caja = (req,res) => {
    const {params:{idcaja}} = req;

    cajaService.informe_caja(idcaja, (resp)=>{
        res.status(201).send({status:'OK', data:resp});
    })

}

const obtener_caja_id = (req, res) =>{
    const {params:{idcaja}} = req;

    cajaService.obtener_caja_id(idcaja, (resp)=>{
        res.status(201).send({status:'OK', data:resp});
    })
}


module.exports={
    obtenerCajasSucursal,
    agregarCaja,
    cerrarCaja,
    obtener_caja,
    informe_caja,
    obtener_caja_id,
}