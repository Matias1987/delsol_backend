const dbCajaMaster = require("../database/CajaMaster");
const dbEgreso = require("../database/Egreso");
const dbIngreso = require("../database/Ingreso");
const transferenciaDB = require("../database/TransferenciaCajaV2");
const getBalance = (data, callback) => {
  dbCajaMaster.getBalance(data,(response) => {
    callback(response);
  });
};

const getCajaMaster = (idsucursal, callback) => {};

const getCajasSucursales = (callback) => {
  dbCajaMaster.getCajasSucursales((response) => {
    callback(response);
  });
};

const generarTransferenciaACajaMaster = (data, callback) => {
 // console.log(JSON.stringify(data));
  dbCajaMaster.getCajaMaster((id) => {
    if (!id) return callback(null);

    const _data = {
      idCajaOrigen: data.idCajaOrigen,
      idCajaDestino: id,
      monto: data.montoSist,
      monto_real: data.montoFisico ? data.montoFisico : data.montoSist,
      comentarios: data.comentarios,
    };
    transferenciaDB.generarTransferenciaCaja(_data, (response) => {
      //marcar caja como REVISADA (ie, no pendiente de control)
      dbCajaMaster.marcarCajaComoControlada(data.idCajaOrigen, (err) => {
        if (err) return callback(err);
        callback(response);
      });
    });
  });
};

const generarTransferenciaAFF = (data, callback) => {
  dbCajaMaster.getCajaMaster((idCajaMaster) => {
    if (!idCajaMaster) return callback(null);

    const _data = {
      idCajaOrigen: idCajaMaster,
      idCajaDestino: data.idCajaOrigen,
      monto: data.montoSist,
      monto_real: data.montoFisico ? data.montoFisico : data.montoSist,
      comentarios: data.comentarios,
    };
    transferenciaDB.generarTransferenciaCaja(_data, (response) => {
      if (err) return callback(err);
      callback(response);
    });
  });
};

const agregarEgreso = (data, callback) => {
  dbCajaMaster.getCajaMaster((id) => {
    if (!id) return callback(null);

    const _data = {
      idcaja: id,
      idMotivo: data.idMotivo,
      monto: data.monto,
      comentarios: data.comentarios,
    };
    dbEgreso.createEgreso(_data, (response) => {
      callback(response);
    });
  });
};

module.exports = {
  getBalance,
  getCajasSucursales,
  getCajaMaster,
  generarTransferenciaACajaMaster,
  agregarEgreso,
  generarTransferenciaAFF,
};
