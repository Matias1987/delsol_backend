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
  doQuery(query, (response) => {
    callback(response.data);
  });
};

const informe_ventas_medicos = (data, callback) => {
  const query = `SELECT 
                    m.idmedico, 
                    m.nombre AS 'medico', 
                    v1.sucursal, 
                    v1.idventa, 
                    v1.cliente, 
                    v1.cliente_idcliente, 
                    v1.fecha_retiro, 
                    date_format(v1.fecha_retiro,'%d-%m-%y') as 'fecha_f',
                    REPLACE( TRUNCATE( cast(v1.monto_total AS FLOAT) ,2) , ',','') AS 'monto'
                    
                FROM medico m INNER JOIN  
                    (
                        SELECT 
                        CONCAT(c.apellido,' ',c.nombre) AS 'cliente', 
                        v.idventa, 
                        v.medico_idmedico, 
                        v.monto_total, 
                        v.fecha_retiro, 
                        v.cliente_idcliente, 
                        v.sucursal_idsucursal, 
                        s.nombre AS 'sucursal' 
                        FROM 
                            venta v 
                                INNER JOIN sucursal s ON s.idsucursal = v.sucursal_idsucursal 
                                INNER JOIN cliente c ON c.idcliente = v.cliente_idcliente 
                            WHERE v.estado = 'ENTREGADO' AND 
                            YEAR(v.fecha_retiro) = ${data.anio} AND 
                            MONTH(v.fecha_retiro) = ${data.mes}
                    ) v1
                ON v1.medico_idmedico = m.idmedico
                WHERE m.idmedico<>1
                ORDER BY m.idmedico DESC , v1.sucursal_idsucursal asc;`;
  doQuery(query, (response) => {
    callback(response.data);
  });
};

module.exports = { informe_venta_montos_mes, informe_ventas_medicos };
