const service = require("../services/ModificacionSobreService");

const obtenerConsumoSubgrupoMes = (req, res) => {
  const { body } = req;
  //console.log(JSON.stringify(body));
  service.obtenerConsumoSubgrupoMes( body, (resp) => {
    if (null===resp) {
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(201).send({status:'OK', data:resp});
    }});
};

module.exports = {
  obtenerConsumoSubgrupoMes,
};