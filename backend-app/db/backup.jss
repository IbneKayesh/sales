const fs = require("fs");
const { pool } = require("./database"); // your db connection

async function backupDB() {
  try {
    const tables = ["shops", "users"];
    for (const table of tables) {
      const { rows } = await pool.query(`SELECT * FROM ${table}`);
      const csv = rows.map(row => Object.values(row).join(",")).join("\n");
      fs.writeFileSync(`./backup_${table}_${Date.now()}.csv`, csv);
      console.log(`Backup for table ${table} done`);
    }
  } catch (err) {
    console.error("Backup failed:", err);
  }
}

backupDB();
