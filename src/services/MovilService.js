const db = require("../database/Movil");

const insert = (data, callback) => {
  db.insert(data, (response) => {
    callback(response);
  });
};

const obtenerVendedores = (callback) => {
  db.obtenerVendedores(response => {
    callback(response);
  })
}
const obtenerSucursales = (callback) => {
  db.obtenerSucursales(response => {
    callback(response);
  })
}

const listarOperacionesMovil = (data, callback) => {
  db.listarOperacionesMovil(data, response => {
    callback(response);
  })
}

module.exports = { insert, obtenerSucursales, obtenerVendedores, listarOperacionesMovil };
