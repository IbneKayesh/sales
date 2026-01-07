const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost", // usually: 'localhost'
  user: process.env.DB_USER || "root", // e.g., 'root'
  password: process.env.DB_PASS || "rootpass", // your password
  database: process.env.DB_NAME || "shopdb", // database name
  port: process.env.DB_PORT || 3080, // usually: 3306
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/* ------------------ BASIC HELPERS ------------------ */

// test connection
async function connectDB() {
  await pool.query("SELECT 1");
  console.log("Database connected");
}

async function dbGet(sql, params = [], label = "") {
  console.log(label + " - " + new Date().toLocaleString());

  const [rows] = await pool.execute(sql, params);
  //console.log(rows);
  return rows[0] || null;
}

async function dbGetAll(sql, params = [], label = "") {
  console.log(label + " - " + new Date().toLocaleString());

  const [rows] = await pool.execute(sql, params);
  return rows;
}

async function dbRun(sql, params = [], label = "") {
  console.log(label + " - " + new Date().toLocaleString());

  const result = await pool.query(sql, params);
  return result.rowCount;
}

/* ---------------- TRANSACTION (MULTI) ---------------- */

async function dbRunAll(scripts = []) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    for (const script of scripts) {
      const { sql, params = [], label = "" } = script;

      console.log(label + " - " + new Date().toLocaleString());
      await connection.query(sql, params);
    }

    await connection.commit();
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

module.exports = {
  pool,
  connectDB,
  dbGet,
  dbGetAll,
  dbRun,
  dbRunAll,
};
