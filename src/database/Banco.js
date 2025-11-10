const mysql_connection = require("../lib/mysql_connection");

const obtenerBancos = (callback, _bancos_prov) => {
  const bancos_prov = _bancos_prov ? _bancos_prov : 0;

  connection = mysql_connection.getConnection();

  connection.connect();

  connection.query(
    `select b.* 
    from banco b 
    where 
    (case when '${bancos_prov}' = '1' then b.activo = 1  else b.activoSistProv=1 end )
    order by b.nombre desc`,
    (err, rows, fields) => {
      callback(rows);
    }
  );

  connection.end();
};

const obtenerBanco = (callback) => {
  const connection = mysql_connection.getConnection();

  connection.connect();

  connection.query(
    "select * from banco b where b.idbanco = 0 ",
    (err, rows, fields) => {
      return callback(rows);
    }
  );

  connection.end();
};

const agregarBanco = (data, callback) => {
  const connection = mysql_connection.getConnection();

  connection.connect();

  connection.query(
    "insert into banco (nombre) values ('" + data.nombre + "');",
    (err, result, fields) => {
      return callback(result.insertId);
    }
  );

  connection.end();
};

const desactivar_banco = (data, callback) => {
  const connection = mysql_connection.getConnection();
  const query = `update banco b set b.activo = if(b.activo = 0, 1,0) where b.idbanco=${data.idbanco};`;
  //console.log(query)
  connection.connect();
  connection.query(query, (err, resp) => {
    callback(resp);
  });
  connection.end();
};

module.exports = {
  desactivar_banco,
  obtenerBancos,
  agregarBanco,
};
