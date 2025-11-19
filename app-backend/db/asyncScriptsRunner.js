//const sqlite3 = require("sqlite3").verbose();
//const db = new sqlite3.Database("./prod.db");
const { db } = require("../db/init");

/**
 * Safe wrapper for running SQL scripts with params.
 * - Always resolves (never throws)
 * - Returns success/failure + metadata
 */
function runSql(label, sql, params = []) {
  return new Promise((resolve) => {
    const startTime = Date.now();

    db.run(sql, params, function (err) {
      const result = {
        label,
        success: !err,
        error: err ? err.message : null,
        changes: this?.changes ?? 0,
        lastID: this?.lastID ?? null,
        durationMs: Date.now() - startTime
      };

      if (err) {
        console.error(`❌ [${label}] FAILED: ${err.message}`);
      } else {
        console.log(`✔️ [${label}] SUCCESS (${result.durationMs} ms)`);
      }

      resolve(result); // never reject → ensures next script runs
    });
  });
}

/**
 * Runs scripts sequentially (one-by-one)
 */
async function runScriptsSequentially(scripts) {
  const results = [];

  for (const script of scripts) {
    console.log(`\n▶️ Running: ${script.label}`);
    const result = await runSql(script.label, script.sql, script.params);
    results.push(result);
  }

  console.log("\n🏁 All scripts completed.");
  return results;
}

module.exports = { runScriptsSequentially };