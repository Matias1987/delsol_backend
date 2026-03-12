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
      fk_sucursal: data.fk_sucursal,
      codigos: arrayQtties,
    },
    (response) => {
      if (!response) {
        return callback?.({ ok: 0, message: "Error al obtener el stock" });
      }
      //compare requested quantities with stock quantities
      const responseWithQtty = response.map((stockRecord) => {
        const requestedQtty = arrayQtties.find(
          (requested) =>
            requested.idcodigo === stockRecord.fk_codigo &&
            requested.esf === stockRecord.esf &&
            requested.cil === stockRecord.cil,
        );
        return {
          ...stockRecord,
          requestedCantidad: requestedQtty ? requestedQtty.cantidad : 0,
          strockSuficiente: requestedQtty
            ? stockRecord.cantidad >= requestedQtty.cantidad
            : true,
        };
      });
      callback?.({ ok: 1, arrayQtties, responseWithQtty });
    },
  );
};

module.exports = {
  guardar_stock_cristales,
  obtener_grilla,
  obtener_stock,
  obtener_codigos_cristales,
  check_stock_cristales,
};
