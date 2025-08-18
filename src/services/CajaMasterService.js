const dbCajaMaster = require('../database/CajaMaster');
const dbEgreso = require('../database/Egreso');
const dbIngreso = require('../database/Ingreso');

const getBalance = (idsucursal, callback) => {
    dbCajaMaster.getBalance(idsucursal, (response)=>{
        callback(response);
    });
};

const getCajasSucursales = (callback) => {
    dbCajaMaster.getCajasSucursales((response) => {
        callback(response);
    });
};

module.exports = {
    getBalance,
    getCajasSucursales,
};