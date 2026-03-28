const mysql_connection = require("../lib/mysql_connection");
const { doQuery } = require("./helpers/queriesHelper");
// Example CRUD methods for Egreso with 'params' and 'callback' arguments
// Create
function createEgreso(params, callback) {
  const connection = mysql_connection.getConnection();
  if (!connection) {
    return callback(new Error("No database connection"));
  }

  const sql = `insert into caja_master.cm_egreso (fk_caja, fk_motivo, monto) values (${connection.escape(params.idcaja)}, ${connection.escape(params.idMotivo)}, ${connection.escape(params.monto)})`;
  //console.log(sql)
  connection.connect();

  connection.query(sql, (err, results) => {
    if (err) {
      return callback(err);
    }
    // Assuming results.insertId contains the ID of the newly created record
    callback(null, { id: results.insertId, ...params });
  });
  connection.end();
}
function createEgresoV2(params, callback) {

  const { fk_caja, fk_motivo, monto, modos, fk_deuda } = params;

  const _fk_deuda = fk_deuda || null;

    const connection = mysql_connection.getConnection();

  const sql = `insert into 
  caja_master.cm_egreso (fk_caja, fk_motivo, monto, fk_deuda) 
  values (
  ${connection.escape(fk_caja)}, 
  ${connection.escape(fk_motivo)}, 
  ${connection.escape(monto)},
  ${connection.escape(_fk_deuda)}
  )`;

  console.log(sql);

  doQuery(sql, (results) => {
    console.log("Egreso created with ID:", results.data.insertId);
    if (!results || !results.data.insertId) {
      return callback(null);
    }

    if(!modos || modos.length === 0) {
      return callback(null,{ id: results.data.insertId, ...params });
    }

    createEgresosModo(results.data.insertId, modos, (resp) => {
      if (!resp) {
        console.log("Failed to create egreso modos");
        return callback(null);
      }
      
      callback(null,{ id: results.data.insertId, ...params });
    });
  });
}

const createEgresosModo = (idEgreso, data, callback) => {
    
    const values = data.map(modo => `(${idEgreso}, '${modo.modo}', ${modo.fk_cta_bancaria||null}, ${modo.monto})`).join(", ");
    const sql = `INSERT INTO caja_master.cm_egreso_modo (fk_egreso, modo, fk_cta_bancaria, monto) VALUES ${values}`;
    console.log(sql);
    doQuery(sql, (results) => {
        if (!results) {
            console.log("Failed to create egreso modos");
            return callback(null);
        }
        callback(results.data);
    });
};

// Read
function getEgreso(params, callback) {
  const connection = mysql_connection.getConnection();
  if (!connection) {
    return callback(new Error("No database connection"));
  }

  const sql = "SELECT * FROM egresos WHERE id = ?";
  connection.connect();

  connection.query(sql, params, (err, results) => {
    if (err) {
      return callback(err);
    }
    // Assuming results.insertId contains the ID of the newly created record
    callback(null, { id: results.insertId, ...params });
  });
  connection.end();
}

// Update
function updateEgreso(params, callback) {
  const connection = mysql_connection.getConnection();
  if (!connection) {
    return callback(new Error("No database connection"));
  }

  const sql = "UPDATE egresos SET ? WHERE id = ?";
  connection.connect();

  connection.query(sql, params, (err, results) => {
    if (err) {
      return callback(err);
    }
    // Assuming results.insertId contains the ID of the newly created record
    callback(null, { id: results.insertId, ...params });
  });
  connection.end();
}

// Delete
function deleteEgreso(params, callback) {
  const connection = mysql_connection.getConnection();
  if (!connection) {
    return callback(new Error("No database connection"));
  }

  const sql = "DELETE FROM egresos WHERE id = ?";
  connection.connect();

  connection.query(sql, params, (err, results) => {
    if (err) {
      return callback(err);
    }
    // Assuming results.insertId contains the ID of the newly created record
    callback(null, { id: results.insertId, ...params });
  });
  connection.end();
}

function getEgresoList(callback) {
  const connection = mysql_connection.getConnection();
  if (!connection) {
    return callback(new Error("No database connection"));
  }

  const sql = "SELECT * FROM egresos";
  connection.connect();

  connection.query(sql, (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results);
  });
  connection.end();
}

module.exports = {
  createEgreso,
  getEgreso,
  updateEgreso,
  deleteEgreso,
  getEgresoList,

  createEgresoV2,
};
