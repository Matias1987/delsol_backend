const { doQuery } = require("./helpers/queriesHelper");

const AgregarElementoLista = ({ tipo, nombre, id }, callback) => {
  const query = `INSERT ignore INTO lista (tipo, nombre, fk_ref) VALUES ('${tipo}', '${nombre}', ${id});`;
  console.log(query);
  doQuery(query, (_response) => {
    callback(_response);
  });
};

const ObtenerNombreListasPorTipo = ({tipo}, callback) => {
    const query = `SELECT DISTINCT l.nombre FROM lista l WHERE l.tipo='${tipo}'; `;
    doQuery(query, (_response) => {
        callback(_response);
    });
}

module.exports = { AgregarElementoLista, ObtenerNombreListasPorTipo };
