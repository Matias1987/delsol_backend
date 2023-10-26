const mysql_connection = require("../lib/mysql_connection")

const agregar_transferencia = (data,callback) => {
    const query = `INSERT INTO transferencia (fk_destino, fk_origen, fk_caja, monto, comentarios) 
                    VALUES (${data.fkdestino}, ${data.fkorigen}, ${data.fkcaja}, ${data.monto}, '${data.comentarios}');`
    console.log(query)
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(query,(err,rows,fields)=>{
        callback(rows);
    })
    connection.end();
}

const obtener_transferencias_enviadas = (data, callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(`
    SELECT t.*, s.nombre AS 'sucursal_destino' , date_format(t.fecha, '%d-%m-%y') as 'fecha_f' 
    FROM 
    transferencia t, 
    sucursal s 
    WHERE 
    (case when '${data.idcaja}'<>'-1' then ${data.idcaja}=t.fk_caja else true end) and 
    t.fk_origen = ${data.idsucursal} AND t.fk_destino = s.idsucursal;`,(err,rows,fields)=>{
        return callback(rows);
    })
    connection.end();
}
const obtener_transferencias_recibidas = (data, callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(`
    SELECT t.*, s.nombre AS 'sucursal_origen' , date_format(t.fecha, '%d-%m-%y') as 'fecha_f' 
    FROM 
    transferencia t , 
    sucursal s 
    WHERE 
    (case when '${data.idcaja}'<>'-1' then ${data.idcaja}=t.fk_caja else true end) and 
    t.fk_destino = ${data.idsucursal} AND t.fk_origen = s.idsucursal;`,(err,rows,fields)=>{
        return callback(rows);
    })
    connection.end();
}




module.exports = {
    agregar_transferencia,
    obtener_transferencias_enviadas,
    obtener_transferencias_recibidas,

}