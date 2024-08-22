const mysql_connection = require("../lib/mysql_connection")

const agregar_optica = (data, callback) => {
    const connection = mysql_connection.getConnection()
    connection.connect();

    const sql = `INSERT INTO optica (nombre, fkusuario) VALUES ('${data.nombre}',${data.fkusuario});`

    connection.query(sql,(err,resp)=>{
        callback(resp)
    })

    connection.end();
}

const obtener_opticas = (callback) =>{
    const connection = mysql_connection.getConnection()
    connection.connect();

    const sql = `SELECT * FROM optica`

    connection.query(sql,(err,resp)=>{
        callback(resp)
    })

    connection.end();
}

const modificar_optica = (data, callback) => {
    const connection = mysql_connection.getConnection()
    connection.connect();

    const sql = `update optica o set o.nombre = '${data.nombre}' where o.idoptica=${data.idoptica} `

    connection.query(sql,(err,resp)=>{
        callback(resp)
    })

    connection.end();
}

const obtener_optica = (idoptica,callback) => {
    const connection = mysql_connection.getConnection()
    connection.connect();

    const sql = `select * from optica o where o.idoptica=${idoptica} `

    connection.query(sql,(err,resp)=>{
        callback(resp)
    })

    connection.end();
}

const obtener_saldo_cliente_optica = ( data, callback ) => {
    const query = `SELECT 
                    SUM(if(op.tipo='D',op.monto,0)) AS 'debe',
                    SUM(if(op.tipo='H',op.monto,0)) AS 'haber'
                    FROM 
                    (
                        SELECT sum(vmp.monto_int) AS 'monto', 'D' AS 'tipo' FROM venta_has_modo_pago vmp INNER JOIN 
                        (
                            SELECT 
                            v.idventa
                            FROM venta v 
                            WHERE v.estado='ENTREGADO' AND v.cliente_idcliente=${data.idcliente} AND v.sucursal_idsucursal IN (SELECT s.idsucursal FROM sucursal s WHERE s.fkoptica=${data.idoptica})
                        ) _v
                        ON _v.idventa=vmp.venta_idventa
                        
                        union

                        SELECT SUM(c.monto) AS 'monto', 'H' AS 'tipo' FROM cobro c WHERE c.anulado=0 and c.tipo='cuota' AND c.cliente_idcliente=${data.idcliente} AND c.sucursal_idsucursal IN (SELECT s.idsucursal FROM sucursal s WHERE s.fkoptica=${data.idoptica})
                        
                        union
                        
                        SELECT SUM(cm.monto) AS 'monto', 'D' AS 'tipo' FROM carga_manual cm WHERE cm.anulado=0 and  cm.cliente_idcliente=${data.idcliente} AND cm.sucursal_idsucursal IN (SELECT s.idsucursal FROM sucursal s WHERE s.fkoptica=${data.idoptica})
                    ) as op`;
                     
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(query,(err,resp)=>{
        console.log(JSON.stringify(resp))
        callback(resp)
    })
    connection.end();
}

module.exports = {
    agregar_optica,
    obtener_opticas,
    modificar_optica,
    obtener_saldo_cliente_optica,
    obtener_optica,
}