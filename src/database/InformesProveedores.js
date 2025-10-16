const { doQuery } = require("./helpers/queriesHelper");

const saldo_proveedores_lista = (data, callback) => {
    const query = `SELECT * FROM (
                        SELECT 
                            prov.idproveedor,
                            prov.nombre,
                            prov.cuit,
                            if(opp.idproveedor IS NULL,0, round(opp.debe-opp.haber,2)) AS 'saldo'
                        FROM proveedor prov LEFT JOIN
                        (
                            SELECT 
                                ops.idproveedor,
                                sum(if( ops.t = 'd', ops.monto, 0 )) AS 'debe',
                                sum(if( ops.t = 'd', 0, ops.monto )) AS 'haber'
                                FROM (
                                    SELECT 'd' AS 't', sum(cmp.monto) AS 'monto', cmp.fk_proveedor AS 'idproveedor' FROM carga_manual_proveedor cmp WHERE cmp.activo=1 GROUP BY cmp.fk_proveedor
                                    union
                                    SELECT 'd' AS 't', SUM(f.monto) AS 'monto', f.proveedor_idproveedor AS 'idproveedor' FROM factura f WHERE f.activo=1 GROUP BY f.proveedor_idproveedor
                                    union
                                    SELECT 'h' AS 't',  SUM(pp.monto) AS 'monto', pp.fk_proveedor AS 'idproveedor' FROM pago_proveedor pp WHERE pp.activo=1 GROUP BY pp.fk_proveedor
                                ) ops 
                            GROUP BY ops.idproveedor
                        )
                        opp
                        ON opp.idproveedor = prov.idproveedor
                    ) _r1 ORDER BY _r1.saldo DESC;`;
    //console.log(query)
    doQuery(query,(response)=>{
        //console.log(JSON.stringify(response))
        callback(response.data)
    });
}

module.exports = {saldo_proveedores_lista}