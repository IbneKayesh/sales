const express = require("express");
const { db } = require("../db/init");
const router = express.Router();

// Get all items
router.get("/", (req, res) => {
  const filter = req.query.filter || "default";
  let whereClause = "";

  switch (filter) {
    case "booking":
      whereClause = "WHERE i.booking_qty > 0";
      break;
    case "stock":
      whereClause = "WHERE i.stock_qty > 0";
      break;
    case "nillstock":
      whereClause = "WHERE i.stock_qty < 1";
      break;
    case "nopr":
      whereClause = "WHERE i.purchase_rate = 0";
      break;
    case "nosr":
      whereClause = "WHERE i.sales_rate = 0";
      break;
    case "wd":
      whereClause = "WHERE i.discount_percent > 0";
      break;
    case "wod":
      whereClause = "WHERE i.discount_percent = 0";
      break;
    case "allitems":
      whereClause = "WHERE 1 = 1";
      break;
    case "default":
    default:
      whereClause = "WHERE i.stock_qty > 0";
      break;
  }

  const sql = `
    SELECT i.*, su.unit_name as small_unit_name, bu.unit_name as big_unit_name, c.category_name, 0 AS ismodified
    FROM items i
    LEFT JOIN units su ON i.small_unit_id = su.unit_id
    LEFT JOIN units bu ON i.big_unit_id = bu.unit_id
    LEFT JOIN categories c ON i.category_id = c.category_id
     ${whereClause}
    ORDER BY i.booking_qty DESC, i.stock_qty DESC
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(rows);
  });
});

