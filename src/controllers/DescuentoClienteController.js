const service = require("../services/DescuentoClienteService");

const obtenerDescuentoClienteSubgrupo = (req, res) => {
    const data = req.body;
    service.obtenerDescuentoClienteSubgrupo(data, (response) => {
        res.json(response);
    });
};

const agregarDescuentoClienteSubgrupo = (req, res) => {
    const data = req.body;
    service.agregarDescuentoClienteSubgrupo(data, (response) => {
        res.json(response);
    });
};

const obtenerListado = (req,res) => {
    service.obtenerListado(response=>{
        res.json(response);
    })
}

const cambiarEstadoDescuento = (req, res) => {
    const data = req.body;
    service.cambiarEstadoDescuento(data, response=>{
        res.json(response);
    })
}

module.exports = {
    obtenerDescuentoClienteSubgrupo,
    agregarDescuentoClienteSubgrupo,
    obtenerListado,
    cambiarEstadoDescuento,
    
}