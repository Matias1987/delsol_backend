const service = require("../services/CajaMasterService");

const getBalance = (req, res) => {
  service.getBalance((results) => {
    if (!results) return res.status(500).json({ error: "Internal server error" });
    res.json(results);
  });
};

const getCajasSucursales = (req, res) => {
  service.getCajasSucursales((results) => {
    console.log("Cajas sucursales: ", results);
    res.json(results);
  });
};

const generarTransferenciaACajaMaster = (req, res) => {
  const data = req.body;
  service.generarTransferenciaACajaMaster(data, (results) => {
    if (!results) return res.status(500).json({ error: "Internal server error" });
    res.json(results);
  });
};

const generarTransferenciaAFF = (req, res) => {
  const data = req.body;
  service.generarTransferenciaAFF(data, (results) => {
    if (!results) return res.status(500).json({ error: "Internal server error" });
    res.json(results);
  });
};

const agregarEgreso = (req, res) => {
  const data = req.body;
  service.agregarEgreso(data, (results) => {
    if (!results) return res.status(500).json({ error: "Internal server error" });
    res.json(results);
  });
};

module.exports = {
  getBalance,
  getCajasSucursales,
  generarTransferenciaACajaMaster,
  agregarEgreso,
  generarTransferenciaAFF,
};
