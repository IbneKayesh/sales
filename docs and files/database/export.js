const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");
const { db } = require("./init");

// Function to export a table to CSV
const exportTableToCSV = (tableName, callback) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const exportPath = path.join(
    __dirname,
    `../exports/${tableName}_export_${timestamp}.csv`
  );

  // Ensure exports directory exists
  const exportDir = path.dirname(exportPath);
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
  }

  // Query all data from the table
  db.all(`SELECT * FROM ${tableName}`, [], (err, rows) => {
    if (err) {
      console.error(`Error querying table ${tableName}:`, err);
      return callback(err);
    }

    if (rows.length === 0) {
      console.log(`No data in table ${tableName}`);
      return callback(null, exportPath); // Still create empty CSV
    }

    // Get column names
    const columns = Object.keys(rows[0]);
    const csvHeader = columns.join(",") + "\n";

    // Convert rows to CSV
    const csvRows = rows
      .map((row) =>
        columns
          .map((col) => {
            const value = row[col];
            // Escape commas and quotes in values
            if (
              typeof value === "string" &&
              (value.includes(",") || value.includes('"'))
            ) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value || "";
          })
          .join(",")
      )
      .join("\n");

    const csvContent = csvHeader + csvRows;

    // Write to file
    fs.writeFile(exportPath, csvContent, "utf8", (err) => {
      if (err) {
        console.error(`Error writing CSV for ${tableName}:`, err);
        return callback(err);
      }
      console.log(`Table ${tableName} exported to: ${exportPath}`);
      callback(null, exportPath);
    });
  });
};

// Function to export all tables to CSV in a timestamped folder
const exportAllTablesToCSV = (callback) => {
  const tables = [
    "users",
    "bank_accounts",
    "contacts",
    "categories",
    "units",
    "items",
    "bank_transactions",
    "po_master",
    "po_child",
    "so_master",
    "so_child",
  ];

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const exportFolder = path.join(
    __dirname,
    `../exports/csv_backup_${timestamp}`
  );

  // Ensure exports directory exists
  if (!fs.existsSync(path.join(__dirname, "../exports"))) {
    fs.mkdirSync(path.join(__dirname, "../exports"), { recursive: true });
  }

  // Create timestamped folder for this export
  if (!fs.existsSync(exportFolder)) {
    fs.mkdirSync(exportFolder, { recursive: true });
  }

  let completed = 0;
  const results = [];
  const total = tables.length;

  tables.forEach((table) => {
    // Modified export function to use the folder path
    const exportPath = path.join(exportFolder, `${table}.csv`);

    // Query all data from the table
    db.all(`SELECT * FROM ${table}`, [], (err, rows) => {
      if (err) {
        console.error(`Error querying table ${table}:`, err);
        results.push({ table, error: err.message });
        completed++;
        if (completed === total) {
          callback(null, results);
        }
        return;
      }

      // Get column names
      const columns = Object.keys(rows[0] || {});
      const csvHeader = columns.join(",") + "\n";

      // Convert rows to CSV
      const csvRows = rows
        .map((row) =>
          columns
            .map((col) => {
              const value = row[col];
              // Escape commas and quotes in values
              if (
                typeof value === "string" &&
                (value.includes(",") || value.includes('"'))
              ) {
                return `"${value.replace(/"/g, '""')}"`;
              }
              return value || "";
            })
            .join(",")
        )
        .join("\n");

      const csvContent = csvHeader + csvRows;

      // Write to file in the timestamped folder
      fs.writeFile(exportPath, csvContent, "utf8", (err) => {
        if (err) {
          console.error(`Error writing CSV for ${table}:`, err);
          results.push({ table, error: err.message });
        } else {
          console.log(`Table ${table} exported to: ${exportPath}`);
          results.push({ table, path: exportPath });
        }
        completed++;
        if (completed === total) {
          callback(null, results);
        }
      });
    });
  });
};

module.exports = { exportTableToCSV, exportAllTablesToCSV };
