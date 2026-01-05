// backend-app/db/database.js
const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "123",
  database: "shopDb",
});

/* ------------------ BASIC HELPERS ------------------ */

// test connection
async function connectDB() {
  await pool.query("SELECT 1");
  console.log("Database connected");
}

// database.js
const shop_tables = require("./shopPgs.js");
const shopTables = shop_tables();

async function initDB() {
  for (const sql of Object.values(shopTables)) {
    try {
      await pool.query(sql);
    } catch (err) {
      console.error("Shop table creation error:", err.message);
      throw err;
    }
  }
}


async function dbGet(sql, params = [], label = "") {
  console.log(label + " - " + new Date().toLocaleString());

  const { rows } = await pool.query(sql, params);
  return rows[0] || null;
}

async function dbGetAll(sql, params = [], label = "") {
  console.log(label + " - " + new Date().toLocaleString());

  const { rows } = await pool.query(sql, params);
  return rows;
}

async function dbRun(sql, params = [], label = "") {
  console.log(label + " - " + new Date().toLocaleString());

  const result = await pool.query(sql, params);
  return result.rowCount;
}

/* ---------------- TRANSACTION (MULTI) ---------------- */

async function dbRunAll(scripts = []) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (const script of scripts) {
      const { sql, params = [], label = "" } = script;

      console.log(label + " - " + new Date().toLocaleString());
      await client.query(sql, params);
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
  initDB,
  dbGet,
  dbGetAll,
  dbRun,
  dbRunAll,
};
