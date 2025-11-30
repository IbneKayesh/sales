const express = require("express");
const router = express.Router();

const {
  runScriptsSequentially,
  dbRun,
  dbGet,
  dbAll,
} = require("../../db/asyncScriptsRunner");

// Get all units
router.get("/", async (req, res) => {
  try {
    const sql = `SELECT u.*, 0 as ismodified
    FROM units u ORDER BY unit_id`;
    const rows = await dbAll(sql, []);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching units:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get unit by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "SELECT u.*, 0 as ismodified FROM units u WHERE unit_id = ?";
    const row = await dbGet(sql, [id]);
    if (!row) {
      return res.status(404).json({ error: "Unit not found" });
    }
    res.json(row);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create new unit
router.post("/", async (req, res) => {
  const { unit_id, unit_name } = req.body;

  if (!unit_name) {
    return res.status(400).json({ error: "Unit name is required" });
  }

  if (!unit_id) {
    return res.status(400).json({ error: "Unit ID is required" });
  }

  try {
    const sql = `INSERT INTO units (unit_id, unit_name) VALUES (?, ?)`;
    const params = [unit_id, unit_name];
    await dbRun(sql, params, `Created units ${unit_name}`);
    res.status(201).json({ unit_id, ...req.body });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update unit
router.post("/update", async (req, res) => {
  const { unit_id, unit_name } = req.body;

  if (!unit_id || !unit_name) {
    return res.status(400).json({ error: "Unit ID and name are required" });
  }

  try {
    const sql = `
      UPDATE units SET
        unit_name = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE unit_id = ?
    `;
    const params = [unit_name, unit_id];
    const result = await dbRun(sql, params, `Updated units ${unit_name}`);
    if (result.changes === 0) {
      return res.status(404).json({ error: "Unit not found" });
    }
    res.json({ unit_id, unit_name });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete unit
router.post("/delete", async (req, res) => {
  const { unit_id, unit_name } = req.body;
  
  if (!unit_id) {
    return res.status(400).json({ error: "Unit ID is required" });
  }
  

  try {
    const sql = "DELETE FROM units WHERE unit_id = ?";
    const result = await dbRun(sql, [unit_id], `Deleted units ${unit_name}`);
    if (result.changes === 0) {
      return res.status(404).json({ error: "Unit not found" });
    }
    res.json({ message: "Unit deleted successfully" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
