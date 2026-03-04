// db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'mi_base',
  waitForConnections: true,
  connectionLimit: 10,   // adjust based on traffic
  queueLimit: 0          // unlimited queued requests
});

module.exports = pool;
