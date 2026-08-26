const db = require("../database/InformesCaja");

const listaTotalCobrosCuotaMes = (data, callback) => {};
const listaTotalGastosMes = (data, callback) => {};
const montoIngresoCategoria = (data, callback) => {
    db.montoIngresoCategoria(data,(response)=>{
        return callback(response);
    })
};
const montoEgresoCategoria = (data, callback) => {
    db.montoEgresoCategoria(data,(response)=>{
        return callback(response);
    })
};
const operacionesEgresoIngresoSucursal = (data, callback) => {
    db.operacionesEgresoIngresoSucursal(data,(response)=>{
        return callback(response);
    })
};


module.exports = {
  listaTotalCobrosCuotaMes,
  listaTotalGastosMes,
  montoIngresoCategoria,
  montoEgresoCategoria,
  operacionesEgresoIngresoSucursal,
};
