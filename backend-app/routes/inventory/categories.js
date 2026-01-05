const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun } = require("../../db/database");

// ---------------- GET ALL CATEGORIES ----------------
router.get("/", async (req, res) => {
  try {
    const sql = `SELECT u.*, 0 as edit_stop FROM categories u ORDER BY category_name`;
    const rows = await dbGetAll(sql, [], "Get all categories");

    res.json({
      message: "Fetched all categories",
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

// ---------------- GET CATEGORY BY ID ----------------
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "SELECT u.*, 0 as edit_stop FROM categories u WHERE category_id = $1";
    const row = await dbGet(sql, [id], "Get category by id");

    if (!row) {
      return res.status(404).json({
        message: "Category not found",
        data: {},
      });
    }

    res.json({
      message: "Fetched category",
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

// ---------------- CREATE CATEGORY ----------------
router.post("/", async (req, res) => {
  const { category_id, category_name } = req.body;

  if (!category_id || !category_name) {
    return res.status(400).json({
      message: "category_id, and category_name are required",
      data: req.body,
    });
  }

  try {
    const sql = `
      INSERT INTO categories (category_id, category_name)
      VALUES ($1, $2)
    `;
    const params = [category_id, category_name];
    await dbRun(sql, params, `Created category ${category_name}`);

    res.status(201).json({
      message: "Category created successfully",
      data: req.body,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({
      message: "Internal server error",
      data: {},
    });
  }
});

// ---------------- UPDATE CATEGORY ----------------
router.post("/update", async (req, res) => {
  const { category_id, category_name } = req.body;

  if (!category_id || !category_name) {
    return res.status(400).json({
      message: "category_id, and category_name are required",
      data: req.body,
    });
  }

  try {
    const sql = `
      UPDATE categories
      SET category_name = $1,
          updated_at = CURRENT_TIMESTAMP
      WHERE category_id = $2
    `;
    const params = [category_name, category_id];
    const resultCount = await dbRun(sql, params, `Updated category ${category_name}`);

    if (resultCount === 0) {
      return res.status(404).json({
        message: "Category not found",
        data: req.body,
      });
    }

    res.json({
      message: "Category updated successfully",
      data: req.body,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({
      message: "Internal server error",
      data: {},
    });
  }
});

// ---------------- DELETE CATEGORY ----------------
router.post("/delete", async (req, res) => {
  const { category_id, category_name } = req.body;

  if (!category_id) {
    return res.status(400).json({
      message: "category_id is required",
      data: req.body,
    });
  }

  try {
    const sql = "DELETE FROM categories WHERE category_id = $1";
    const resultCount = await dbRun(sql, [category_id], `Deleted category ${category_name}`);

    if (resultCount === 0) {
      return res.status(404).json({
        message: "Category not found",
        data: req.body,
      });
    }

    res.json({
      message: "Category deleted successfully",
      data: req.body,
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({
      message: "Internal server error",
      data: {},
    });
  }
});

module.exports = router;