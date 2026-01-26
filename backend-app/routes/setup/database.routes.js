const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const {
  backupMySQL,
  listBackups,
  deleteBackup,
} = require("../../db/mysqlBackup");

// Create backup
router.post("/create-backup", async (req, res) => {
  try {
    const backupResult = await backupMySQL();
    res.json({
      success: true,
      message: "Backup created successfully",
      data: backupResult,
    });
  } catch (error) {
    console.error("database backup error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "An error occurred during database backup",
      data: null,
    });
  }
});

// Get all backups
router.post("/get-backup", async (req, res) => {
  try {
    const backups = await listBackups();
    res.json({
      success: true,
      message: "Backups retrieved successfully",
      data: backups,
    });
  } catch (error) {
    console.error("list backups error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "An error occurred while listing backups",
      data: [],
    });
  }
});

// Delete backup
router.post("/delete-backup", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Backup name is required" });
    }
    const result = await deleteBackup(name);
    res.json(result);
  } catch (error) {
    console.error("delete backup error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "An error occurred while deleting backup",
      data: null,
    });
  }
});

// Download backup
router.get("/download-backup/:name", (req, res) => {
  try {
    const { name } = req.params;
    const backupDir = path.join(__dirname, "..", "..", "backups");
    const filePath = path.join(backupDir, name);

    if (!fs.existsSync(filePath)) {
      return res
        .status(404)
        .json({ success: false, message: "Backup file not found" });
    }

    res.download(filePath, name, (err) => {
      if (err) {
        console.error("error downloading backup:", err);
        if (!res.headersSent) {
          res
            .status(500)
            .json({ success: false, message: "Error downloading file" });
        }
      }
    });
  } catch (error) {
    console.error("download backup error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
