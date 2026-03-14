const mysql_connection = require("../lib/mysql_connection");
const { doQuery, escapeHelper } = require("./helpers/queriesHelper");
/**
 * sessions
 */
const obtener_autorizaciones_pendientes = (idsucursal, callback) => {
  const connection = mysql_connection.getConnection();
  connection.connect();
  const _query = `SELECT s.*, u.nombre AS 'usuario', u.token, u.idusuario FROM sesion s, usuario u WHERE 
                        s.fkaccount = u.idusuario AND 
                        s.fksucursal=${idsucursal} AND DATE(s.fecha) = DATE(NOW());`;
  connection.query(_query, (err, rows) => {
    if (rows != null) {
      callback(rows);
    } else {
      callback([]);
    }
  });
  connection.end();
};

const cambiar_estado_autorizacion = (data, callback) => {
  const connection = mysql_connection.getConnection();
  connection.connect();
  const _query = `UPDATE sesion s SET s.estado = '${data.estado}' WHERE s.idsesion=${data.idsesion};`;
  //console.log(_query)
  if (data.estado == "R") {
    let q = `update usuario u set u.logged = '0' where u.token = '${data.token}'`;
    connection.query(q, (err, data) => {});
  }

  connection.query(_query, (err, rows) => {
    callback(rows);
  });
  connection.end();
};

const check_session = (uid, sucursalid, callback) => {
  const _query = `SELECT s.idsesion, s.estado, u.fksucursal_default 
                        FROM sesion s, usuario u WHERE 
                        u.idusuario = s.fkaccount AND 
                        s.fksucursal=${escapeHelper(sucursalid)} AND 
                        s.fkaccount=${escapeHelper(uid)} 
                        AND DATE(NOW()) = DATE(s.fecha)`;

  doQuery(_query, (response) => {
    const rows = response.data;
    if (!response || !rows) {
      return callback(null);
    }
    if (rows.length > 0) {
      if (rows[0].fksucursal_default == sucursalid) {
        callback({
          estado: "acepted",
        });
      } else {
        callback({
          estado:
            rows[0].estado == "P"
              ? "pending"
              : rows[0].estado == "R"
                ? "declined"
                : "acepted",
        });
      }
    } else {
      callback(null);
    }
  });
};

const create_session = (data, callback) => {
  const connection = mysql_connection.getConnection();
  connection.connect();
  const _query = `INSERT INTO sesion (fkaccount, fksucursal,fecha) VALUES (${data.fkusuario}, ${data.fksucursal}, date('${data.anio}-${data.mes}-${data.dia}'))`;

  connection.query(_query, (err, rows) => {
    callback();
  });
  connection.end();
};

const checkIfUserLoggedIn = (token, callback) => {
  let q = `select * from usuario u where u.token = ${escapeHelper(token)};`;
  //onsole.log(q);
  doQuery(q, (response) => {
    if (!response || response.err) {
      return callback({ logged: 0 });
    }
    const res = response.data;
    if (res == null) {
      return callback({ logged: 0 });
    }

    let _logged = 0;
    if (res.length > 0) {
      if (res[0].logged == "1" || +(res[0].multInstances || "0") == 1) {
        _logged = 1;
      }
    }
    return callback({ logged: _logged });
  });
};

const setToken = (data, callback) => {
 
  let q = `UPDATE usuario u SET u.logged = '1', u.token = ${escapeHelper(data.token)} WHERE u.nombre=${escapeHelper(data.nombre)} AND u.passwd=md5(${escapeHelper(data.password)});`;
  doQuery(q, (response) => {
    return callback(response.data);
  });
};

const logout = (token, callback) => {
  let q = `update usuario u set u.logged = '0' where u.token = ${escapeHelper(token)}`;
  doQuery(q, (response) => {
    return callback(response.data);
  });
};

