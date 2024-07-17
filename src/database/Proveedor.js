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
                        FROM factura f WHERE f.proveedor_idproveedor=${data.idproveedor}
                        UNION
                        (
                            SELECT 'PAGO' AS 'tipo', 
                            pp.id AS 'id',  
                            pp.monto, 
                            date_format(pp.fecha , '%d-%m-%y') AS 'fecha_f'
                            FROM pago_proveedor pp WHERE pp.fk_proveedor=${data.idproveedor}
                        )
                        UNION
                        (
                            SELECT 
                            'CM' AS 'tipo', 
                            cm.id AS 'id',  
                            cm.monto, 
                            date_format(cm.fecha , '%d-%m-%y') AS 'fecha_f'
                            FROM  carga_manual_proveedor cm WHERE cm.fk_proveedor=${data.idproveedor}
                        )
                    ) op
                    ORDER BY op.fecha_f ASC 
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
    console.log(query)
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,rows)=>{
        callback(rows)
    })
    connection.end()
}

module.exports = {
    agregar_proveedor,obtener_proveedores, obtener_ficha_proveedor,detalle_proveedor
}