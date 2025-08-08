const mysql_connection = require("../lib/mysql_connection");
const { obtenerCajaAbierta } = require("./queries/cajaQueries");
const UsuarioDB = require("./Usuario") 
const CajaDB = require("./Caja")
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
    g.concepto_gasto_idconcepto_gasto = cg.idconcepto_gasto AND
    g.anulado=0;`;

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
    g.*, date_format(g.fecha_alta,'%d-%m-%y') as 'fecha_f', cg.nombre AS 'concepto_gasto'
    FROM gasto g, concepto_gasto cg WHERE g.concepto_gasto_idconcepto_gasto = cg.idconcepto_gasto 
    and g.sucursal_idsucursal = ${idsucursal} AND
    g.anulado=0
    ORDER BY g.idgasto DESC;
    `,(err,rows)=>{
        return callback(rows)
    });
    connection.end();
}
const obtener_gastos_caja = (idcaja, callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
   /* console.log(`SELECT 
    g.*, date_format(g.fecha,'%d-%m-%y') as 'fecha_f', cg.nombre AS 'concepto_gasto'
    FROM gasto g, concepto_gasto cg WHERE g.concepto_gasto_idconcepto_gasto = cg.idconcepto_gasto 
    and g.caja_idcaja = ${idcaja} AND
    g.anulado=0
    ORDER BY g.idgasto DESC;
    `)*/
    connection.query(`SELECT 
    g.*, date_format(g.fecha,'%d-%m-%y') as 'fecha_f', cg.nombre AS 'concepto_gasto'
    FROM gasto g, concepto_gasto cg WHERE g.concepto_gasto_idconcepto_gasto = cg.idconcepto_gasto 
    and g.caja_idcaja = ${idcaja} AND
    g.anulado=0 
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

const do_agregar_gasto = (data, callback, idcaja) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    
    connection.query(obtenerCajaAbierta(data.sucursal_idsucursal),(err,_rows)=>{
        if(_rows.length<1)
        {
            console.log("No hay caja!!!!!")
            callback(null)
            connection.end()
            return
        }
        else{

            var sql = `insert into gasto (
                caja_idcaja, 
                usuario_idusuario,
                concepto_gasto_idconcepto_gasto,
                monto,
                sucursal_idsucursal,
                comentarios
                ) values (
                ${connection.escape(idcaja)},
                ${connection.escape(data.usuario_idusuario)},
                ${connection.escape(data.idmotivo)},
                ${connection.escape(data.monto)},
                ${connection.escape(data.sucursal_idsucursal)},
                ${connection.escape(data.comentarios)}
            )`;

            
            connection.query(sql, (err,result) => {
                    return callback(result.insertId)
                });
            connection.end();
        }
    });

}

const agregar_gasto = (data,callback) => {

    CajaDB.obtener_caja_gasto({idsucursal:data.sucursal_idsucursal},(idcaja)=>{
        do_agregar_gasto(data, callback, idcaja)
    })
    //UsuarioDB.validar_usuario_be({tk:data.tk},()=>{do_agregar_gasto(data,callback)}, ()=>{})  

}

module.exports = {
    obtener_gasto,
    agregar_gasto,
    obtener_gastos_sucursal,
    obtener_gastos_caja,
    lista_gastos_admin,
}