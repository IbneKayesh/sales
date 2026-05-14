const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

/**
 * Production-grade MySQL/MariaDB backup utility.
 * Uses 'docker exec' to run 'mysqldump' inside the container.
 * Outputs a compressed .sql.gz file.
 */
async function backupMySQL() {
  return new Promise((resolve, reject) => {
    try {
      // Configuration from environment variables
      const DB_NAME = process.env.DB_NAME || "shopdb";
      const DB_USER = process.env.DB_USER || "root";
      const DB_PASS = process.env.DB_PASS || "rootpass";
      const CONTAINER_NAME = "mariadb"; // Detected from docker ps

      // Setup backup directory
      const backupDir = path.join(__dirname, "..", "backups");
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }

      const timestamp = new Date()
        .toISOString()
        .replace(/T/, "_")
        .replace(/\..+/, "")
        .replace(/:/g, "-");

      const fileName = `backup_${DB_NAME}_${timestamp}.sql.gz`;
      const filePath = path.join(backupDir, fileName);

      console.log(`Starting production backup for database: ${DB_NAME}`);
      console.log(`Output file: ${filePath}`);

      // Create write stream and compression stream
      const output = fs.createWriteStream(filePath);
      const compress = zlib.createGzip();

      /**
       * mysqldump flags for production:
       * --single-transaction: Important for InnoDB to avoid locking tables
       * --routines: Include stored procedures and functions
       * --triggers: Include triggers
       * --events: Include events
       * --add-drop-table: Add DROP TABLE before CREATE TABLE (default anyway)
       * --comments: Add additional information to the dump
       */
      const dump = spawn("docker", [
        "exec",
        CONTAINER_NAME,
        "mariadb-dump",
        "-u",
        DB_USER,
        `-p${DB_PASS}`,
        "--single-transaction",
        "--routines",
        "--triggers",
        "--events",
        DB_NAME,
      ]);

      // Pipe: Dump -> Compress -> File
      dump.stdout.pipe(compress).pipe(output);

      let errorMsg = "";
      dump.stderr.on("data", (data) => {
        const msg = data.toString();
        // Ignore warnings like "Using a password on the command line interface can be insecure"
        if (!msg.toLowerCase().includes("insecure")) {
          errorMsg += msg;
        }
      });

      dump.on("close", (code) => {
        if (code === 0) {
          const stats = fs.statSync(filePath);
          console.log(
            `Backup completed successfully: ${fileName} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`,
          );
          resolve({
            success: true,
            message: "Backup created successfully",
            fileName: fileName,
            filePath: filePath,
            size: stats.size,
            timestamp: new Date(),
          });
        } else {
          console.error(`Backup failed with code ${code}. Error: ${errorMsg}`);
          // Cleanup failed file if exists
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          reject(
            new Error(`mysqldump failed with exit code ${code}: ${errorMsg}`),
          );
        }
      });

      output.on("error", (err) => {
        console.error("File write error:", err);
        reject(err);
      });
    } catch (error) {
      console.error("Backup initialization error:", error);
      reject(error);
    }
  });
}

/**
 * Lists all backup files in the backups directory.
 */
async function listBackups() {
  const backupDir = path.join(__dirname, "..", "backups");
  if (!fs.existsSync(backupDir)) {
    return [];
  }

  const files = fs.readdirSync(backupDir);
  const backups = files
    .filter((file) => file.endsWith(".sql.gz"))
    .map((file) => {
      const filePath = path.join(backupDir, file);
      const stats = fs.statSync(filePath);
      return {
        id: file, // Using filename as ID for deletion
        name: file,
        size: stats.size,
        createdAt: stats.birthtime,
      };
    })
    .sort((a, b) => b.createdAt - a.createdAt);

  return backups;
}

/**
 * Deletes a specific backup file.
 */
async function deleteBackup(fileName) {
  const backupDir = path.join(__dirname, "..", "backups");
  const filePath = path.join(backupDir, fileName);

  if (!fs.existsSync(filePath)) {
    throw new Error("Backup file not found");
  }

  fs.unlinkSync(filePath);
  return { success: true, message: "Backup deleted successfully" };
}

module.exports = { backupMySQL, listBackups, deleteBackup };
