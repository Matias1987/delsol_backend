const mysql_connection = require("../lib/mysql_connection")

const agregar_item_adicional = (data, callback) => {

    const list = []

    let items = '';
    
    data.items.forEach(i=>{
        items+=(items.length>0?',':'') + `(${data.fksucursal}, ${i.idcodigo}, ${data.fkventa}, 1, '${i.tipo}')`;
        
        list.push(`UPDATE stock s SET s.cantidad = s.cantidad -1 WHERE s.codigo_idcodigo=${i.idcodigo} AND s.sucursal_idsucursal=${data.fksucursal};`);
    })
    let query = `INSERT INTO sobre_adicionales (fk_sucursal, fk_codigo, fk_venta, cantidad, tipo) VALUES ${items};`

    const do_queries = () => {
        if(list.length<1)
        {
            try{
                connection.end()
            }
            catch(_e){}
            
            return
        }
        let _q = list.pop()
        console.log(_q)
        connection.query(_q,(err,resp)=>{do_queries()})
    }

    /**
     * 
     */
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,resp)=>{
        
        console.log(query)
        do_queries();

        callback(resp)

    })
    
}

const obtener_adicionales_venta = (data, callback) => {
    let query = `SELECT items.id, items.tipo, items.idcodigo, items.original , c.codigo
    FROM 
    codigo c,
    (
    SELECT vs.idventaitem as 'id', vs.stock_codigo_idcodigo AS 'idcodigo', 1 AS 'original', vs.tipo AS 'tipo'  FROM venta_has_stock vs WHERE vs.venta_idventa=${data}
    union
    SELECT sa.id as 'id', sa.fk_codigo AS 'idcodigo', 0 AS 'original', sa.tipo AS 'tipo' FROM sobre_adicionales sa WHERE sa.fk_venta=${data}
    ) AS items
    WHERE c.idcodigo = items.idcodigo
    ORDER BY items.tipo, items.original desc`
    //console.log(query)
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,resp)=>{
        callback(resp)
    })
    connection.end()
}

const obtener_uso_items_adic_subgrupo_periodo = (data, callback) => {
    const connection = mysql_connection.getConnection()
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
    //console.log(query)
    connection.connect()
    connection.query(query,(err,rows)=>{
        callback(rows)
    })
    connection.end()
}

module.exports = {agregar_item_adicional, obtener_adicionales_venta, obtener_uso_items_adic_subgrupo_periodo}