const mysql_connection = require("../lib/mysql_connection");
const { doQuery, doTransaction } = require("./helpers/queriesHelper");

const agregar_imagen = (data, callback) => {
  const connection = mysql_connection.getConnection();

  const query = `insert into imagen (fname, path, fk_ref, type) values(${connection.escape(data.fname)},'', ${connection.escape(data.fk_ref)}, ${connection.escape(data.tipo)})`;

  console.log(query);

  connection.connect();

  connection.query(query, (err, response) => {
    if (err) {
      return callback({ err: 1 });
    }

    callback(response);
  });

  connection.end();
};

const remover_imagen = (data, callback) => {
  const query = `delete from imagen where idimagen=${data.id}`;
  console.log(query);
  doQuery(query, (response) => {
    callback(response);
  });
};

const marcar_default = (data, callback) => {
    console.log(JSON.stringify(data))
  const __logic = async (connection) => {
    if (data.idanterior && +data.idanterior > 0) {
      const query1 = `update imagen i set i.default=0 where i.idimagen=${data.idanterior};`;
      console.log(query1);
      await connection.query(query1);
    }
    const query = `update imagen i set i.default=1 where i.idimagen=${data.id};`;
    console.log(query);
    await connection.query(query);
    return true;
  };

  doTransaction(__logic, ({ data, error }) => {
    return callback({ ok: 1 });
  });
};

const obtener_imagenes = (data, callback) => {
  const connection = mysql_connection.getConnection();

  const query = `select * from imagen i where i.fk_ref = ${connection.escape(data.fk_ref)} and i.type=${connection.escape(data.tipo)}`;

  console.log(query);

  connection.connect();

  connection.query(query, (err, response) => {
    if (err) {
      return callback({ err: 1 });
    }

    return callback(response);
  });

  connection.end();
};

const get_default_image = (data, callback) => {
  const connection = mysql_connection.getConnection();

  const query = `select i.fname from imagen i where i.fk_ref=${data.idproducto} order by i.default desc limit 1`;
  

  console.log(query);

  connection.connect();

  connection.query(query, (err, resp) => {
    if (err) {
      return callback({ err: 1 });
    }

    return callback(resp);
  });

  connection.end();
};

module.exports = {
  agregar_imagen,
  remover_imagen,
  obtener_imagenes,
  get_default_image,
  marcar_default,
};
