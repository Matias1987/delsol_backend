const { parse_date_for_mysql } = require("../../lib/helpers");
const { escapeHelper } = require("../helpers/queriesHelper");

const proveedorQueries = {
  insertPagoProveedor: (
    data,
    saldado,
  ) => `INSERT INTO pago_proveedor (monto, fk_proveedor, modo_ficha, fecha, moneda, saldado) VALUES (
  ${escapeHelper(data.monto)}, 
  ${escapeHelper(data.fk_proveedor)}, 
  ${escapeHelper(data.modo)}, 
  '${parse_date_for_mysql(data.fecha)}', 
  ${escapeHelper(data.moneda)},
  ${escapeHelper(saldado)}
  )`,

  insertPagoProveedorModo: (modo, idPago, monto, fkcta_bancaria) => `
    INSERT INTO pago_proveedor_modo (modo_pago, fk_pago_proveedor, monto, fk_cuenta_bancaria) 
    VALUES (${escapeHelper(modo)}, ${idPago}, ${escapeHelper(monto)}, ${escapeHelper(fkcta_bancaria)});`,
};

module.exports = { proveedorQueries };
