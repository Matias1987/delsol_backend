// db.js
const mysql = require('mysql2/promise');
const _global_vars = require("./global");
const pool = mysql.createPool({
  host: _global_vars.connection_data.host,
  user: _global_vars.connection_data.user,
  password: _global_vars.connection_data.password,
  database: _global_vars.connection_data.database,
  waitForConnections: true,
  connectionLimit: 20,   // adjust based on traffic
  queueLimit: 0          // unlimited queued requests
});

module.exports = pool;