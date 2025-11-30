const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");
const { db } = require("./init");

// Function to backup the database
const backupDB = (callback) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = path.join(
    __dirname,
    `../backups/database_backup_${timestamp}.db`
  );
  const dbPath = path.join(__dirname, "../database.db");

  // Ensure backups directory exists
  const backupDir = path.dirname(backupPath);
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  // Copy the database file directly to ensure all data is included
  fs.copyFile(dbPath, backupPath, (err) => {
    if (err) {
      console.error("Backup failed:", err);
      return callback(err);
    }
    console.log(`Database backed up to: ${backupPath}`);
    callback(null, backupPath);
  });
};

// Function to restore the database from a backup file
const restoreDB = (backupPath, callback) => {
  const dbPath = path.join(__dirname, "../database.db");

  // Close the current database connection
  db.close((err) => {
    if (err) {
      console.error("Error closing database:", err);
      return callback(err);
    }

    // Copy the backup file to the database location
    fs.copyFile(backupPath, dbPath, (err) => {
      if (err) {
        console.error("Error restoring database:", err);
        return callback(err);
      }

      console.log(`Database restored from: ${backupPath}`);

      // Reinitialize the database connection
      const newDb = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error("Error reopening database:", err);
          return callback(err);
        }

        // Update the exported db reference
        module.exports.db = newDb;

        // Update the db reference in init.js if needed
        require("../../app-backend/db/init").db = newDb;

        console.log("Database connection restored.");
        callback(null);
      });
    });
  });
};

module.exports = { backupDB, restoreDB };
