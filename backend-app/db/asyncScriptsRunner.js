const { db } = require("./init");

// --------------------------------------------------
// Low-level helpers
// --------------------------------------------------
function dbRun(sql, params = [], label) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      console.log(label);
      resolve(this);
    });
  });
}

function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function dbAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

// --------------------------------------------------
// Enhanced runSql with logging (never rejects)
// --------------------------------------------------
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
        durationMs: Date.now() - startTime,
      };

      if (err) {
        console.error(`❌ [${label}] FAILED: ${err.message}`);
      } else {
        console.log(`✔️ [${label}] SUCCESS (${result.durationMs} ms)`);
      }

      resolve(result); // always resolves so sequence continues
    });
  });
}

// --------------------------------------------------
// Sequential runner with optional transaction
// --------------------------------------------------
async function runScriptsSequentially(
  scripts,
  { useTransaction = false } = {}
) {
  const results = [];

  try {
    if (useTransaction) {
      console.log("🚀 BEGIN TRANSACTION " + new Date().toISOString());
      await dbRun("BEGIN IMMEDIATE", [], "Transaction Started");
    }

    for (const script of scripts) {
      console.log(`\n▶️ Running: ${script.label}`);
      const result = await runSql(script.label, script.sql, script.params);
      results.push(result);

      if (useTransaction && !result.success) {
        throw new Error(`❌ Transaction failed at script: ${script.label}`);
      }
    }

    if (useTransaction) {
      await dbRun("COMMIT", [], "Transaction Committed");
      console.log("✅ COMMIT TRANSACTION " + new Date().toISOString());
    }
  } catch (err) {
    if (useTransaction) {
      console.error("⚠ Rolling back transaction:", err.message + " " + new Date().toISOString());
      await dbRun("ROLLBACK").catch(() => console.error("Rollback failed"));
    }

    console.error("❌ Error during script execution:", err.message + " " + new Date().toISOString());
  }

  console.log("\n🏁 All scripts completed. " + new Date().toISOString());
  return results;
}

// --------------------------------------------------
module.exports = {
  runScriptsSequentially,
  dbRun,
  dbGet,
  dbAll,
};
