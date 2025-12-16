const express = require("express");
const router = express.Router();

const {
  runScriptsSequentially,
  dbRun,
  dbGet,
  dbAll,
} = require("../../db/asyncScriptsRunner");

// get all
router.get("/", async (req, res) => {
  try {
    const sql = `SELECT *
    FROM settings
    ORDER BY setting_page, setting_name`;
    const row = await dbAll(sql, []);
    if (!row) {
      return res.status(404).json({ error: "Data is not found" });
    }
    res.json(row);
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// get by page
router.get("/:id", async (req, res) => {
  try {
const { id } = req.params;

    const sql = `SELECT *
    FROM settings
    WHERE setting_page = ?
    ORDER BY setting_name`;
    const row = await dbAll(sql, [id]);
    if (!row) {
      return res.status(404).json({ error: "Data is not found" });
    }
    res.json(row);
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// update settings
router.post("/update", async (req, res) => {
  const {
    setting_id,
    setting_name,
    setting_value,
  } = req.body;

  if (!setting_id) {
    return res.status(400).json({ error: "Setting Id is required" });
  }

  if (!setting_value) {
    return res.status(400).json({ error: "Setting Value is required" });
  }

  try {
    const sql = `UPDATE settings SET
    setting_value = ?,
    updated_at = CURRENT_TIMESTAMP
    WHERE setting_id = ?`;
    const params = [
      setting_value,
      setting_id,
    ];
    const result = await dbRun(sql, params, `Updated ${setting_name}`);
    if (result.changes === 0) {
      return res.status(404).json({ error: "Settings not found" });
    }
    res.json({ setting_id, ...req.body });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
