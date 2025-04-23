const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Kiểm tra kết nối
pool.getConnection((err, connection) => {
  if (err) {
      console.error('Database connection failed:', {
          message: err.message,
          code: err.code,
          errno: err.errno
      });
  } else {
      console.log('Successfully connected to database');
      connection.release();
  }
});

const promisePool = pool.promise();
module.exports = promisePool;