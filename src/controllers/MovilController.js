const service = require("../services/MovilService");

const insert = (req, res) => {
  const { body } = req;
  service.insert(body, (response) => {
    res.send({ status: "OK", data: response });
  });
};

const obtenerSucursales = (req, res) => {
  service.obtenerSucursales(response => {
    res.send({ status: "OK", data: response });
  })
}
const obtenerVendedores = (req, res) => {
  service.obtenerVendedores(response => {
    res.send({ status: "OK", data: response });
  })
}

module.exports = { insert, obtenerSucursales, obtenerVendedores };
