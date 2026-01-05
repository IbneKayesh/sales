const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun } = require("../../db/database");

// ---------------- GET ALL UNITS ----------------
router.get("/", async (req, res) => {
  try {
    const sql = `SELECT u.*, 0 as edit_stop FROM units u ORDER BY unit_name`;
    const rows = await dbGetAll(sql, [], "Get all units");

    res.json({
      message: "Fetched all units",
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({
      message: "Internal server error",
      data: [],
    });
  }
});

// ---------------- GET UNIT BY ID ----------------
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "SELECT u.*, 0 as edit_stop FROM units u WHERE unit_id = $1";
    const row = await dbGet(sql, [id], "Get unit by id");

    if (!row) {
      return res.status(404).json({
        message: "Unit not found",
        data: {},
      });
    }

    res.json({
      message: "Fetched unit",
      data: row,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({
      message: "Internal server error",
      data: {},
    });
  }
});

// ---------------- CREATE UNIT ----------------
router.post("/", async (req, res) => {
  const { unit_id, unit_name } = req.body;

  if (!unit_id || !unit_name) {
    return res.status(400).json({
      message: "unit_id, unit_name are required",
      data: req.body,
    });
  }

  try {
    const sql = `
      INSERT INTO units (unit_id, unit_name)
      VALUES ($1, $2)
    `;
    const params = [unit_id, unit_name];
    await dbRun(sql, params, `Created unit ${unit_name}`);

    res.status(201).json({
      message: "Unit created successfully",
      data: req.body,
    });
  } catch (error) {
    console.error("Error creating unit:", error);
    res.status(500).json({
      message: "Internal server error",
      data: {},
    });
  }
});

// ---------------- UPDATE UNIT ----------------
router.post("/update", async (req, res) => {
  const { unit_id, unit_name } = req.body;

  if (!unit_id || !unit_name) {
    return res.status(400).json({
      message: "unit_id, unit_name are required",
      data: req.body,
    });
  }

  try {
    const sql = `
      UPDATE units
      SET unit_name = $1,
          updated_at = CURRENT_TIMESTAMP
      WHERE unit_id = $2
    `;
    const params = [unit_name, unit_id];
    const resultCount = await dbRun(sql, params, `Updated unit ${unit_name}`);

    if (resultCount === 0) {
      return res.status(404).json({
        message: "Unit not found",
        data: req.body,
      });
    }

    res.json({
      message: "Unit updated successfully",
      data: req.body,
    });
  } catch (error) {
    console.error("Error updating unit:", error);
    res.status(500).json({
      message: "Internal server error",
      data: {},
    });
  }
});

// ---------------- DELETE UNIT ----------------
router.post("/delete", async (req, res) => {
  const { unit_id, unit_name } = req.body;

  if (!unit_id) {
    return res.status(400).json({
      message: "unit_id is required",
      data: req.body,
    });
  }

  try {
    const sql = "DELETE FROM units WHERE unit_id = $1";
    const resultCount = await dbRun(sql, [unit_id], `Deleted unit ${unit_name}`);

    if (resultCount === 0) {
      return res.status(404).json({
        message: "Unit not found",
        data: req.body,
      });
    }

    res.json({
      message: "Unit deleted successfully",
      data: req.body,
    });
  } catch (error) {
    console.error("Error deleting unit:", error);
    res.status(500).json({
      message: "Internal server error",
      data: {},
    });
  }
});


module.exports = router;
