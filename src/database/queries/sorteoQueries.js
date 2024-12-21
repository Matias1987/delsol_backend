const sorteoQueries = {
    query_get_tickets: () =>`SELECT 
cl.idcliente,
CONCAT(cl.apellido, ' ', cl.nombre) AS 'cliente' 
from sorteo.ticket tk, optica_online_final.cliente cl WHERE cl.idcliente = tk.participante_idparticipante AND tk.sorteo_idsorteo=1
                    ;`
}

module.exports = sorteoQueries

/*
SELECT 
                    CONCAT(cl.apellido,' ', cl.nombre) AS 'cliente',
                    cl.dni,
                    cl.telefono1 AS 'telefono',
                    v.cliente_idcliente, 
                    v.idventa 
                    FROM 
                    venta v INNER JOIN 
                    (
                        SELECT DISTINCT  vhs.venta_idventa FROM 
                        optica_online_final.subfamilia sf, 
                        optica_online_final.grupo g, 
                        optica_online_final.subgrupo sg,
                        optica_online_final.codigo c,
                        optica_online_final.venta_has_stock vhs
                        WHERE
                        c.subgrupo_idsubgrupo = sg.idsubgrupo AND 
                        sg.grupo_idgrupo=g.idgrupo AND 
                        g.subfamilia_idsubfamilia = sf.idsubfamilia AND 
                        vhs.stock_codigo_idcodigo = c.idcodigo AND 
                        sf.familia_idfamilia <> 17	
                    ) vf ON vf.venta_idventa = v.idventa,
                    optica_online_final.cliente cl
                    WHERE 
                    cl.idcliente=v.cliente_idcliente AND 
                    MONTH(v.fecha) = 12 AND 
                    YEAR(v.fecha)=2024 AND  
                    v.estado = 'ENTREGADO' AND 
                    v.cliente_idcliente<>1 AND 
                    v.sucursal_idsucursal<>10 AND
                    v.sucursal_idsucursal<>15 
                    ORDER BY 
                    v.cliente_idcliente DESC, 
                    v.idventa DESC*/