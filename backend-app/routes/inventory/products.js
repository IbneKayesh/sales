//as example units.js
const express = require("express");
const router = express.Router();

const {
  runScriptsSequentially,
  dbRun,
  dbGet,
  dbAll,
} = require("../../db/asyncScriptsRunner");

// Get all products
router.get("/", async (req, res) => {
  const filter = req.query.filter || "default";
  let whereClause = "";

  switch (filter) {
    case "stock":
      whereClause = "WHERE p.stock_qty > 0";
      break;
    case "nstock":
      whereClause = "WHERE p.stock_qty = 0";
      break;
    case "nopp":
      whereClause = "WHERE p.purchase_price = 0";
      break;
    case "nosp":
      whereClause = "WHERE p.sales_price = 0";
      break;
    case "wd":
      whereClause = "WHERE p.discount_percent > 0";
      break;
    case "wod":
      whereClause = "WHERE p.discount_percent = 0";
      break;
    case "wvat":
      whereClause = "WHERE p.vat_percent > 0";
      break;
    case "wovat":
      whereClause = "WHERE p.vat_percent = 0";
      break;
    case "allproducts":
      whereClause = "WHERE 1 = 1";
      break;
    case "default":
    default:
      whereClause = "WHERE p.stock_qty > 0";
      break;
  }

  try {
    const sql = `SELECT p.*,
    c.category_name,
    su.unit_name as small_unit_name,
    lu.unit_name as large_unit_name,
    0 as ismodified
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.category_id
    LEFT JOIN units su ON p.small_unit_id = su.unit_id
    LEFT JOIN units lu ON p.large_unit_id = lu.unit_id
    ${whereClause}
    ORDER BY p.product_code`;
    const rows = await dbAll(sql, []);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching Products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all purchase to sales with available stock
router.get("/po2so", async (req, res) => {
  const filter = req.query.filter || "default";

  try {
    const sql = `SELECT p.product_id, p.product_code, p.product_name, p.product_desc, p.category_id, p.small_unit_id,
p.unit_difference_qty, p.large_unit_id, pod.stock_qty, p.purchase_price, pod.cost_price ,p.sales_price,
p.discount_percent, p.vat_percent, p.cost_price_percent ,p.margin_price, p.purchase_booking_qty, p.sales_booking_qty, p.created_at, p.updated_at,
    c.category_name,
    su.unit_name as small_unit_name,
    lu.unit_name as large_unit_name,
	pod.po_details_id as ref_id,
    0 as ismodified
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.category_id
    LEFT JOIN units su ON p.small_unit_id = su.unit_id
    LEFT JOIN units lu ON p.large_unit_id = lu.unit_id
	JOIN po_details pod on p.product_id = pod.product_id
	JOIN po_master pom on pod.po_master_id = pom.po_master_id
	WHERE p.stock_qty > 0
	AND pod.stock_qty > 0
	AND pom.is_posted = 1
	ORDER by p.product_id`;
    const rows = await dbAll(sql, []);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching po2so Products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all products for booking
router.get("/booking", async (req, res) => {
  try {
    const sql = `SELECT p.*,
    c.category_name,
    su.unit_name as small_unit_name,
    lu.unit_name as large_unit_name,
    0 as ismodified
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.category_id
    LEFT JOIN units su ON p.small_unit_id = su.unit_id
    LEFT JOIN units lu ON p.large_unit_id = lu.unit_id
    ORDER BY p.product_code`;
    const rows = await dbAll(sql, []);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching Products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get product by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const sql =
      "SELECT p.*, 0 as ismodified FROM products p WHERE product_id = ?";
    const row = await dbGet(sql, [id]);
    if (!row) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(row);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create new product
router.post("/", async (req, res) => {
  const {
    product_id,
    product_code,
    product_name,
    product_desc,
    category_id,
    small_unit_id,
    unit_difference_qty,
    large_unit_id,
    stock_qty,
    purchase_price,
    sales_price,
    discount_percent,
    vat_percent,
    cost_price_percent,
    margin_price
  } = req.body;

  if (!product_id) {
    return res.status(400).json({ error: "Product ID is required" });
  }

  if (!product_name) {
    return res.status(400).json({ error: "Product name is required" });
  }

  try {
    const sql = `INSERT INTO products (product_id, product_code, product_name, product_desc, category_id, small_unit_id, unit_difference_qty, large_unit_id,
    stock_qty, purchase_price, sales_price, discount_percent, vat_percent, cost_price_percent, margin_price)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [
      product_id,
      product_code,
      product_name,
      product_desc,
      category_id,
      small_unit_id,
      unit_difference_qty,
      large_unit_id,
      stock_qty,
      purchase_price,
      sales_price,
      discount_percent,
      vat_percent,
      cost_price_percent,
      margin_price,
    ];
    await dbRun(sql, params, `Created products ${product_name}`);
    res.status(201).json({ product_id, ...req.body });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update product
router.post("/update", async (req, res) => {
  const {
    product_id,
    product_code,
    product_name,
    product_desc,
    category_id,
    small_unit_id,
    unit_difference_qty,
    large_unit_id,
    purchase_price,
    sales_price,
    discount_percent,
    vat_percent,
    cost_price_percent,
    margin_price
  } = req.body;

  if (!product_name) {
    return res.status(400).json({ error: "Product name is required" });
  }

  try {
    const sql = `UPDATE products
    SET 
    product_code = ?,
    product_name = ?,
    product_desc = ?,
    category_id = ?,
    small_unit_id = ?,
    unit_difference_qty = ?,
    large_unit_id = ?,
    purchase_price = ?,
    sales_price = ?,
    discount_percent = ?,
    vat_percent = ?,
    cost_price_percent = ?,
    margin_price = ?
    WHERE product_id = ?`;
    const params = [
      product_code,
      product_name,
      product_desc,
      category_id,
      small_unit_id,
      unit_difference_qty,
      large_unit_id,
      purchase_price,
      sales_price,
      discount_percent,
      vat_percent,
      cost_price_percent,
      margin_price,
      product_id,
    ];
    const result = await dbRun(sql, params, `Updated Product ${product_name}`);
    if (result.changes === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ product_id, product_name });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete product
router.post("/delete", async (req, res) => {
  const { product_id, product_name } = req.body;

  if (!product_id) {
    return res.status(400).json({ error: "Product ID is required" });
  }

  try {
    const sql = "DELETE FROM products WHERE product_id = ?";
    const result = await dbRun(
      sql,
      [product_id],
      `Deleted Products ${product_name}`
    );
    if (result.changes === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get product by ID
router.get("/ledger/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `SELECT pobm.order_no as booking_no,pob.product_qty as booking_qty,pob.cancelled_qty,pob.invoice_qty,pob.pending_qty,
    pom.order_no, poi.product_qty, poi.returned_qty, poi.sales_qty, poi.stock_qty
    FROM po_invoice poi
    JOIN po_master pom on poi.master_id = pom.master_id
    JOIN po_booking pob on poi.booking_id = pob.booking_id
    JOIN po_master pobm on pob.master_id = pobm.master_id
    WHERE poi.stock_qty > 0
    AND poi.product_id = ?
    UNION ALL
    SELECT '-' as booking_no,0 as booking_qty,0 as cancelled_qty,0 as invoice_qty,0 as pending_qty,
    pom.order_no, poo.product_qty, poo.returned_qty, poo.sales_qty, poo.stock_qty
    FROM po_order poo
    JOIN po_master pom on poo.master_id = pom.master_id
    WHERE poo.stock_qty > 0
    AND poo.product_id = ?`;
    const row = await dbAll(sql, [id, id]);
    if (!row) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(row);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
