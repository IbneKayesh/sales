const express = require("express");
const { db } = require("../db/init");
const { param } = require("./poMaster");
const router = express.Router();
const {
  runScriptsSequentially,
  dbRun,
  dbGet,
} = require("../db/asyncScriptsRunner.js");

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

// Get purchase order children by supplier :: Purchase Receive
router.get("/booking/:supplierId", (req, res) => {
  const { supplierId } = req.params;
  
  const sql = `SELECT poc.id,'sgd' po_master_id, poc.item_id,poc.item_rate,
poc.booking_qty - SUM(ifnull(pocb.order_qty,0)) booking_qty, poc.booking_qty - SUM(ifnull(pocb.order_qty,0)) order_qty,
poc.discount_percent, poc.discount_amount, poc.item_rate * (poc.booking_qty - SUM(ifnull(pocb.order_qty,0))) item_amount, poc.cost_rate, poc.item_note, poc.id ref_id, poc.created_at, poc.updated_at,
i.item_name, i.unit_difference_qty, u1.unit_name as small_unit_name, u2.unit_name as big_unit_name, 0 AS ismodified
    FROM po_child poc
    JOIN po_master pom on poc.po_master_id = pom.po_master_id
    LEFT JOIN items i ON poc.item_id = i.item_id
    LEFT JOIN units u1 ON i.small_unit_id = u1.unit_id
    LEFT JOIN units u2 ON i.big_unit_id = u2.unit_id
    LEFT JOIN po_child pocb on poc.id = pocb.ref_id
    WHERE pom.order_type = 'Purchase Booking'
    AND pom.contact_id = ?
    AND pom.is_posted = 1
    AND pom.is_completed = 0
    GROUP BY poc.id, poc.item_id,poc.item_rate,poc.booking_qty, poc.booking_qty,
    poc.discount_percent, poc.discount_amount, poc.item_amount, poc.cost_rate, poc.item_note,
    poc.created_at, poc.updated_at,i.item_name, i.unit_difference_qty, u1.unit_name, u2.unit_name
    HAVING poc.booking_qty - SUM(ifnull(pocb.order_qty,0)) > 0
    ORDER BY poc.id`;
  db.all(sql, [supplierId], (err, rows) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(rows);
  });
});

async function updateBillsPaidStatus() {
  // 1. Get all bills in the order they were created
  const bills = await dbAll(`
    SELECT id, bill_amount, paid_amount
    FROM bills
    ORDER BY id ASC
  `);

  let cumulativeBills = 0;
  let cumulativePaid = 0;

  for (const bill of bills) {
    cumulativeBills += bill.bill_amount;
    cumulativePaid += bill.paid_amount;

    const isPaid = cumulativePaid >= cumulativeBills ? 1 : 0;

    await dbRun(`UPDATE bills SET is_paid = ? WHERE id = ?`, [isPaid, bill.id]);
  }

  console.log("✔ Bill payment status updated!");
}

// Get purchase order children by supplier
router.get("/returns/:supplierId", (req, res) => {
  const { supplierId } = req.params;
  const sql = `SELECT poc.id,'sgd' po_master_id, poc.item_id,poc.item_rate,
poc.order_qty - SUM(ifnull(pocb.order_qty,0)) booking_qty, poc.order_qty - SUM(ifnull(pocb.order_qty,0)) order_qty,
poc.discount_percent, poc.discount_amount, poc.item_rate * (poc.order_qty - SUM(ifnull(pocb.order_qty,0))) item_amount,
poc.cost_rate, poc.item_note, poc.id ref_id, poc.created_at, poc.updated_at,
i.item_name, i.unit_difference_qty, u1.unit_name as small_unit_name, u2.unit_name as big_unit_name, 0 AS ismodified
	FROM po_child poc
    JOIN po_master pom on poc.po_master_id = pom.po_master_id
    LEFT JOIN items i ON poc.item_id = i.item_id
    LEFT JOIN units u1 ON i.small_unit_id = u1.unit_id
    LEFT JOIN units u2 ON i.big_unit_id = u2.unit_id
    LEFT JOIN po_child pocb on poc.id = pocb.ref_id
    WHERE pom.order_type IN ('Purchase Receive','Purchase Order')
    AND pom.contact_id = ?
    AND pom.is_posted = 1
    AND pom.is_paid = 1
    AND pom.is_completed = 1
    GROUP BY poc.id, poc.item_id,poc.item_rate,poc.booking_qty, poc.booking_qty,
    poc.discount_percent, poc.discount_amount, poc.item_amount, poc.cost_rate, poc.item_note,
    poc.created_at, poc.updated_at,i.item_name, i.unit_difference_qty, u1.unit_name, u2.unit_name
    HAVING poc.order_qty - SUM(ifnull(pocb.order_qty,0)) > 0
    ORDER BY poc.id`;
  db.all(sql, [supplierId], (err, rows) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(rows);
  });
});

module.exports = router;
