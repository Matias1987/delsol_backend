const totales_mes_anios = (data, callback) => {
    const query = `SELECT
	vs.mes,
	SUM(vs.monto) AS 'monto',
	COUNT(*) AS 'cant'
	from
	 (
		SELECT 
			v.idventa, 
			DATE_FORMAT(v.fecha_retiro, '%y-%m') AS 'mes', 
			format(v.monto_total,2) AS 'monto' 
		FROM 
			venta v 
		WHERE 
			v.estado='ENTREGADO' AND 
			date(v.fecha_retiro) >= DATE_ADD(DATE(NOW()) , INTERVAL -2 YEAR) 
		ORDER BY DATE_FORMAT(v.fecha_retiro, '%y-%m')
	) vs GROUP BY vs.mes  ORDER BY vs.mes
`
}

module.exports = {totales_mes_anios}