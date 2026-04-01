const db = require("../database/InformesProveedores");
const dbProveedores = require("../database/Proveedor");

const saldo_proveedores_lista_v2 = (data, callback) => {
  const monedasResponse = [];
  let monedas = [];

  const processQuery = () => {
    if (monedas.length === 0) {
      console.log(monedasResponse);
      callback(monedasResponse);
      return;
    }
    const curr_moneda = monedas.pop();
    db.saldo_proveedores_lista({ moneda: curr_moneda }, (response) => {
      monedasResponse.push({ moneda: response.moneda, data: response.data });
      processQuery();
    });
  };

  //first get list of currencies

  dbProveedores.monedas_existentes({}, (response1) => {
    response1.forEach((moneda) => {
      monedas.push(moneda.moneda);
    });
    processQuery();
  });
};

const saldo_proveedores_lista   = (data, callback) => {
  db.saldo_proveedores_lista_monedas(data, (response) => {
    callback(response);
  });
};

/***/
module.exports = { saldo_proveedores_lista, saldo_proveedores_lista_v2 };
