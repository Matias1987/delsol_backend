const { doQuery } = require("./helpers/queriesHelper");

const agregarCuentaBancaria = (data, callback)=>{
    const query = `insert into banco_cuenta_bancaria (nombre) values ?`;
    doQuery(query,(response)=>{
        callback(response)
    })
}

const listaCuentasBancarias = (callback) => {
    const query = `select * from banco_cuenta_bancaria;`;
    doQuery(query,(response)=>{
        callback(response)
    })
}

const activarCuentaBancaria = ({idcuenta, activo}, callback) =>{
    const query = `update banco_cuenta_bancaria bc set bc.activo=${activo} where bc.id_cuenta=${idcuenta}`;
    doQuery(query,(response)=>{
        callback(response)
    })
}

const obtenerTiposCuentas = (callback) =>{
    const query = `select * from banco_tipo_cuenta;`;
    doQuery(query,(response)=>{
        callback(response)
    })
}

module.exports ={
    agregarCuentaBancaria,listaCuentasBancarias,activarCuentaBancaria, obtenerTiposCuentas,
}