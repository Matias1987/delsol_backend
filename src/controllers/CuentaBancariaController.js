const service = require("../services/CuentaBancariaService");

const agregarCuentaBancaria = (req,res)=>{
    const {body} = req;
    service.activarCuentaBancaria(body,(response)=>{
        res.json(response);
    })
}

const listaCuentasBancarias = (req,res) => {
    service.listaCuentasBancarias((response)=>{
        res.json(response);
    })
}

const activarCuentaBancaria = (req,res) =>{
    const {body} = req;
    service.activarCuentaBancaria(body,(response)=>{
        res.json(response);
    })
}

const obtenerTiposCuentas = (req,res)=>{
    service.obtenerTiposCuentas(response=>{
        res.json(response);
    })
}

module.exports ={
    agregarCuentaBancaria,listaCuentasBancarias,activarCuentaBancaria, obtenerTiposCuentas
}