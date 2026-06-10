const service = require("../services/CajaMasterService");

const validar_usuario = ({ id_usuario, idsucursal, token }, callback) => {
  //for now return true, but in the future we will check if the user has permissions to open a caja
  return callback(true);
};

const getBalance = (req, res) => {
  const {
    params: { fullList },
  } = req;
  service.getBalance({ fullList: fullList == 1 }, (results) => {
    if (!results)
      return res.status(500).json({ error: "Internal server error" });
    res.json(results);
  });
};

const getCajasSucursales = (req, res) => {
  service.getCajasSucursales((results) => {
    res.json(results);
  });
};

const generarTransferenciaACajaMaster = (req, res) => {
  const data = req.body;
  validar_usuario(data, (isValid) => {
    if (!isValid) {
      return res
        .status(403)
        .json({ error: "User is not authorized to perform this action" });
    }
    service.generarTransferenciaACajaMaster(data, (results) => {
      if (!results)
        return res.status(500).json({ error: "Internal server error" });
      res.json(results);
    });
  });
};

const generarTransferenciaAFF = (req, res) => {
  const data = req.body;
  validar_usuario(data, (isValid) => {
    if (!isValid) {
      return res
        .status(403)
        .json({ error: "User is not authorized to perform this action" });
    }
    service.generarTransferenciaAFF(data, (results) => {
      if (!results)
        return res.status(500).json({ error: "Internal server error" });
      res.json(results);
    });
  });
};

const agregarEgreso = (req, res) => {
  const data = req.body;
  validar_usuario(data, (isValid) => {
    if (!isValid) {
      return res
        .status(403)
        .json({ error: "User is not authorized to perform this action" });
    }
    service.agregarEgreso(data, (results) => {
      if (!results)
        return res.status(500).json({ error: "Internal server error" });
      res.json(results);
    });
  });
};

module.exports = {
  getBalance,
  getCajasSucursales,
  generarTransferenciaACajaMaster,
  agregarEgreso,
  generarTransferenciaAFF,
};
