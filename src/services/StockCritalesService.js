const { doQuery } = require("../database/helpers/queriesHelper");
const db = require("../database/StockCristales");

const guardar_stock_cristales = (data, callback) => {
  db.guardar_stock_cristales(data, (response) => {
    callback(response);
  });
};

const obtener_grilla = (data, callback) => {
  db.obtener_grilla(data, (response) => {
    callback(response);
  });
};

const obtener_stock = (data, callback) => {
  db.obtener_stock(data, (response) => {
    callback(response);
  });
};

const obtener_codigos_cristales = (callback) => {
  db.obtener_codigos_cristales((response) => {
    callback(response);
  });
};

const check_stock_cristales = (
  { fksucursal, elementsArr, arrayQtties },
  callback,
) => {
  console.log("Checking stock for cristales with data:");

  console.log("elementsArr");
  console.log(elementsArr);
  console.log("arrayQtties");
  console.log(arrayQtties);

  if(elementsArr.length<1 || arrayQtties.length<1){
    console.log("No hay cristales para verificar. Saltando verificación de stock de cristales.");
    return callback?.({ok:1, message: "No hay cristales para verificar"});
  }

  db.obtener_stock(
    {
      fk_sucursal: fksucursal,
      codigos: arrayQtties,
    },
    (response) => {
      console.log(JSON.stringify(response));
      if (!response) {
        console.log("Error: No se pudo obtener el stock de cristales.");
        return callback?.({ ok: 0, message: "Error al obtener el stock" });
      }

      if (response.length === 0 || !response.length) {
        console.log(
          "No se encontraron registros de stock para los cristales solicitados.",
        );
        return callback?.({
          ok: 0,
          message: "No se encontró stock para los cristales solicitados",
        });
      }
      //compare requested quantities with stock quantities
      const responseWithQtty = response.map((stockRecord) => {
        const requestedQtty = arrayQtties.find(
          (requested) =>
            requested.idcodigo === stockRecord.fk_codigo &&
            requested.esf === stockRecord.esf &&
            requested.cil === stockRecord.cil,
        );

        const response = {
          ...stockRecord,
          requestedCantidad: requestedQtty ? requestedQtty.cantidad : 0,
          stockSuficiente: requestedQtty
            ? stockRecord.cantidad >= requestedQtty.cantidad
            : true,
        };

        console.log(
          `Stock record for codigo ${stockRecord.fk_codigo}, esf ${stockRecord.esf}, cil ${stockRecord.cil}:`,
        );
        console.log(`- Stock cantidad: ${stockRecord.cantidad}`);
        console.log(`- Requested cantidad: ${response.requestedCantidad}`);
        console.log(
          `- Stock suficiente: ${response.stockSuficiente ? "Sí" : "No"}`,
        );

        return response;
      });
      callback?.({ ok: 1, arrayQtties, responseWithQtty });
    },
  );
};

const acutalizar_stock_cristales = ({ fksucursal, arrayQtties }, callback) => {
  if (arrayQtties.length < 1) {
    console.log("No hay cristales para actualizar. Saltando actualización de stock de cristales.");
    return callback?.({
      ok: 1,
      message: "No hay cristales para actualizar",
    });
  }
  const clonedArr = [...arrayQtties];

  const doUpdate = ()=>{
    if(clonedArr.length>0){
      const codigo = clonedArr.pop();
      db.acutalizar_stock_cristales({...codigo, fk_sucursal: fksucursal}, (_) => {
      doUpdate();
    });
    }
    else{
      return callback?.({status: "ok", message: "Stock de cristales actualizado correctamente"});
    }
  }
  doUpdate();
};

module.exports = {
  guardar_stock_cristales,
  obtener_grilla,
  obtener_stock,
  obtener_codigos_cristales,
  check_stock_cristales,
  acutalizar_stock_cristales,
};
