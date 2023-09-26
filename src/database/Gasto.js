const mysql_connection = require("../lib/mysql_connection")

const lista_gastos_admin = (callback) => {
    const query = `SELECT 
    cg.nombre AS 'concepto',
    s.nombre AS 'sucursal',
    g.monto
    FROM
    sucursal s,
    concepto_gasto cg,
    gasto g 
    WHERE
    g.sucursal_idsucursal = s.idsucursal AND 
    g.concepto_gasto_idconcepto_gasto = cg.idconcepto_gasto;`;

    const connection = mysql_connection.getConnection()

    connection.connect()

    connection.query(query,(err,rows)=>{
        callback(rows)
    })

    connection.end()

}

const obtener_gastos_sucursal = (idsucursal, callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    
    connection.query(`SELECT 
    g.*, date_format(g.fecha,'%d-%m-%y') as 'fecha_f', cg.nombre AS 'concepto_gasto'
    FROM gasto g, concepto_gasto cg WHERE g.concepto_gasto_idconcepto_gasto = cg.idconcepto_gasto 
    and g.sucursal_idsucursal = ${idsucursal}
    ORDER BY g.idgasto DESC;
    `,(err,rows)=>{
        return callback(rows)
    });
    connection.end();
}
const obtener_gastos_caja = (idcaja, callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    console.log(`SELECT 
    g.*, date_format(g.fecha,'%d-%m-%y') as 'fecha_f', cg.nombre AS 'concepto_gasto'
    FROM gasto g, concepto_gasto cg WHERE g.concepto_gasto_idconcepto_gasto = cg.idconcepto_gasto 
    and g.caja_idcaja = ${idcaja}
    ORDER BY g.idgasto DESC;
    `)
    connection.query(`SELECT 
    g.*, date_format(g.fecha,'%d-%m-%y') as 'fecha_f', cg.nombre AS 'concepto_gasto'
    FROM gasto g, concepto_gasto cg WHERE g.concepto_gasto_idconcepto_gasto = cg.idconcepto_gasto 
    and g.caja_idcaja = ${idcaja}
    ORDER BY g.idgasto DESC;
    `,(err,rows)=>{
        return callback(rows)
    });
    connection.end();
}

const obtener_gasto = (callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query("select * from gasto",(err,rows,fields)=>{
        return callback(rows);
    })
    connection.end();
}

const agregar_gasto = (data,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    var sql = `insert into gasto (
        caja_idcaja, 
        usuario_idusuario,
        concepto_gasto_idconcepto_gasto,
        monto,
        sucursal_idsucursal,
        comentarios
        ) values (
        ${data.caja_idcaja},
        ${data.usuario_idusuario},
        ${data.idmotivo},
        ${data.monto},
        ${data.sucursal_idsucursal},
        '${data.comentarios}'
    )`;

    console.log(sql)

    connection.query(sql, (err,result) => {
            return callback(result.insertId)
        });
    connection.end();
}

module.exports = {
    obtener_gasto,
    agregar_gasto,
    obtener_gastos_sucursal,
    obtener_gastos_caja,
    lista_gastos_admin,
}