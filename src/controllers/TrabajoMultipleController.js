const service = require('../services/TrabajoMultipleService');
const procesarTrabajoMultiple = (req, res) => {
    const data = req.body;
    service.procesarTrabajoMultiple(data, (result) => {
        return res.json(result);
    });
}

const obtenerListadoVentasTM = (req, res) => {
    service.obtenerListadoVentasTM((result) => {
        return res.json(result);
    });
}

const obtenerTrabajoMultiple = (req, res) => {
    const { idventa } = req.params;
    service.obtenerTrabajoMultiple({ idventa }, (result) => {
        return res.json({data:result});
    });
}

module.exports = { 
    procesarTrabajoMultiple,
    obtenerListadoVentasTM,
    obtenerTrabajoMultiple
}
