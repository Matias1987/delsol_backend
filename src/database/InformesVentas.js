const { doQuery } = require("./helpers/queriesHelper");


const informe_venta_montos_mes = (data, callback) => {
    const query = `SELECT s.nombre AS 'sucursal', mnt.* FROM 
                    (
                        SELECT 
                        c.sucursal_idsucursal,
                        SUM( IF(cmp.modo_pago='efectivo', cmp.monto,0)) AS 'efectivo',
                        SUM( IF(cmp.modo_pago='tarjeta', cmp.monto,0)) AS 'tarjeta',
                        SUM( IF(cmp.modo_pago='ctacte', cmp.monto,0)) AS 'ctacte',
                        SUM( IF(cmp.modo_pago='mercadopago', cmp.monto,0)) AS 'mercadopago',
                        SUM( IF(cmp.modo_pago='transferencia', cmp.monto,0)) AS 'transferencia',
                        SUM( IF(cmp.modo_pago='mutual', cmp.monto,0)) AS 'mutual',
                        SUM( IF(cmp.modo_pago='cheque', cmp.monto,0)) AS 'cheque'
                        FROM 
                        cobro_has_modo_pago cmp, 
                        (SELECT c0.* FROM cobro c0 INNER JOIN venta v ON v.estado <> 'ANULADO' AND v.idventa = c0.venta_idventa AND MONTH(v.fecha) = ${data.mes} AND YEAR(v.fecha) = ${data.anio} AND c0.anulado=0) c 
                        WHERE  
                        c.idcobro = cmp.cobro_idcobro  
                        GROUP BY c.sucursal_idsucursal
                    ) mnt, 
                    sucursal s 
                    WHERE mnt.sucursal_idsucursal = s.idsucursal
                    ;

                    `;
doQuery(query,(response)=>{
    callback(response.data)
})
}


module.exports = {informe_venta_montos_mes}