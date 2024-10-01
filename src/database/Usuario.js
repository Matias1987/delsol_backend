const mysql_connection = require("../lib/mysql_connection")

    /**
     * sessions
     */
    const obtener_autorizaciones_pendientes = (idsucursal, callback) => {
        const connection = mysql_connection.getConnection()
        connection.connect()
        const _query = `SELECT s.*, u.nombre AS 'usuario', u.token, u.idusuario FROM sesion s, usuario u WHERE 
                        s.fkaccount = u.idusuario AND 
                        s.fksucursal=${idsucursal} AND DATE(s.fecha) = DATE(NOW());`
        connection.query(_query,(err,rows)=>{
            if(rows!=null)
            {
                callback(rows)
            }
            else{
                callback([])
            }
        })
        connection.end();
    }

    const cambiar_estado_autorizacion = (data,callback)=>{
        const connection = mysql_connection.getConnection()
        connection.connect()
        const _query = `UPDATE sesion s SET s.estado = '${data.estado}' WHERE s.idsesion=${data.idsesion};`
        //console.log(_query)
        if(data.estado=='R'){
            let q = `update usuario u set u.logged = '0' where u.token = '${data.token}'`
            connection.query(q,(err,data)=>{})
        }

        connection.query(_query,(err,rows)=>{
            callback(rows)
        })
        connection.end();
    }

    const check_session = (uid,sucursalid, callback ) => {
        const connection = mysql_connection.getConnection()
        connection.connect()
        const _query = `SELECT s.idsesion, s.estado, u.fksucursal_default 
                        FROM sesion s, usuario u WHERE 
                        u.idusuario = s.fkaccount AND 
                        s.fksucursal=${sucursalid} AND 
                        s.fkaccount=${uid} 
                        AND DATE(NOW()) = DATE(s.fecha)`

        connection.query(_query,(err,rows)=>{
            if(rows==null)
            {
                return  callback(null)
            }
            if(rows.length>0){
                if(rows[0].fksucursal_default == sucursalid)
                {
                    callback({
                        estado: 'acepted'
                    })
                }
                else
                {
                    callback({
                        estado: rows[0].estado == 'P' ? 'pending' : rows[0].estado == 'R' ? 'declined' : 'acepted'
                    })
                }
            }
            else
            {
                callback(null)
            }
        })
        connection.end()
    }

    const create_session = (data, callback) => {
        
        const connection = mysql_connection.getConnection()
        connection.connect()
        const _query = `INSERT INTO sesion (fkaccount, fksucursal,fecha) VALUES (${data.fkusuario}, ${data.fksucursal}, date('${data.anio}-${data.mes}-${data.dia}'))`
        
        connection.query(_query, (err,rows)=>{
            callback()
        })
        connection.end()
    }

    const checkIfUserLoggedIn = (token, callback) => {
        const connection = mysql_connection.getConnection();
        connection.connect()
        let q = `select * from usuario u where u.token = '${token}';`
        
        connection.query(q,(err,res)=>{
            
            if(res==null)
            {
                return callback({logged:0})
            }

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
    let q = `UPDATE usuario u SET u.logged = '1', u.token = '${data.token}' WHERE u.nombre='${data.nombre}' AND u.passwd=md5('${data.password}');`
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


const get_user_credentials = (data, callback) =>{

    const connection = mysql_connection.getConnection();
    connection.connect();

    const query = `SELECT 
                u.idusuario,
                u.nombre,
                u.usuario,
                u.apellido,
                u.logged,
                u.token,
                if(ups.idpermiso IS NULL , u.ventas , ups.ventas) AS 'ventas',
                if(ups.idpermiso IS NULL, u.caja1, ups.caja1) AS 'caja1',
                if(ups.idpermiso IS NULL, u.deposito_min, ups.deposito_min) AS 'deposito_min',
                if(ups.idpermiso IS NULL, u.deposito, ups.deposito) AS 'deposito',
                if(ups.idpermiso IS NULL, u.caja2, ups.caja2) AS 'caja2',
                if(ups.idpermiso IS NULL, u.admin1, ups.admin1) AS 'admin1',
                if(ups.idpermiso IS NULL, u.admin2, ups.admin2) AS 'admin2',
                if(ups.idpermiso IS NULL, u.laboratorio, ups.laboratorio) AS 'laboratorio',
                if(ups.idpermiso IS NULL, u.admin_prov, ups.admin_prov) AS 'admin_prov'
            from usuario u 
                LEFT JOIN usuario_permiso_sucursal ups ON 
                ups.fk_sucursal = ${data.idsucursal} AND 
                ups.fk_usuario = u.idusuario
            WHERE 
            u.idusuario=${data.idusuario}`;

            //console.log(query)

    connection.query(query,(err,resp)=>{
        callback(resp)
    })
    connection.end()


}

const validar_usuario_login = (data,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    let q = `SELECT 
                u.idusuario,
                u.nombre,
                u.usuario,
                u.apellido,
                u.logged,
                u.token,
                if(ups.idpermiso IS NULL , u.ventas , ups.ventas) AS 'ventas',
                if(ups.idpermiso IS NULL, u.caja1, ups.caja1) AS 'caja1',
                if(ups.idpermiso IS NULL, u.deposito_min, ups.deposito_min) AS 'deposito_min',
                if(ups.idpermiso IS NULL, u.deposito, ups.deposito) AS 'deposito',
                if(ups.idpermiso IS NULL, u.caja2, ups.caja2) AS 'caja2',
                if(ups.idpermiso IS NULL, u.admin1, ups.admin1) AS 'admin1',
                if(ups.idpermiso IS NULL, u.admin2, ups.admin2) AS 'admin2',
                if(ups.idpermiso IS NULL, u.laboratorio, ups.laboratorio) AS 'laboratorio',
                if(ups.idpermiso IS NULL, u.admin_prov, ups.admin_prov) AS 'admin_prov'
            from usuario u 
                LEFT JOIN usuario_permiso_sucursal ups ON 
                ups.fk_sucursal = ${data.sucursal} AND 
                ups.fk_usuario = u.idusuario
            WHERE 
            u.nombre = '${data.name}' AND 
            u.passwd = MD5('${data.pass}')`

    //console.log(q)
    
    connection.query( q ,(err,rows,fields)=>{
        
        if((rows||[]).length>0){
            let _q = `UPDATE usuario u SET u.logged = 1 WHERE u.idusuario = ${rows[0].idusuario}`
            connection.query(_q,(err,_rows)=>{
                callback({logged:1, uid: rows[0].idusuario, udata: rows[0] });
                /* register session */
            })
            connection.end();
        }
        else{
            callback({logged:0})
            connection.end();
        }
        
    })
   
}
const validar_usuario_login_b = (data,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    let q = `SELECT  u.* from usuario u         
            WHERE 
            u.nombre = '${data.name}' AND 
            u.passwd = MD5('${data.pass}')`

    console.log(q)
    
    connection.query( q ,(err,rows,fields)=>{
        
        if((rows||[]).length>0){
            let _q = `UPDATE usuario u SET u.logged = 1 WHERE u.idusuario = ${rows[0].idusuario}`
            connection.query(_q,(err,_rows)=>{
                callback({logged:1, uid: rows[0].idusuario, udata: rows[0] });
                /* register session */
            })
            connection.end();
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
    /**
     * {
        "nombre": "asdfasf",
        "usuario": "adasfsa",
        "ventas": "1",
        "caja1": "1",
        "deposito_min": "0",
        "deposito": "0",
        "caja2": "0",
        "admin1": "0",
        "admin2": "0",
        "admin3": "0",
        "laboratorio": "0",
        "passwd": "lsdfsdfd"
        }   
     */
    const connection = mysql_connection.getConnection();
    connection.connect();
    var sql = `insert into usuario (
        nombre, 
        usuario, 
        passwd, 
        ventas, 
        caja1, 
        caja2, 
        deposito_min, 
        deposito, 
        admin1,
        admin2, 
        laboratorio
        ) 
        values 
        (
            '${data.nombre}',
            '${data.usuario}',
            md5('${data.passwd}'),
            '${data.ventas}',
            '${data.caja1}',
            '${data.caja2}',
            '${data.deposito_min}',
            '${data.deposito}',
            '${data.admin1}',
            '${data.admin2}',
            '${data.laboratorio}'
        )`;


    //console.log(sql)
    connection.query(sql, (err,result) => {
            return callback(result.insertId)
        });
    connection.end();
}

const obtener_detalle_vendedor = (idusuario,callback)=>{
    const connection = mysql_connection.getConnection();
    connection.connect();
    var sql = `SELECT u.* FROM usuario u WHERE u.idusuario=${idusuario};`;
    
    connection.query(sql,(err,rows)=>{
        return callback(rows[0])
    })
    connection.end();

}

const obtener_usuarios_permisos = (callback) => {
    const query = `SELECT * FROM (
        SELECT 
        u.idusuario AS 'id',
        'TODAS' AS 'sucursal',
        u.nombre,
        u.ventas,
        u.caja1,
        u.caja2,
        u.deposito_min,
        u.deposito,
        u.admin1,
        u.admin2 ,
        u.laboratorio,
        u.admin_prov
        FROM usuario u 
        UNION 
        SELECT  
        ups.fk_usuario AS 'id',
        s.nombre AS 'sucursal',
        '-' AS 'nombre',
        ups.ventas,
        ups.caja1,
        ups.caja2,
        ups.deposito_min,
        ups.deposito,
        ups.admin1,
        ups.admin2 ,
        ups.laboratorio,
        u.admin_prov
        FROM usuario_permiso_sucursal ups, sucursal s 
        WHERE
        s.idsucursal = ups.fk_sucursal
        ) AS u 
    ORDER BY u.id`;
    //console.log(query)
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,rows)=>{
        callback(rows)
    })
    connection.end()

}

const modificar_permisos = (data, callback) => {
    const query =`INSERT INTO usuario_permiso_sucursal 
    (fk_sucursal, fk_usuario, ventas, caja1, deposito_min, deposito, caja2, admin1, admin2, laboratorio) 
    VALUES (${data.fk_sucursal}, ${data.fk_usuario}, ${data.ventas}, ${data.caja1}, ${data.deposito_min}, ${data.deposito}, ${data.caja2}, ${data.admin1}, ${data.admin2}, ${data.laboratorio})
    ON DUPLICATE KEY UPDATE 
    ventas=${data.ventas}, caja1=${data.caja1}, deposito_min=${data.deposito_min}, deposito=${data.deposito}, caja2=${data.caja2}, admin1=${data.admin1}, admin2=${data.admin2}, laboratorio=${data.laboratorio}
    ;
    `
    const q2 = `update usuario u set 
        u.ventas=${data.ventas}, 
        u.caja1=${data.caja1}, 
        u.deposito_min=${data.deposito_min}, 
        u.deposito=${data.deposito}, 
        u.caja2=${data.caja2}, 
        u.admin1=${data.admin1}, 
        u.admin2=${data.admin2}, 
        u.laboratorio=${data.laboratorio}
        where u.idusuario=${data.fk_usuario}
        ;`



    //console.log(query)
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(data.fk_sucursal<0 ? q2 : query,(err,resp)=>{
        callback(resp)
    })
    connection.end()
}

const validar_usuario_be = (data,  onOK, onError)=>{
    //console.log(`user with token: ${data.tk} validated`)
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(`SELECT u.idusuario, u.logged FROM usuario u WHERE u.token='${data.tk}';`,(err,rows)=>{
        const resp = rows||[]
        if(rows.length>0)
        {
            if(+resp[0].logged==1)
            {
                onOK()
            }
            else
            {
                onError()
            }
        }
        else
        {
            onError()
        }
    })
    connection.end()
   
}


module.exports = {
    validar_usuario_be, 
    obtener_usuarios_permisos,
    obtener_autorizaciones_pendientes,
    cambiar_estado_autorizacion,
    obtener_usuarios,
    agregar_usuario,
    validar_usuario_login,
    logout,
    setToken,
    checkIfUserLoggedIn,
    obtener_detalle_vendedor,
    check_session,
    create_session,
    modificar_permisos,
    get_user_credentials,
    validar_usuario_login_b,
}