const db = require("../database/ClienteOpinion");

const agregarOpinion = (data, callback) => {
  db.guardarOpinionCliente(data, (resp) => {
    return callback(resp);
  });
};

const obtenerOpiniones = (callback) => {
  db.obtenerOpiniones((resp) => {
    return callback(resp);
  });
};

module.exports = {
  agregarOpinion,
  obtenerOpiniones,
};
