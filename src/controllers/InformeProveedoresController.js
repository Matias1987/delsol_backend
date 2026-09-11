const service = require("../services/InformeProveedoresService");
const saldo_proveedores_lista = (req, res) => {
  service.saldo_proveedores_lista(null, (response) => {
    res.status(201).send({ status: "OK", data: response });
  });
};

const obtener_saldo_general = (req, res) => {
  service.obtener_saldo_general((response) => {
    res.status(201).send({ status: "OK", data: response });
  });
};

module.exports = { saldo_proveedores_lista, obtener_saldo_general };
