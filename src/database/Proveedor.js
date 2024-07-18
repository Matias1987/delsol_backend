const mysql_connection = require("../lib/mysql_connection")

const agregar_proveedor = (data,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect()
    connection.query(`SELECT p.idproveedor FROM proveedor p WHERE p.cuit = '${data.cuit}'`, (err,resp)=>{
        if(resp.length>0){
            callback(-1)
        }
        else{
            connection.query("INSERT INTO `proveedor` (`cuit`, `nombre`) VALUES ('"+data.cuit+"', '"+data.nombre+"');",(err,result,fields)=>{
                callback(result.insertId)
            })
        }
        connection.end();
    })
    
    
}

const obtener_proveedores = (callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query("SELECT * FROM proveedor p;",(err,rows,fields)=>{
        callback(rows)
    })
    connection.end();
}

const obtener_ficha_proveedor = (data, callback) => {
    const query = `SELECT 
                    op.*,
                    if(op.tipo='FACTURA' || op.tipo='CM', op.monto, 0) AS 'debe',
                    if(op.tipo='PAGO',op.monto,0) AS 'haber' 
                    FROM (
                        SELECT 
                        'FACTURA' AS 'tipo', 
                        f.idfactura AS 'id', 
                        f.monto, 
                        date_format(f.fecha , '%d-%m-%y') AS 'fecha_f'
                        FROM factura f WHERE f.proveedor_idproveedor=${data.idproveedor} and f.activo=1 and f.es_remito=${data.modo==0 ? 1 : 0}
                        UNION
                        (
                            SELECT 'PAGO' AS 'tipo', 
                            pp.id AS 'id',  
                            pp.monto, 
                            date_format(pp.fecha , '%d-%m-%y') AS 'fecha_f'
                            FROM pago_proveedor pp WHERE pp.fk_proveedor=${data.idproveedor} and pp.activo=1 and pp.modo_ficha=${data.modo}
                        )
                        UNION
                        (
                            SELECT 
                            'CM' AS 'tipo', 
                            cm.id AS 'id',  
                            cm.monto, 
                            date_format(cm.fecha , '%d-%m-%y') AS 'fecha_f'
                            FROM  carga_manual_proveedor cm WHERE cm.fk_proveedor=${data.idproveedor} and cm.activo=1 and cm.modo_ficha=${data.modo}
                        )
                    ) op
                    ORDER BY op. op.fecha_f ASC 
                    ;`;
    

    const connection = mysql_connection.getConnection()

    connection.connect()

    connection.query(query,(err,rows)=>{
        callback(rows)
    })

    connection.end()
    
}

const detalle_proveedor = (data, callback) => {
    const query = `select * from proveedor p where p.idproveedor= ${data} `
    //console.log(query)
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,rows)=>{
        callback(rows)
    })
    connection.end()
}

const agregar_pago_proveedor = (data, callback) =>{
    const connection = mysql_connection.getConnection()
    connection.connect()
    const query = `INSERT INTO pago_proveedor (monto, fk_proveedor, modo_ficha) VALUES (${data.monto}, ${data.fk_proveedor}, ${data.modo})`
    console.log(query)
    connection.query(query, (err,resp)=>{
        callback(resp)
    })    
    connection.end()
}

const agregar_cm_proveedor = (data, callback) => {
    const connection = mysql_connection.getConnection()
    connection.connect()
    const query = `INSERT INTO carga_manual_proveedor  (fk_proveedor, monto, comentarios, modo_ficha) VALUES (${data.fk_proveedor}, ${data.monto}, '${data.comentarios}', ${data.modo})`
    console.log(query)
    connection.query(query, (err,resp)=>{
        callback(resp)
    })    
    connection.end()
}
module.exports = {
    agregar_proveedor,obtener_proveedores, obtener_ficha_proveedor,detalle_proveedor, agregar_pago_proveedor, agregar_cm_proveedor
}