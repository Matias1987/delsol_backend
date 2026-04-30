const service = require('../services/ClienteOpinionService');

const agregarOpinion = (req, res) => {
  const data = req.body;
  service.agregarOpinion(data, (resp) => {
    return res.json(resp);
  });
};

const obtenerOpiniones = (req, res) => {
  service.obtenerOpiniones((resp) => {
    return res.json(resp);
  });
};

module.exports = {
  agregarOpinion,
  obtenerOpiniones,
};
