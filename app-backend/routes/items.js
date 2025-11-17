const express = require("express");
const { db } = require("../db/init");
const router = express.Router();

// Get all items
router.get("/", (req, res) => {
  const sql = `
    SELECT i.*, su.unit_name as small_unit_name, bu.unit_name as big_unit_name, c.category_name, 0 AS ismodified
    FROM items i
    LEFT JOIN units su ON i.small_unit_id = su.unit_id
    LEFT JOIN units bu ON i.big_unit_id = bu.unit_id
    LEFT JOIN categories c ON i.category_id = c.category_id
    ORDER BY i.item_id
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(rows);
  });
});

// Get item by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM items WHERE item_id = ?", [id], (err, row) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (!row) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json(row);
  });
});

// Create new item
router.post("/", (req, res) => {
  const {
    item_id,
    item_name,
    item_description,
    category_id,
    small_unit_id,
    unit_difference_qty,
    big_unit_id,
    order_qty,
    stock_qty,
    purchase_rate,
    sales_rate,
    discount_percent,
    margin_rate,
  } = req.body;

  if (!item_name) {
    return res.status(400).json({ error: "Item name is required" });
  }

  if (!item_id) {
    return res.status(400).json({ error: "Item ID is required" });
  }

  const sql = `
    INSERT INTO items (
      item_id, item_name, item_description, category_id, small_unit_id, unit_difference_qty,
      big_unit_id, order_qty, stock_qty, purchase_rate, sales_rate, discount_percent, margin_rate
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    item_id,
    item_name,
    item_description || "",
    category_id || null,
    small_unit_id || null,
    unit_difference_qty || 1,
    big_unit_id || null,
    order_qty || 0,
    stock_qty || 0,
    purchase_rate || 0,
    sales_rate || 0,
    discount_percent || 0,
    margin_rate || 0,
  ];

  db.run(sql, params, function (err) {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.status(201).json({ item_id, ...req.body });
  });
});

// Update item
router.post("/update", (req, res) => {
  const {
    id,
    item_name,
    item_description,
    category_id,
    small_unit_id,
    unit_difference_qty,
    big_unit_id,
    order_qty,
    stock_qty,
    purchase_rate,
    sales_rate,
    discount_percent,
    margin_rate,
  } = req.body;

  if (!id || !item_name) {
    return res.status(400).json({ error: "Item ID and name are required" });
  }

  const sql = `
    UPDATE items SET
      item_name = ?,
      item_description = ?,
      category_id = ?,
      small_unit_id = ?,
      unit_difference_qty = ?,
      big_unit_id = ?,
      purchase_rate = ?,
      sales_rate = ?,
      discount_percent = ?,
      margin_rate = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE item_id = ?
  `;

  // order_qty = ?,
  // stock_qty = ?,

  const params = [
    item_name,
    item_description || "",
    category_id || null,
    small_unit_id || null,
    unit_difference_qty || 1,
    big_unit_id || null,
    // order_qty || 0,
    // stock_qty || 0,
    purchase_rate || 0,
    sales_rate || 0,
    discount_percent || 0,
    margin_rate || 0,
    id,
  ];

  db.run(sql, params, function (err) {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json({
      item_id: id,
      item_name,
      item_description,
      small_unit_id,
      unit_difference_qty,
      big_unit_id,
      order_qty,
      stock_qty,
      purchase_rate,
      sales_rate,
      discount_percent,
      margin_rate,
    });
  });
});

// Delete item
router.post("/delete", (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Item ID is required" });
  }

  db.run("DELETE FROM items WHERE item_id = ?", [id], function (err) {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json({ message: "Item deleted successfully" });
  });
});

module.exports = router;
