const queriesStockCristales = {
  restaurar_cantidades_venta: (
    data,
  ) => `UPDATE venta_has_stock vhs, stock_cristales sc SET sc.cantidad = sc.cantidad+1  WHERE 
  sc.fk_sucursal = ${data.id_sucursal_cristales} AND 
  vhs.venta_idventa = ${data.idventa} AND 
  vhs.stock_codigo_idcodigo = sc.fk_codigo AND 
  cast(sc.esf AS FLOAT) =CAST(vhs.esf AS FLOAT) AND  
  cast(sc.cil AS float)=CAST(vhs.cil AS FLOAT)  ;`,

  obtener_ventas_cristales: (
    data,
  ) => `SELECT ii.gkey,  SUM(ii.cantidad) AS 'cantidad' FROM(
	SELECT CONCAT( 'ESF',vhs.esf, 'CIL',vhs.cil) AS gkey, vhs.* FROM venta_has_stock vhs WHERE vhs.venta_idventa IN (
	SELECT v.idventa FROM venta v WHERE v.tipo IN (2,5,4) AND v.estado<>'ANULADO' AND date(v.fecha)<=DATE(NOW()) AND date(v.fecha)>=DATE_ADD(NOW(), INTERVAL -1 MONTH)
	)
	AND (vhs.tipo LIKE '%od' OR vhs.tipo LIKE '%oi')
	AND vhs.stock_codigo_idcodigo = 14147 
)ii GROUP BY ii.gkey;`,

  descontar_stock_cristales: ``,

  obtener_grilla: ``,

  sucursal_cristales: (data) =>
    `select s.fk_sucursal_cristales from sucursal s where s.idsucursal = ${data.fksucursal};`,
};

module.exports = { queriesStockCristales };
