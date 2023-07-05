const mysql_connection = require("../lib/mysql_connection")

    const checkIfUserLoggedIn = (token, callback) => {
        const connection = mysql_connection.getConnection();
        connection.connect()
        let q = `select * from usuario u where u.token = '${token}';`
        //console.log(q)
        connection.query(q,(err,res)=>{
            //console.log(JSON.stringify(res))
            let _logged = 0;
            if(res.length>0){
                if(res[0].logged=='1')
                { 
                    _logged=1;
                }
            }
            return callback({logged:_logged})
        })
        connection.end()
    }

const setToken = (data, callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect()
    let q = `UPDATE usuario u SET u.logged = '1', u.token = '${data.token}' WHERE u.nombre='${data.nombre}' AND u.password='${data.password}';`
    connection.query(q,(err,resp)=>{
        return callback(resp)
    })
    connection.end()
}

const logout = (token,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect()
    let q = `update usuario u set u.logged = '0' where u.token = '${token}'`
    connection.query(q,(err,data)=>{
        return callback(data)
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
            let _q = `UPDATE usuario u SET u.logged = 1 WHERE u.idusuario = ${rows[0].idusuario}`
            connection.query(_q,(err,_rows)=>{
                callback({logged:1, uid: rows[0].idusuario });
                connection.end();

            })
        }
        else{
            callback({logged:0})
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
    setToken,
    checkIfUserLoggedIn,
}