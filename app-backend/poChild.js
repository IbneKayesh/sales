const express = require("express");
const { db } = require("../db/init");
const { param } = require("./poMaster");
const router = express.Router();
const {
  runScriptsSequentially,
  dbRun,
  dbGet,
} = require("../db/asyncScriptsRunner.js");


// Get purchase order children by supplier :: Purchase Receive
router.get("/booking/:supplierId", (req, res) => {
  const { supplierId } = req.params;
const sql  = `WITH 
            filtered_master as (
              SELECT po_master_id
              FROM po_master
              WHERE is_posted = 1
              AND is_completed = 0
              AND order_type = 'Purchase Booking'
              AND contact_id = ?
            ),
            filtered_child as (
            SELECT *
            FROM po_child poc
            JOIN filtered_master pom on poc.po_master_id = pom.po_master_id
            ),
            order_sum as (
            SELECT poc.ref_id,
            sum(ifnull(poc.order_qty,0))order_qty
            FROM po_child poc
            JOIN filtered_child p1 on poc.ref_id = p1.id
            GROUP by poc.ref_id
            ),
            remain_poc as (
            SELECT poc.id,poc.item_id, poc.item_rate,
            poc.booking_qty - ifnull(os.order_qty,0) as booking_qty,
            poc.booking_qty - ifnull(os.order_qty,0) as order_qty,
            poc.discount_percent,
            ((poc.booking_qty - IFNULL(os.order_qty,0)) * poc.item_rate * poc.discount_percent / 100.0) AS discount_amount,
            ((poc.booking_qty - IFNULL(os.order_qty,0)) * poc.item_rate) AS item_amount,
            poc.cost_rate, poc.item_note,
            poc.id as ref_id, poc.created_at, poc.updated_at
            FROM filtered_child poc
            LEFT JOIN order_sum os on poc.id = os.ref_id
            )
            SELECT poc.id, 'sgd' as po_master_id, poc.item_id, poc.item_rate, poc.booking_qty, poc.order_qty, ROUND(poc.discount_percent,2) AS discount_percent,
            ROUND(poc.discount_amount,2) AS discount_amount, ROUND(poc.item_amount - poc.discount_amount,2) AS item_amount, ROUND(poc.cost_rate,2) AS cost_rate,
            poc.item_note, poc.ref_id, poc.created_at, poc.updated_at,
            itm.item_name, itm.unit_difference_qty, u1.unit_name AS small_unit_name, u2.unit_name AS big_unit_name,  0 AS ismodified
            FROM remain_poc poc
            LEFT JOIN items itm ON poc.item_id = itm.item_id
            LEFT JOIN units u1 ON itm.small_unit_id = u1.unit_id
            LEFT JOIN units u2 ON itm.big_unit_id = u2.unit_id
            WHERE poc.booking_qty > 0`;


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

// Get purchase order children by orderNo
router.get("/returns/:orderNo", (req, res) => {
  const { orderNo } = req.params;
  const sql = `WITH 
            filtered_master as (
              SELECT po_master_id
              FROM po_master
              WHERE is_posted = 1
              AND is_completed = 1
              AND order_type in ( 'Purchase Receive', 'Purchase Order')
              AND order_no = ?
            ),
            filtered_child as (
            SELECT *
            FROM po_child poc
            JOIN filtered_master pom on poc.po_master_id = pom.po_master_id
            ),
            order_sum as (
            SELECT poc.ref_id,
            sum(ifnull(poc.order_qty,0))order_qty
            FROM po_child poc
            JOIN filtered_child p1 on poc.ref_id = p1.id
            GROUP by poc.ref_id
            ),
            remain_poc as (
            SELECT poc.id,poc.item_id, poc.item_rate,
            poc.booking_qty - ifnull(os.order_qty,0) as booking_qty,
            poc.booking_qty - ifnull(os.order_qty,0) as order_qty,
            poc.discount_percent,
            ((poc.booking_qty - IFNULL(os.order_qty,0)) * poc.item_rate * poc.discount_percent / 100.0) AS discount_amount,
            ((poc.booking_qty - IFNULL(os.order_qty,0)) * poc.item_rate) AS item_amount,
            poc.cost_rate, poc.item_note,
            poc.id as ref_id, poc.created_at, poc.updated_at
            FROM filtered_child poc
            LEFT JOIN order_sum os on poc.id = os.ref_id
            )
            SELECT poc.id, 'sgd' as po_master_id, poc.item_id, poc.item_rate, poc.booking_qty, poc.order_qty, ROUND(poc.discount_percent,2) AS discount_percent,
            ROUND(poc.discount_amount,2) AS discount_amount, ROUND(poc.item_amount - poc.discount_amount,2) AS item_amount, ROUND(poc.cost_rate,2) AS cost_rate,
            poc.item_note, poc.ref_id, poc.created_at, poc.updated_at,
            itm.item_name, itm.unit_difference_qty, u1.unit_name AS small_unit_name, u2.unit_name AS big_unit_name,  0 AS ismodified
            FROM remain_poc poc
            LEFT JOIN items itm ON poc.item_id = itm.item_id
            LEFT JOIN units u1 ON itm.small_unit_id = u1.unit_id
            LEFT JOIN units u2 ON itm.big_unit_id = u2.unit_id
            WHERE poc.booking_qty > 0`;
  db.all(sql, [orderNo], (err, rows) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(rows);
  });
});

module.exports = router;
