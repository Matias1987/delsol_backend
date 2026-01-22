const db = require("../database/CuentaBancaria")
const agregarCuentaBancaria = (data,callback) => {
    db.agregarCuentaBancaria(data,(response)=>{
        callback(response)
    })
};

const listaCuentasBancarias = (callback) => {
    db.listaCuentasBancarias((response)=>{
        callback(response)
    })
};

const activarCuentaBancaria = (data, callback) => {
    db.activarCuentaBancaria(data,(response)=>{
        callback(response)
    })
};

module.exports = {
  agregarCuentaBancaria,
  listaCuentasBancarias,
  activarCuentaBancaria,
};
