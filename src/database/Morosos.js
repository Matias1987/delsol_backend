const query_pagos_atrasados_optica = `SELECT 
cl.idcliente,
cl.dni,
CONCAT(cl.apellido,' ', cl.nombre) AS 'cliente',
st1.s AS 'saldo',
date_format(st2.fecha, '%d-%m-%Y') AS 'ultimo_pago'
FROM 
cliente cl,
(
SELECT 
	q1.cliente_idcliente, q1.s
 FROM 
 	(
		SELECT 
		sum(if(o.t='c',-o.m,o.m)) AS 's',
		o.cliente_idcliente
		FROM (
			SELECT 'v' AS 't', v.cliente_idcliente, SUM(v.monto) AS 'm' 
			FROM 
				(SELECT v0.cliente_idcliente, vmp.cant_cuotas * vmp.monto_cuota AS 'monto' FROM venta_has_modo_pago vmp INNER JOIN venta v0 ON vmp.venta_idventa=v0.idventa AND v0.estado='ENTREGADO' AND v0.sucursal_idsucursal=6 WHERE vmp.modo_pago='ctacte') v 
			GROUP BY v.cliente_idcliente
			UNION SELECT 'c' AS 't', c.cliente_idcliente, SUM(c.monto) AS 'm' FROM cobro c WHERE c.sucursal_idsucursal=6 AND  c.tipo='cuota' and c.anulado=0 GROUP BY c.cliente_idcliente
			UNION SELECT 'cm' AS 't', cm.cliente_idcliente, SUM(cm.monto) AS 'm' FROM carga_manual cm WHERE cm.sucursal_idsucursal=6 AND cm.anulado=0 GROUP BY cm.cliente_idcliente
			) o GROUP BY o.cliente_idcliente
	) q1 WHERE q1.s>0
) st1,	
(	
SELECT c.cliente_idcliente, c.fecha FROM cobro c 
	WHERE 
		c.sucursal_idsucursal=6 AND 
		DATE(c.fecha) < DATE_ADD(DATE(NOW()), INTERVAL -2 MONTH) AND 
		c.tipo='cuota' AND 
		c.anulado=0 AND 
		c.idcobro IN (SELECT MAX(c0.idcobro) FROM cobro c0 GROUP BY c0.cliente_idcliente)
) st2
WHERE
st1.cliente_idcliente = cl.idcliente AND 
st2.cliente_idcliente = cl.idcliente
ORDER BY st1.s desc;`