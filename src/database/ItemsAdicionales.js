const { doQuery } = require("./helpers/queriesHelper");

const agregar_item_adicional = (data, callback) => {
    console.log(data);
    const idtrabajo = +data.fktrabajo > 0? data.fktrabajo : 'NULL';

    const list = []

    let items = '';
    
    data.items.forEach(i=>{
        

        items+=(items.length>0?',':'') + `(${data.fksucursal}, ${i.idcodigo}, ${data.fkventa}, 1, '${i.tipo}', ${idtrabajo})`;
        
        list.push(`UPDATE stock s SET s.cantidad = s.cantidad -1 WHERE s.codigo_idcodigo=${i.idcodigo} AND s.sucursal_idsucursal=${data.fksucursal};`);
    })
    let query = `INSERT INTO sobre_adicionales (fk_sucursal, fk_codigo, fk_venta, cantidad, tipo, fk_trabajo) VALUES ${items};`

    const do_queries = (_callback) => {
        if(list.length<1)
        {        
            _callback();    
            return
        }
        let _q = list.pop()
        console.log(_q)
        doQuery(_q,(resp)=>{do_queries(_callback)})
    }
    console.log(query)
    doQuery(query,(resp)=>{
        do_queries(_=>{callback(resp.data)});
    });
    
}

const obtener_adicionales_venta = ({idventa, idtrabajo}, callback) => {
    
    let query = `
    SELECT 
    items.id, 
    items.tipo, 
    items.idcodigo, 
    items.original , 
    if(sg.idsubgrupo is null, c.codigo, concat('Diseño: ' ,sg.nombre_corto, '  |  Base: ', c.codigo)) as 'codigo', 
    if(sg.idsubgrupo is null, '', sg.nombre_corto) as trabajo_realizado, 
    sg.idsubgrupo 
    FROM 
    codigo c,
    (
        SELECT 
        vs.idventaitem as 'id', 
        vs.stock_codigo_idcodigo AS 'idcodigo', 
        1 AS 'original', 
        vs.tipo AS 'tipo' ,
        vs.id_trabajo as 'idtrabajo',
        vs.id_trabajo_realizado
        FROM venta_has_stock vs 
        WHERE 
        vs.venta_idventa=${idventa} AND (case when '${idtrabajo}'='-1' then true else vs.id_trabajo=${idtrabajo} end)
    union
    SELECT 
        sa.id as 'id', 
        sa.fk_codigo AS 'idcodigo', 
        0 AS 'original', 
        sa.tipo AS 'tipo',
        sa.fk_trabajo  as 'idtrabajo',
        -1 as 'id_trabajo_realizado'
        FROM sobre_adicionales sa 
        WHERE 
        sa.fk_venta=${idventa} and (case when '${idtrabajo}'='-1' then true else sa.fk_trabajo=${idtrabajo} end)
    ) AS items LEFT JOIN subgrupo sg on sg.idsubgrupo = items.id_trabajo_realizado
    WHERE c.idcodigo = items.idcodigo
    ORDER BY items.tipo, items.original desc`
    console.log(query)

    doQuery(query,(resp)=>{
        callback(resp.data);
    })
}

const obtener_uso_items_adic_subgrupo_periodo = (data, callback) => {
    const query = `
    SELECT * FROM 
    (
        SELECT 
        ${data.idsubgrupo} as 'subgrupo_idsubgrupo',
        c.idcodigo,
        c.codigo ,   
        0 as 'stock_ideal',
        CAST(REPLACE(  REGEXP_SUBSTR(c.codigo, 'ESF[\+\-\.0-9]+'), 'ESF', '') AS DECIMAL(10,2)) AS 'esf_dec' ,
        CAST(REPLACE(  REGEXP_SUBSTR(c.codigo, 'CIL[\+\-\.0-9]+'), 'CIL', '') AS DECIMAL(10,2)) AS 'cil_dec' ,
        CAST(REPLACE(  REGEXP_SUBSTR(c.codigo, 'EJE[\+\-\.0-9]+'), 'EJE', '') AS DECIMAL(10,2)) AS 'eje_dec' ,
        REPLACE(  REGEXP_SUBSTR(c.codigo, 'ESF[\+\-\.0-9]+'), 'ESF', '')  AS 'esf',  
        REPLACE(  REGEXP_SUBSTR(c.codigo, 'CIL[\+\-\.0-9]+'), 'CIL', '')  AS 'cil',
        REPLACE(  REGEXP_SUBSTR(c.codigo, 'EJE[\+\-\.0-9]+'), 'EJE', '')  AS 'eje',  
        if( cant.stock_codigo_idcodigo IS NULL , 0 , cant.cant  ) AS 'cantidad'
        FROM 
            (
                SELECT _c.codigo, _c.idcodigo FROM codigo _c WHERE _c.subgrupo_idsubgrupo = ${data.idsubgrupo}
            ) c
        LEFT JOIN 
            (
                SELECT 
                    COUNT(sa.id) AS 'cant',
                    sa.fk_codigo AS 'stock_codigo_idcodigo'
                    FROM 
                    venta v, sobre_adicionales sa
                    WHERE 
                        sa.fk_venta=v.idventa AND 
                        DATE(v.fecha)>=DATE('${data.desde}') AND
                        DATE(v.fecha)<=DATE('${data.hasta}') 
                    GROUP BY sa.fk_codigo
            ) cant
            on c.idcodigo = cant.stock_codigo_idcodigo
            WHERE 
            (case when '${data.eje}'<>'-1' then '${data.eje}' = REPLACE(  REGEXP_SUBSTR(c.codigo, 'EJE[\+\-\.0-9]+'), 'EJE', '') else true end)
        ) AS __c
    ORDER BY
    __c.esf, __c.cil, __c.eje
    ;
    `;

    doQuery(query,(resp)=>{
        callback(resp.data)
    });

}


module.exports = {agregar_item_adicional, obtener_adicionales_venta, obtener_uso_items_adic_subgrupo_periodo}