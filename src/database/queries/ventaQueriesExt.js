const ventaQueriesExt = {
  updateStockVent: (data) => `update stock s,
    (
            SELECT 
                vhs.stock_codigo_idcodigo AS 'idcodigo', 
                sum(vhs.cantidad) AS 'cantidad' 
            FROM venta_has_stock vhs 
                  WHERE vhs.venta_idventa= ${data.idventa} 
                  AND vhs.descontable=1
                  GROUP BY vhs.stock_codigo_idcodigo
    ) AS vs
    SET s.cantidad = s.cantidad - vs.cantidad
    where
    vs.idcodigo = s.codigo_idcodigo AND 
    s.sucursal_idsucursal=${data.idsucursal}
    ;`,

  updateStockCristales: (data, idsucursal) => `UPDATE stock_cristales sc SET 
      sc.cantidad=sc.cantidad-${data.cantidad} 
      WHERE 
      sc.fk_sucursal=${idsucursal} AND 
      sc.fk_codigo=${data.idcodigo} AND 
      sc.esf='${parseFloat(data.esf) == 0 ? "0.00" : data.esf}' AND 
      sc.cil='${parseFloat(data.cil) == 0 ? "-0.00" : data.cil}' AND 
      sc.side='${data.side || "-"}';`,
};

module.exports = { ventaQueriesExt };
