const express = require("express");
const { db } = require("../db/init");
const router = express.Router();

// Get purchase order children by master ID
router.get("/master/:masterId", (req, res) => {
  const { masterId } = req.params;
  const sql = `
    SELECT poc.*, i.item_name, i.unit_difference_qty, u1.unit_name as small_unit_name, u2.unit_name as big_unit_name, 0 AS ismodified
    FROM po_child poc
    LEFT JOIN items i ON poc.item_id = i.item_id
    LEFT JOIN units u1 ON i.small_unit_id = u1.unit_id
    LEFT JOIN units u2 ON i.big_unit_id = u2.unit_id
    WHERE poc.po_master_id = ?
    ORDER BY poc.id
  `;
  db.all(sql, [masterId], (err, rows) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(rows);
  });
});

// Get purchase order children by order no
router.get("/order/:orderNo", (req, res) => {
  const { orderNo } = req.params;
  const sql = `SELECT poc.id, 'sgd' AS po_master_id,poc.item_id, poc.item_rate,(poc.item_qty - poc.received_qty) AS item_qty, 0 AS discount_amount,
(poc.item_qty - poc.received_qty) * item_rate AS item_amount,'' item_note, (poc.item_qty - poc.received_qty) AS received_qty,
poc.created_at, poc.updated_at,
i.item_name, i.unit_difference_qty, u1.unit_name as small_unit_name, u2.unit_name as big_unit_name, 0 AS ismodified
FROM po_child poc
JOIN po_master pom ON poc.po_master_id  = pom.po_master_id
LEFT JOIN items i ON poc.item_id = i.item_id
LEFT JOIN units u1 ON i.small_unit_id = u1.unit_id
 LEFT JOIN units u2 ON i.big_unit_id = u2.unit_id
WHERE pom.order_no = ?
ORDER BY poc.id`;
  db.all(sql, [orderNo], (err, rows) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(rows);
  });
});

module.exports = router;
