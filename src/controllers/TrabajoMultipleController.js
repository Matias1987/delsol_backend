const service = require('../services/TrabajoMultipleService');
const procesarTrabajoMultiple = (req, res) => {
    const data = req.body;
    service.procesarTrabajoMultiple(data, (result) => {
        return res.json(result);
    });
}

const obtenerListadoVentasTM = (req, res) => {
    //const { idsucursal } = req.params;
    const {params:{idsucursal}} = req;
    service.obtenerListadoVentasTM( idsucursal , (result) => {
        return res.json(result);
    });
}

const obtenerTrabajoMultiple = (req, res) => {
    const { idventa } = req.params;
    service.obtenerTrabajoMultiple({ idventa }, (result) => {
        return res.json({data:result});
    });
}

const obtenerItemsTrabajo = (req, res) => {
    const { idtrabajo } = req.params;
    service.obtenerItemsTrabajo({ idtrabajo }, (result) => {
        return res.json({data:result});
    });
}

const marcarComoEntregado = (req, res) => {
    const {body} = req;
    service.marcar_como_entregado(body, (response)=>{
        console.log("To return")
        return res.json({data:response});
    })
}

module.exports = { 
    procesarTrabajoMultiple,
    obtenerListadoVentasTM,
    obtenerTrabajoMultiple,
    obtenerItemsTrabajo,
    marcarComoEntregado
}
