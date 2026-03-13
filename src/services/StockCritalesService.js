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

const check_stock_cristales = (data, callback) => {
  console.log("Checking stock for cristales with data:");
  const addToArray = (parentObj, field, arr) =>
    parentObj[field] ? [...arr, parentObj[field]] : arr;

  const updateCodeQttyArray = (obj, _array) =>
    _array.find(
      (record) =>
        record.idcodigo == obj.idcodigo &&
        record.esf == obj.esf &&
        record.cil == obj.cil,
    )
      ? _array.map((_record) =>
          _record.idcodigo == obj.idcodigo &&
          _record.esf == obj.esf &&
          _record.cil == obj.cil
            ? { ..._record, cantidad: +_record.cantidad + +obj.cantidad }
            : _record,
        )
      : [
          ..._array,
          {
            idcodigo: obj.idcodigo,
            esf: obj.esf,
            cil: obj.cil,
            cantidad: obj.cantidad,
          },
        ];

  let arrayQtties = [];
  let elementsArr = [];
  elementsArr = addToArray(data.productos, "lejos_od", elementsArr);
  elementsArr = addToArray(data.productos, "lejos_oi", elementsArr);
  elementsArr = addToArray(data.productos, "cerca_oi", elementsArr);
  elementsArr = addToArray(data.productos, "cerca_od", elementsArr);

  elementsArr.forEach((element) => {
    arrayQtties = updateCodeQttyArray(element, arrayQtties);
  });

  console.log("elementsArr");
  console.log(elementsArr);
  console.log("arrayQtties");
  console.log(arrayQtties);

  db.obtener_stock(
    {
      fk_sucursal: data.fksucursal,
      codigos: arrayQtties,
    },
    (response) => {
      console.log(JSON.stringify(response));
      if (!response) {
        console.log("Error: No se pudo obtener el stock de cristales.");
        return callback?.({ ok: 0, message: "Error al obtener el stock" });
      }

      if (response.length === 0) {
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

const acutalizar_stock_cristales = (data, callback) => {
  db.obtener_stock(
    { fk_sucursal: data.fk_sucursal, codigos: data.codigos },
    (response) => {
      if (!response) {
        console.log(
          "Error: No se pudo obtener el stock de cristales para actualizar.",
        );
        return callback?.({
          ok: 0,
          message: "Error al obtener el stock para actualizar",
        });
      }
      if (response.length === 0) {
        console.log(
          "No se encontraron registros de stock para los cristales solicitados para actualizar.",
        );
        return callback?.({
          ok: 0,
          message:
            "No se encontró stock para los cristales solicitados para actualizar",
        });
      }
      //update stock quantities by subtracting requested quantities
      const query = `UPDATE stock_cristales sc SET 
      sc.cantidad=sc.cantidad-${data.cantidad} 
      WHERE 
      sc.fk_sucursal=${data.fk_sucursal} AND 
      sc.fk_codigo=${data.fk_codigo} AND 
      sc.esf=${data.esf} AND 
      sc.cil=${data.cil} AND 
      sc.side=${data.side};`;

      doQuery(query, (updateResponse) => {
        if (updateResponse.error) {
          console.log("Error al actualizar el stock de cristales:");
          console.log(updateResponse);
          return callback?.({
            ok: 0,
            message: "Error al actualizar el stock de cristales",
            details: updateResponse.error,
          });
        }

        return callback?.({ ok: 1, message: "Stock de cristales actualizado correctamente" });
        });
    },
  );
};

module.exports = {
  guardar_stock_cristales,
  obtener_grilla,
  obtener_stock,
  obtener_codigos_cristales,
  check_stock_cristales,
  acutalizar_stock_cristales,
};
