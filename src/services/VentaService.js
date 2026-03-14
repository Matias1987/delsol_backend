const ventaDB = require("../database/Venta");
const ventaDBExt = require("../database/VentaExt");
const cobroService = require("./CobroService");
const stockService = require("./StockService");
const stockCristalesService = require("./StockCritalesService");

const lista_ventas_sucursal_mes = (data, callback) => {
  ventaDB.lista_ventas_sucursal_mes(data, (rows) => {
    callback(rows);
  });
};

const lista_ventas_vendedor_mes = (data, callback) => {
  ventaDB.lista_ventas_vendedor_mes(data, (rows) => {
    callback(rows);
  });
};

const totales_venta_vendedor = (data, callback) => {
  ventaDB.totales_venta_vendedor(data, (rows) => {
    callback(rows);
  });
};

const cambiar_estado_venta = (data, callback) => {
  ventaDB.cambiar_estado_venta(data, (results) => {
    if (data.estado == "ANULADO") {
      //restaurar stock de la venta anulada
      ventaDB.inc_cantidades_stock_venta({ idventa: data.idventa }, (resp) => {
        console.log(
          "Stock restaurado por anulación de venta id: " + data.idventa,
        );

        ventaDB.anular_venta_cobros({ idventa: data.idventa }, (resp) => {
          console.log(
            "Cobros relacionados a venta id " + data.idventa + " anulados",
          );
          callback(results);
        });
      });
    } else {
      callback(results);
    }
  });
};
const desc_cantidades_stock_venta = (data, callback) => {
  ventaDB.desc_cantidades_stock_venta(data, (results) => {
    callback(results);
  });
};

const inc_cantidades_stock_venta = (data, callback) => {
  ventaDB.inc_cantidades_stock_venta(data, (results) => {
    callback(results);
  });
};

const obtenerVentas = (callback) => {
  ventaDB.lista_ventas((rows) => {
    callback(rows);
  });
};

const obtenerVentasSucursal = (data, callback) => {
  ventaDB.lista_ventas(data, (rows) => {
    callback(rows);
  });
};

const doAgregarVenta = (data, callback) => {
  ventaDB.insert_venta(data, (id) => {
    let doCobrar = data.cobrar && data.mp;
    doCobrar = doCobrar && (data.mp ? data.mp.total > 0 : false);
    const today = new Date();
    const formattedDate = today.getFullYear() + '-' +
    String(today.getMonth() + 1).padStart(2, '0') + '-' +
    String(today.getDate()).padStart(2, '0');
    if (doCobrar) {
      var params = {
        mp: data.mp,
        tipo: "ingreso",
        monto: data.mp.total,
        caja_idcaja: data.fkcaja,
        usuario_idusuario: data.fkusuario,
        sucursal_idsucursal: data.fksucursal,
        descuento: data.descuento,
        idcliente: data.fkcliente,
        idventa: id,
        fecha: formattedDate, //data.fecha,
        tk: data.tk,
        removeMPRows: true,
      };
      console.log("############# Por cobrar:");
      console.log(params);
      //return callback({idCobro: null, idVenta: id});
      cobroService.agregarCobro(params, (idCobro) => {
        return callback({ idCobro: idCobro, idVenta: id });
      });
    } else {
      return callback({ idVenta: id });
    }
  });
};

