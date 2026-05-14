const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
const { AsyncLocalStorage } = require("async_hooks");

// 1. Setup Context Storage to track which pool belongs to which request
const dbContext = new AsyncLocalStorage();

// 2. Load DB Configurations
const configPath = path.join(__dirname, "./db_instances.json");
let dbConfigs = {};
try {
  if (fs.existsSync(configPath)) {
    dbConfigs = JSON.parse(fs.readFileSync(configPath, "utf8"));
  } else {
    console.warn("⚠️ db_instances.json not found. Using empty config.");
  }
} catch (err) {
  console.error("❌ Error loading db_instances.json:", err.message);
}

// 3. Pool Registry (Cache)
const pools = new Map();

/**
 * Gets or creates a connection pool for a specific key (user_a)
 * @param {string} key - The database identifier (e.g., user_a)
 * @returns {Pool}
 */
function getPoolForKey(key) {
  const targetKey = key || "default";
  
  if (!dbConfigs[targetKey]) {
    console.warn(`⚠️ No config found for key: ${targetKey}, falling back to default`);
    if (!dbConfigs["default"]) {
        throw new Error(`Database configuration '${targetKey}' not found and no 'default' fallback available.`);
    }
    return getPoolForKey("default");
  }

  if (!pools.has(targetKey)) {
    console.log(`🔌 Initializing new connection pool for: ${targetKey}`);
    try {
        const pool = new Pool(dbConfigs[targetKey]);
        // Handle unexpected errors on idle clients
        pool.on('error', (err) => {
            console.error(`❌ Unexpected error on idle client for ${targetKey}:`, err);
        });
        pools.set(targetKey, pool);
    } catch (err) {
        console.error(`❌ Failed to initialize pool for ${targetKey}:`, err.message);
        throw err;
    }
  }
  return pools.get(targetKey);
}

/**
 * Internal helper to get the pool for the current request context
 * @returns {Pool}
 */
function getCurrentPool() {
  const pool = dbContext.getStore();
  if (!pool) {
    // If no context (e.g. background task), use default
    return getPoolForKey("default");
  }
  return pool;
}

/**
 * Closes all active connection pools (useful for graceful shutdown)
 */
async function closeAllPools() {
    console.log("🔌 Closing all database pools...");
    const closePromises = [];
    for (const [key, pool] of pools.entries()) {
        console.log(`Closing pool: ${key}`);
        closePromises.push(pool.end());
    }
    await Promise.all(closePromises);
    pools.clear();
    console.log("✅ All database pools closed.");
}

/* ------------------ ORIGINAL HELPERS (ADAPTED) ------------------ */

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

async function connectDB() {
  const pool = getCurrentPool();
  try {
    const res = await pool.query("SELECT 1");
    console.log("✅ Database connected successfully");
    return true;
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    return false;
  }
}

async function dbGet(sql, params = [], label = "") {
  const start = process.hrtime.bigint();
  const pool = getCurrentPool();

  const result = await pool.query(sql, params);

  const duration = getDurationMs(start).toFixed(2);
  console.log(`${label} - ${new Date().toLocaleString()} - ${duration} ms`);
  logIfSlow(start, label, sql);

  return result.rows[0] || null;
}

async function dbGetAll(sql, params = [], label = "") {
  const start = process.hrtime.bigint();
  const pool = getCurrentPool();

  const result = await pool.query(sql, params);

  const duration = getDurationMs(start).toFixed(2);
  console.log(`${label} - ${new Date().toLocaleString()} - ${duration} ms`);
  logIfSlow(start, label, sql);

  return result.rows;
}

async function dbRun(sql, params = [], label = "") {
  const start = process.hrtime.bigint();
  const pool = getCurrentPool();

  const result = await pool.query(sql, params);

  const duration = getDurationMs(start).toFixed(2);
  console.log(`${label} - ${new Date().toLocaleString()} - ${duration} ms`);
  logIfSlow(start, label, sql);

  return result.rowCount;
}

/* ---------------- TRANSACTION (MULTI) ---------------- */

async function dbRunAll(scripts = []) {
  const pool = getCurrentPool();
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
  dbContext,
  getPoolForKey,
  closeAllPools,
  connectDB,
  dbGet,
  dbGetAll,
  dbRun,
  dbRunAll,
};
