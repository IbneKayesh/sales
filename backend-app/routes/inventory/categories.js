//as example units.js
const express = require("express");
const router = express.Router();

const {
  runScriptsSequentially,
  dbRun,
  dbGet,
  dbAll,
} = require("../../db/asyncScriptsRunner");

// Get all categories
router.get("/", async (req, res) => {
  try {
    const sql = `SELECT c.*, 0 as ismodified
    FROM categories c ORDER BY category_id`;
    const rows = await dbAll(sql, []);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get category by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "SELECT c.*, 0 as ismodified FROM categories c WHERE category_id = ?";
    const row = await dbGet(sql, [id]);
    if (!row) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(row);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create new category
router.post("/", async (req, res) => {
  const { category_id, category_name } = req.body;

  if (!category_name) {
    return res.status(400).json({ error: "Category name is required" });
  }

  if (!category_id) {
    return res.status(400).json({ error: "Category ID is required" });
  }

  try {
    const sql = `INSERT INTO categories (category_id, category_name) VALUES (?, ?)`;
    const params = [category_id, category_name];
    await dbRun(sql, params, `Created categories ${category_name}`);
    res.status(201).json({ category_id, ...req.body });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update category
router.post("/update", async (req, res) => {
  const { category_id, category_name } = req.body;

  if (!category_id || !category_name) {
    return res.status(400).json({ error: "Category ID and name are required" });
  }

  try {
    const sql = `
      UPDATE categories SET
        category_name = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE category_id = ?
    `;
    const params = [category_name, category_id];
    const result = await dbRun(sql, params, `Updated categories ${category_name}`);
    if (result.changes === 0) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json({ category_id, category_name });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete category
router.post("/delete", async (req, res) => {
  const { category_id, category_name } = req.body;
  
  if (!category_id) {
    return res.status(400).json({ error: "Category ID is required" });
  }
    

  try {
    const sql = "DELETE FROM categories WHERE category_id = ?";
    const result = await dbRun(sql, [category_id], `Deleted categories ${category_name}`);
    if (result.changes === 0) { 
      return res.status(404).json({ error: "Category not found" });
    }
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
