const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun } = require("../../db/database");

// ---------------- GET ALL PRODUCTS ----------------
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
    sp.shop_name,
    0 as edit_stop
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.category_id
    LEFT JOIN units su ON p.small_unit_id = su.unit_id
    LEFT JOIN units lu ON p.large_unit_id = lu.unit_id
    LEFT JOIN shops sp ON p.shop_id = sp.shop_id
    ${whereClause}
    ORDER BY p.product_name, p.product_code`;

    const rows = await dbGetAll(sql, [], "Get all products");

    res.json({
      message: "Fetched all products",
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
    0 as edit_stop
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
    0 as edit_stop
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

// ---------------- GET PRODUCT BY ID ----------------
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const sql =
      "SELECT p.*, 0 as edit_stop FROM products p WHERE product_id = ?";
    const row = await dbGet(sql, [id], "Get product by id");

    if (!row) {
      return res.status(404).json({
        message: "Product not found",
        data: {},
      });
    }

    res.json({
      message: "Fetched product",
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

// ---------------- CREATE NEW PRODUCT ----------------
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
    margin_price,
    shop_id,
  } = req.body;

  if (!product_id || !product_name || !shop_id) {
    return res.status(400).json({
      message: "product_id, product_name and shop_id are required",
      data: req.body,
    });
  }

  try {
    const sql = `INSERT INTO products (product_id, product_code, product_name, product_desc, category_id, small_unit_id, unit_difference_qty, large_unit_id,
    stock_qty, purchase_price, sales_price, discount_percent, vat_percent, cost_price_percent, margin_price, shop_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`;
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
      shop_id,
    ];
    await dbRun(sql, params, `Created product ${product_name}`);

    res.status(201).json({
      message: "Product created successfully",
      data: req.body,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      message: "Internal server error",
      data: {},
    });
  }
});

// ---------------- UPDATE PRODUCT ----------------
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
    margin_price,
    shop_id,
  } = req.body;

  if (!product_id || !product_name || !shop_id) {
    return res.status(400).json({
      message: "product_id, product_name and shop_id are required",
      data: req.body,
    });
  }

  try {
    const sql = `UPDATE products
    SET 
    product_code = $1,
    product_name = $2,
    product_desc = $3,
    category_id = $4,
    small_unit_id = $5,
    unit_difference_qty = $6,
    large_unit_id = $7,
    purchase_price = $8,
    sales_price = $9,
    discount_percent = $10,
    vat_percent = $11,
    cost_price_percent = $12,
    margin_price = $13,
    shop_id = $14
    WHERE product_id = $15`;
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
      shop_id,
      product_id,
    ];
    const resultCount = await dbRun(
      sql,
      params,
      `Updated product ${product_name}`
    );

    if (resultCount === 0) {
      return res.status(404).json({
        message: "Product not found",
        data: req.body,
      });
    }

    res.json({
      message: "Product updated successfully",
      data: req.body,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      message: "Internal server error",
      data: {},
    });
  }
});

// ---------------- DELETE PRODUCT ----------------
router.post("/delete", async (req, res) => {
  const { product_id, product_name } = req.body;

  if (!product_id) {
    return res.status(400).json({
      message: "product_id is required",
      data: req.body,
    });
  }

  try {
    const sql = `DELETE FROM products WHERE product_id = $1`;
    const params = [product_id];

    const resultCount = await dbRun(
      sql,
      params,
      `Deleted product ${product_name}`
    );

    if (resultCount === 0) {
      return res.status(404).json({
        message: "Product not found",
        data: req.body,
      });
    }

    res.json({
      message: "Product deleted successfully",
      data: req.body,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      message: "Internal server error",
      data: {},
    });
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
