const service = require("../services/MovilService");

const insert = (req, res) => {
  const { body } = req;
  service.insert(body, (response) => {
    res.send({ status: "OK", data: response });
  });
};

const obtenerSucursales = (req, res) => {
  service.obtenerSucursales((response) => {
    res.send(response);
  });
};
const obtenerVendedores = (req, res) => {
  service.obtenerVendedores((response) => {
    res.send(response);
  });
};

const listarOperacionesMovil = (req, res) => {
  //console.log(req);
 console.log(req.query);
 //console.log(req.params);
 //console.log(req.originalUrl);

  const { sucursalId, estado, usuarioId } = req.query;

  service.listarOperacionesMovil(
    {
      sucursalId: sucursalId ?? null,
      estado: estado ?? null,
      usuarioId: usuarioId ?? null,
    },
    (response) => {
      res.send({ status: "OK", data: response });
    },
  );
};

module.exports = {
  insert,
  obtenerSucursales,
  obtenerVendedores,
  listarOperacionesMovil,
};