const get_user_credentials = (data, callback) => {

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
                ups.fk_sucursal = ${escapeHelper(data.idsucursal)} AND 
                ups.fk_usuario = u.idusuario
            WHERE 
            u.idusuario=${escapeHelper(data.idusuario)}`;

  //console.log(query)

  doQuery(query, (response) => {
    callback(response.data);
  });
};

const validar_usuario_login = (data, callback) => {
 
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
                ups.fk_sucursal = ${escapeHelper(data.sucursal)} AND 
                ups.fk_usuario = u.idusuario
            WHERE 
            u.nombre = ${escapeHelper(data.name)} AND 
            u.passwd = MD5(${escapeHelper(data.pass)})`;

  //console.log(q)

  doQuery(q, (response) => {
    if(!response || response.err )
    {
      return callback({ logged: 0 });
    }
    const rows = response.data || [];
    if ((rows || []).length > 0) {
      let _q = `UPDATE usuario u SET u.logged = 1 WHERE u.idusuario = ${rows[0].idusuario}`;
      doQuery(_q, (response) => {
        callback({ logged: 1, uid: rows[0].idusuario, udata: rows[0] });
      });
    } else {
      callback({ logged: 0 });
    }
  });
};
const validar_usuario_login_b = (data, callback) => {

  let q = `SELECT  u.* from usuario u         
            WHERE 
            u.nombre = ${escapeHelper(data.name)} AND 
            u.passwd = MD5(${escapeHelper(data.pass)})`;

  //console.log(q)

  doQuery(q, (response) => {
    if(!response || response.err) {
      return callback({ logged: 0 });
    }
    const rows = response.data || [];
    if ((rows || []).length > 0) {
      let _q = `UPDATE usuario u SET u.logged = 1 WHERE u.idusuario = ${escapeHelper(rows[0].idusuario)}`;
      doQuery(_q, (response) => {
        callback({ logged: 1, uid: rows[0].idusuario, udata: rows[0] });
      });
    } else {
      callback({ logged: 0 });
    }
  });
};

const obtener_usuarios = (callback) => {
  doQuery("select * from usuario", (response) => {
    return callback(response.data);
  });
 
};

const obtener_vendedores = (callback) => {
  const query = `SELECT u.idusuario, u.nombre, u.ventas, u.deposito_min, u.deposito, u.caja1, u.caja2 FROM usuario u WHERE u.ventas=1 ORDER BY u.nombre asc;`;
  
  doQuery(query, (response) => {
    if (response.err) {
      return callback([]);
    }
    return callback(response.data);
  });
};

const agregar_usuario = (data, callback) => {
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

  console.log(sql);
  connection.query(sql, (err, result) => {
    if (err) {
      return callback({ err: 1 });
    }
    return callback(result.insertId);
  });
  connection.end();
};

const obtener_detalle_vendedor = (idusuario, callback) => {

  var sql = `SELECT u.* FROM usuario u WHERE u.idusuario=${escapeHelper(idusuario)};`;

  doQuery(sql, (response) => {
    return callback(response.data[0]);
  });
};

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
        u.laboratorio
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
        ups.laboratorio
        FROM usuario_permiso_sucursal ups, sucursal s 
        WHERE
        s.idsucursal = ups.fk_sucursal
        ) AS u 
    ORDER BY u.id`;
  //console.log(query)

  doQuery(query, (response) => {
    callback(response.data);
  });
};

const modificar_permisos = (data, callback) => {
  const query = `INSERT INTO usuario_permiso_sucursal 
    (fk_sucursal, fk_usuario, ventas, caja1, deposito_min, deposito, caja2, admin1, admin2, laboratorio) 
    VALUES (${data.fk_sucursal}, ${data.fk_usuario}, ${data.ventas}, ${data.caja1}, ${data.deposito_min}, ${data.deposito}, ${data.caja2}, ${data.admin1}, ${data.admin2}, ${data.laboratorio})
    ON DUPLICATE KEY UPDATE 
    ventas=${data.ventas}, caja1=${data.caja1}, deposito_min=${data.deposito_min}, deposito=${data.deposito}, caja2=${data.caja2}, admin1=${data.admin1}, admin2=${data.admin2}, laboratorio=${data.laboratorio}
    ;
    `;
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
        ;`;

  console.log(query);
  const connection = mysql_connection.getConnection();
  connection.connect();
  connection.query(data.fk_sucursal < 0 ? q2 : query, (err, resp) => {
    callback(resp);
  });
  connection.end();
};

const validar_usuario_be = (data, onOK, onError) => {

  doQuery(
    `SELECT u.idusuario, u.logged FROM usuario u WHERE u.token=${escapeHelper(data.tk)};`,
    (response) => {
      if (response.err) {
        console.log(response.err);
        onError();
        return;
      }
      const resp = response.data || [];
      if (response.data.length > 0) {
        if (+resp[0].logged == 1) {
          onOK();
        } else {
          onError();
        }
      } else {
        onError();
      }
    },
  );
};

module.exports = {
  obtener_vendedores,
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
};