const verificar_stock_venta = (data, callback) => {
    const {validarCristalesModo2} = data;

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
  
    let arrayQttiesCristales = [];
    let elementsArrCristales = [];
    elementsArrCristales = addToArray(data.productos, "lejos_od", elementsArrCristales);
    elementsArrCristales = addToArray(data.productos, "lejos_oi", elementsArrCristales);
    elementsArrCristales = addToArray(data.productos, "cerca_oi", elementsArrCristales);
    elementsArrCristales = addToArray(data.productos, "cerca_od", elementsArrCristales);
  
    elementsArrCristales.forEach((element) => {
      arrayQttiesCristales = updateCodeQttyArray(element, arrayQttiesCristales);
    });

  console.log(data);
  console.log("Check for stock availability before adding the venta...");
  stockService.verificar_cantidades_productos({data, ignoreCristales: true, idsucursal: data.fksucursal}, (response) => {
    if (response.error == 1) {
      console.log("Stock verification failed:");
      console.log(response);
      return callback({
        error: "No hay suficiente stock para completar la venta",
        details: response,
      });
    }
    //check for cristales
    stockCristalesService
    .check_stock_cristales(
      {...data, 
        elementsArr:elementsArrCristales, 
        arrayQtties:arrayQttiesCristales
      }, (resp) => {
      
      if(resp.ok==0)
      {
        console.log("1-Stock verification failed for cristales:");
        console.log(resp);
        return callback({
          error:
            "No se pudo verificar el stock de cristales para completar la venta",
          details: resp.message,
        });
      }

      if (resp) {
        if (resp.responseWithQtty.some((r) => !r.stockSuficiente)) {
          console.log("2-Stock verification failed for cristales:");
          console.log(resp);
          return callback({
            error:
              "No hay suficiente stock de cristales para completar la venta",
            details: resp.responseWithQtty.filter((r) => !r.strockSuficiente),
          });
        }
      }

      console.log("Stock verification passed. Adding venta...");

      doAgregarVenta(data, (__response) => {
        desc_cantidades_stock_venta(data, (resp) => {
          console.log("Stock de productos actualizado:");
          console.log(resp);
          stockCristalesService.acutalizar_stock_cristales({fksucursal: data.fksucursal, arrayQtties: arrayQttiesCristales}, (resp)=>{
            console.log("Stock de cristales actualizado:");
            console.log(resp);
            callback(__response);
          });
        });
      });
    });
  });
}

const agregarVenta = (data, callback) => {
  console.log(JSON.stringify(data));
  //return callback({ error: "Función de agregar venta deshabilitada temporalmente para pruebas" });
  verificar_stock_venta(data, response=>{
    return callback(response);
  });

};

const obtenerVenta = (data, callback) => {
  ventaDB.detalle_venta(data, (row) => {
    return callback(row);
  });
};

const obtenerVentaMP = (idventa, callback) => {
  ventaDB.lista_venta_mp(idventa, (row) => {
    return callback(row);
  });
};

const obtenerVentaMPCtaCte = (idventa, callback) => {
  ventaDB.lista_venta_mp_cta_cte(idventa, (row) => {
    return callback(row);
  });
};

const lista_venta_sucursal_estado = (data, callback) => {
  ventaDB.lista_venta_sucursal_estado(data, (rows) => {
    return callback(rows);
  });
};

const editarVenta = (req, res) => {};

const lista_venta_item = (idventa, callback) => {
  ventaDB.lista_venta_item(idventa, (rows) => {
    return callback(rows);
  });
};

const cambiar_venta_sucursal_deposito = (en_laboratorio, idventa, callback) => {
  ventaDB.cambiar_venta_sucursal_deposito(en_laboratorio, idventa, (resp) => {
    return callback(resp);
  });
};

const obtener_datos_pagare = (data, callback) => {
  ventaDB.obtener_datos_pagare(data, (data) => {
    return callback(data);
  });
};

const obtener_lista_pagares = (data, callback) => {
  ventaDB.obtener_lista_pagares(data, (rows) => {
    return callback(rows);
  });
};

const obtener_categorias_productos_venta = (data, callback) => {
  ventaDB.obtener_categorias_productos_venta(data, (rows) => {
    return callback(rows);
  });
};

const cambiar_responsable = (data, callback) => {
  ventaDB.cambiar_responsable(data, (resp) => {
    callback(resp);
  });
};

const cambiar_destinatario = (data, callback) => {
  ventaDB.cambiar_destinatario(data, (resp) => {
    callback(resp);
  });
};

const obtener_ventas_subgrupo = (data, callback) => {
  ventaDB.obtener_ventas_subgrupo(data, (resp) => {
    callback(resp);
  });
};

const obtener_ventas_mes_vendedor = (data, callback) => {
  ventaDBExt.ventas_mes_vendedor(data, (resp) => {
    callback(resp);
  });
};

module.exports = {
  obtener_ventas_subgrupo,
  cambiar_destinatario,
  cambiar_responsable,
  lista_venta_item,
  obtenerVentas,
  obtenerVentasSucursal,
  agregarVenta,
  obtenerVenta,
  editarVenta,
  obtenerVentaMP,
  lista_venta_sucursal_estado,
  cambiar_estado_venta,
  obtenerVentaMPCtaCte,
  cambiar_venta_sucursal_deposito,
  desc_cantidades_stock_venta,
  inc_cantidades_stock_venta,
  obtener_datos_pagare,
  obtener_lista_pagares,
  obtener_categorias_productos_venta,
  totales_venta_vendedor,
  lista_ventas_vendedor_mes,
  lista_ventas_sucursal_mes,
  obtener_ventas_mes_vendedor,
};
