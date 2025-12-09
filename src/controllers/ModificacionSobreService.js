const service = require("../services/ModificacionSobreService");

const obtenerConsumoSubgrupoMes = (req, res) => {
  const { body } = req;
  service.obtenerConsumoSubgrupoMes(body, (rows) => {
    res.json(rows);
  });
};
module.exports = { obtenerConsumoSubgrupoMes };