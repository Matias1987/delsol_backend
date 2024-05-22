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

module.exports = {agregar_item_adicional, obtener_adicionales_venta}