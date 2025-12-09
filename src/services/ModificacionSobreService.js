const db = require("../database/ModificacionSobre");

const obtenerConsumoSubgrupoMes = ({ idsucursal, idsubgrupo, mes, anio }, callback) => {
  db.obtenerConsumoSubgrupoMes({ idsucursal, idsubgrupo, mes, anio }, (rows) => {
    return callback(rows);
  });
};

module.exports = { obtenerConsumoSubgrupoMes };