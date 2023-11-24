const mysql_connection = require("../lib/mysql_connection")

const obtener_operaciones = (idsucursal, callback) => {
    const query = `
    SELECT 'VENTAS_MONTO' AS 'tipo', SUM(v.monto_total) AS 'monto' FROM venta v WHERE DATE(v.fecha)=DATE(NOW()) AND v.estado<>'ANULADO'
    union
    SELECT 'VENTAS_CANT' AS 'tipo', COUNT(v.idventa) AS 'monto' FROM venta v WHERE DATE(v.fecha)=DATE(NOW()) AND v.estado<>'ANULADO'
    union
    SELECT 'ANULADO' AS 'tipo', COUNT(v.idventa) AS 'monto' FROM venta v WHERE DATE(v.fecha)=DATE(NOW()) AND v.estado='ANULADO'
    union
    SELECT 'GASTO' AS 'tipo', sum(g.monto) AS 'monto' FROM gasto g WHERE DATE(g.fecha) = DATE(NOW())
    union
    SELECT 'EFVO' AS 'tipo', sum(c.monto) AS 'monto' FROM cobro c WHERE DATE(c.fecha) = DATE(NOW()) AND c.tipo = 'efvo'
    union
    SELECT 'CTACTE' AS 'tipo', sum(c.monto) AS 'monto' FROM cobro c WHERE DATE(c.fecha) = DATE(NOW()) AND c.tipo = 'ctacte'
    union
    SELECT 'TARJETA' AS 'tipo', sum(c.monto) AS 'monto' FROM cobro c WHERE DATE(c.fecha) = DATE(NOW()) AND c.tipo = 'tarjeta'
    union
    SELECT 'MUTUAL' AS 'tipo', sum(c.monto) AS 'monto' FROM cobro c WHERE DATE(c.fecha) = DATE(NOW()) AND c.tipo = 'mutual'
    ;`
}

module.exports = {obtener_operaciones}