const { doQuery } = require("./helpers/queriesHelper");

const agregarVenta = (data, callback) => {
  const queryVenta = ``;

  doQuery(queryVenta, (respone) => {
    const idventa = callback?.data?.insertId;

    if (!id) {
      return callback({ error });
    }
    return callback({ idventa });
  });
};

const agregarTrabajo = (data, idventa, response) => {
  const query = ``;
  doQuery(query, (response) => {
    if (!response) {
      return callback({ error });
    }

    return callback(response.data);
  });
};

const checkQuantities = (data, idsucursal, callback) => {
  const query = ``;
  doQuery(query, (response) => {
    if (!response) {
      return callback({ error });
    }

    return callback(response.data);
  });
};

const descontarStock = (idventa, idsucursal, callback) => {
  const query = ``;
  doQuery(query, (response) => {
    if (!response) {
      return callback({ error });
    }

    return callback(response.data);
  });
};

const agregarTabajoItems = (data, idTrabajo, idVenta, callback) => {
  const query = ``;
  doQuery(query, (response) => {
    if (!response) {
      return callback({ error });
    }
  });
};

module.exports = {
  agregarVenta,
  checkQuantities,
  descontarStock,
  agregarTrabajo,
  agregarTabajoItems,
};
