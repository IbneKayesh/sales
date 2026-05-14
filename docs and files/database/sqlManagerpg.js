const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "sgdpg",
  password: process.env.DB_PASS || "sgdpass",
  database: process.env.DB_NAME || "sgddb",
  port: process.env.DB_PORT || 5432,
  max: 10,
});

/* ------------------ BASIC HELPERS ------------------ */

function getDurationMs(start) {
  const diff = process.hrtime.bigint() - start;
  return Number(diff) / 1_000_000;
}

const SLOW_QUERY_MS = 100;

function logIfSlow(start, label, sql) {
  const duration = getDurationMs(start);

  if (duration > SLOW_QUERY_MS) {
    console.warn(
      `🐌 SLOW QUERY (${duration.toFixed(2)} ms) - ${label}\nSQL: ${sql}\n`,
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

  const result = await pool.query(sql, params);

  const duration = getDurationMs(start).toFixed(2);
  console.log(`${label} - ${new Date().toLocaleString()} - ${duration} ms`);
  logIfSlow(start, label, sql);

  return result.rows[0] || null;
}

async function dbGetAll(sql, params = [], label = "") {
  const start = process.hrtime.bigint();

  const result = await pool.query(sql, params);

  const duration = getDurationMs(start).toFixed(2);
  console.log(`${label} - ${new Date().toLocaleString()} - ${duration} ms`);
  logIfSlow(start, label, sql);

  return result.rows;
}

async function dbRun(sql, params = [], label = "") {
  const start = process.hrtime.bigint();

  const result = await pool.query(sql, params);

  const duration = getDurationMs(start).toFixed(2);
  console.log(`${label} - ${new Date().toLocaleString()} - ${duration} ms`);
  logIfSlow(start, label, sql);

  return result.rowCount;
}

/* ---------------- TRANSACTION (MULTI) ---------------- */

async function dbRunAll(scripts = []) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (const script of scripts) {
      const { sql, params = [], label = "" } = script;

      const start = process.hrtime.bigint();

      await client.query(sql, params);

      const duration = getDurationMs(start).toFixed(2);
      console.log(`${label} - ${new Date().toLocaleString()} - ${duration} ms`);
      logIfSlow(start, label, sql);
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
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
