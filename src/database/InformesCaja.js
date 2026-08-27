const { doQuery } = require("./helpers/queriesHelper");

const listaTotalCobrosCuotaMes = (data, callback) => {};
const listaTotalGastosMes = (data, callback) => {};

const montoIngresoCategoria = ({ idsucursal }, callback) => {
  const query = `SELECT cmp.modo_pago as tipo, SUM(cmp.monto) AS amnt  FROM cobro_has_modo_pago cmp 
            WHERE 
            cmp.cobro_idcobro IN (
            SELECT c.idcobro FROM cobro c 
            WHERE 
            c.sucursal_idsucursal = ${idsucursal} AND c.anulado=0  AND year(c.fecha) = year(now()) AND month(c.fecha) = month(now())
            )
            GROUP BY cmp.modo_pago
            ;`;

  doQuery(query, (response) => {
    callback(response.data);
  });
};
const montoEgresoCategoria = ({ idsucursal, periodoMes }, callback) => {
  const query = `SELECT g.concepto_gasto_idconcepto_gasto as tipo, cg.nombre, sum(g.idgasto) AS amnt 
            FROM gasto g INNER JOIN concepto_gasto cg ON g.concepto_gasto_idconcepto_gasto = cg.idconcepto_gasto
            WHERE 
            g.anulado=0 AND 
            g.sucursal_idsucursal=${idsucursal} AND 
            year(g.fecha_alta) = year(now()) AND 
            month(g.fecha_alta) = month(now())
            GROUP BY g.concepto_gasto_idconcepto_gasto
            ;`;
  
  doQuery(query, (response) => {
    callback(response.data);
  });
};
/*
const operacionesEgresoIngresoSucursal = ({ idsucursal }, callback) => {
  const query = `
    -- 1. THE PRIOR BALANCE ROW (Everything older than 30 days)
    select * from (
    SELECT 
        IF(SUM(CASE WHEN oo.tipo = 'i' THEN oo.monto ELSE -oo.monto END) >= 0, 'i', 'e') AS tipo,
        ABS(SUM(CASE WHEN oo.tipo = 'i' THEN oo.monto ELSE -oo.monto END)) AS monto,
        0 AS id,
        'Saldo Anterior' AS f_fecha,
        '1970-01-01' as fecha
    FROM (
        SELECT 'i' AS tipo, cast(c.monto as float) as monto, c.fecha FROM cobro c WHERE c.anulado = 0 AND c.sucursal_idsucursal = ${idsucursal}
        UNION ALL
        SELECT 'e' AS tipo, cast(g.monto as float) as monto, g.fecha_alta as fecha FROM gasto g WHERE g.anulado = 0 AND g.sucursal_idsucursal = ${idsucursal}
    ) oo
    WHERE oo.fecha < CURRENT_DATE() - INTERVAL 30 DAY
    HAVING monto IS NOT NULL

    UNION ALL

    -- 2. THE CURRENT OPERATIONS ROWS (The last 30 days)
    SELECT 
        oo.tipo,
        oo.monto,
        oo.id,
        DATE_FORMAT(oo.fecha, '%d-%m-%y') AS f_fecha,
        oo.fecha
    FROM (
        SELECT 'i' AS tipo, cast(c.monto as float) as monto, c.fecha, c.idcobro AS id FROM cobro c WHERE c.anulado = 0 AND c.sucursal_idsucursal = ${idsucursal}
        UNION ALL
        SELECT 'e' AS tipo, cast(g.monto as float) as monto, g.fecha_alta as fecha, g.idgasto AS id FROM gasto g WHERE g.anulado = 0 AND g.sucursal_idsucursal = ${idsucursal}
    ) oo
    WHERE oo.fecha >= CURRENT_DATE() - INTERVAL 30 DAY
) as q order by q.fecha asc
`;

  //console.log(query);

  doQuery(query, (response) => {
    callback(response.data);
  });
};*/
const operacionesEgresoIngresoSucursal = ({ idcaja }, callback) => {
  const query = `
    SELECT 
        oo.tipo,
        oo.monto,
        oo.id,
        DATE_FORMAT(oo.fecha, '%d-%m-%y') AS f_fecha,
        oo.fecha
    FROM (
        SELECT 'i' AS tipo, cast(c.monto as float) as monto, c.fecha, c.idcobro AS id FROM cobro c WHERE c.anulado = 0 AND c.caja_idcaja = ${idcaja}
        UNION ALL
        SELECT 'e' AS tipo, cast(g.monto as float) as monto, g.fecha_alta as fecha, g.idgasto AS id FROM gasto g WHERE g.anulado = 0 AND g.caja_idcaja = ${idcaja}
    ) as oo order by oo.fecha asc
`;

  console.log(query);

  doQuery(query, (response) => {
    callback(response.data);
  });
};

module.exports = {
  listaTotalCobrosCuotaMes,
  listaTotalGastosMes,
  montoIngresoCategoria,
  montoEgresoCategoria,
  operacionesEgresoIngresoSucursal,
};
