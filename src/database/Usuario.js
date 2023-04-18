const mysql_connection = require("../lib/mysql_connection")

const logout = (data,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect()
    let q = ``
    connection.query(q,(err,rows)=>{
        return callback(rows)
    })
    connection.end()
}

const validar_usuario_login = (data,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    let q = `SELECT u.idusuario from usuario u WHERE u.nombre = '${data.name}' AND u.password = '${data.pass}' `
    console.log(q)
    connection.query( q ,(err,rows,fields)=>{
        if(rows.length>0){
            let _q = `UPDATE usuario u SET u.loged = 1 WHERE u.idusuario = ${rows[0].idusuario}`
            connection.query(_q,(err,rows)=>{
                callback([0]);
                connection.end();

            })
        }
        else{
            callback([])
            connection.end();
        }
        
    })
   
}

const obtener_usuarios = (callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query("select * from usuario",(err,rows,fields)=>{
        return callback(rows);
    })
    connection.end();
}

const agregar_usuario = (data,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    var sql = "insert into usuario (nombre,password) values (?)";

    var values = [[
        data.nombre,data.password
    ]];

    connection.query(sql,values, (err,result) => {
            return callback(result.insertId)
        });
    connection.end();
}

module.exports = {
    obtener_usuarios,
    agregar_usuario,
    validar_usuario_login,
    logout,
}