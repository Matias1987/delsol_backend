const listaTotalCobrosCuotaMes = (data, callback) => {};
const listaTotalGastosMes = (data, callback) => {};

const montoIngresoCategoria = ({ idsucursal }, callback) => {
  const query = `SELECT cmp.modo_pago, SUM(cmp.monto) AS amnt  FROM cobro_has_modo_pago cmp 
WHERE 
cmp.cobro_idcobro IN (SELECT c.idcobro FROM cobro c WHERE c.sucursal_idsucursal = ${idsucursal} AND c.anulado=0)
GROUP BY cmp.modo_pago
;`;
};
const montoEgresoCategoria = ({ idsucursal, periodoMes }, callback) => {
  const query = `SELECT g.concepto_gasto_idconcepto_gasto, sum(g.idgasto) AS amnt 
FROM gasto g 
WHERE 
g.sucursal_idsucursal=${idsucursal} AND 
DATE(g.fecha) >= DATE_ADD(DATE(NOW()), INTERVAL -${periodoMes ?? "1"} MONTH) 
GROUP BY g.concepto_gasto_idconcepto_gasto
;`;
};

module.exports = {
  listaTotalCobrosCuotaMes,
  listaTotalGastosMes,
  montoIngresoCategoria,
  montoEgresoCategoria,
};
