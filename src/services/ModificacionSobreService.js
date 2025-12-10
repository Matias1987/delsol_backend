const db = require("../database/ModificacionSobre");

const obtenerConsumoSubgrupoMes = (data, callback) => {
  db.obtenerConsumoSubgrupoMes(data, (rows) => {
    return callback(rows);
  });
};

module.exports = { obtenerConsumoSubgrupoMes };