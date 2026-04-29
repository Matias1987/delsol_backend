const db = require("../database/ClienteOpinion");

const agregarOpinion = (data, callback) => {
  db.guardarOpinionCliente(data, (resp) => {
    return callback(resp);
  });
};

module.exports = {
  agregarOpinion,
};
