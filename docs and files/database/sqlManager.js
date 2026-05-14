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

function getDurationMs(start) {
  const diff = process.hrtime.bigint() - start;
  // convert nanoseconds to milliseconds
  return Number(diff) / 1_000_000;
}

const SLOW_QUERY_MS = 100; // change to whatever you consider slow
function logIfSlow(start, label, sql) {
  const duration = getDurationMs(start);

  if (duration > SLOW_QUERY_MS) {
    console.warn(
      `🐌 SLOW QUERY (${duration.toFixed(2)} ms) - ${label}\nSQL: ${sql}\n`
    );
  }
}

// test connection
async function connectDB() {
  await pool.query("SELECT 1");
  console.log("Database connected");
}

async function dbGet(sql, params = [], label = "") {
  const start = process.hrtime.bigint();

  const [rows] = await pool.execute(sql, params);

  const duration = getDurationMs(start).toFixed(2);
  console.log(`${label} - ${new Date().toLocaleString()} - ${duration} ms`);
  logIfSlow(start, label, sql);

  return rows[0] || null;
}

async function dbGetAll(sql, params = [], label = "") {
  const start = process.hrtime.bigint();

  const [rows] = await pool.execute(sql, params);

  const duration = getDurationMs(start).toFixed(2);
  console.log(`${label} - ${new Date().toLocaleString()} - ${duration} ms`);
  logIfSlow(start, label, sql);

  return rows;
}

async function dbRun(sql, params = [], label = "") {
  const start = process.hrtime.bigint();

  const [result] = await pool.query(sql, params);

  const duration = getDurationMs(start).toFixed(2);
  console.log(`${label} - ${new Date().toLocaleString()} - ${duration} ms`);
  logIfSlow(start, label, sql);

  return result.affectedRows;
}

/* ---------------- TRANSACTION (MULTI) ---------------- */

async function dbRunAll(scripts = []) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    for (const script of scripts) {
      const { sql, params = [], label = "" } = script;

      const start = process.hrtime.bigint();

      await connection.query(sql, params);

      const duration = getDurationMs(start).toFixed(2);
      console.log(`${label} - ${new Date().toLocaleString()} - ${duration} ms`);
      logIfSlow(start, label, sql);
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
