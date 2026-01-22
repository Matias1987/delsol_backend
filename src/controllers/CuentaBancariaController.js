const service = require("../services/CuentaBancariaService");

const agregarCuentaBancaria = (req,res)=>{
    const {body} = req;
    service.activarCuentaBancaria(body,(response)=>{
        
    })
}

const listaCuentasBancarias = (req,res) => {
    service.listaCuentasBancarias((response)=>{

    })
}

const activarCuentaBancaria = (req,res) =>{
    const {body} = req;
    service.activarCuentaBancaria(body,(response)=>{
        
    })
}

module.exports ={
    agregarCuentaBancaria,listaCuentasBancarias,activarCuentaBancaria
}