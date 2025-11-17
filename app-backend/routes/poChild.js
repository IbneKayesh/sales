const express = require("express");
const { db } = require("../db/init");
const router = express.Router();

// Get all purchase order children
// router.get("/", (req, res) => {
//   const sql = `
//     SELECT poc.*, i.item_name, i.unit_difference_qty, u1.unit_name as small_unit_name, u2.unit_name as big_unit_name, 0 AS ismodified
//     FROM po_child poc
//     LEFT JOIN items i ON poc.item_id = i.item_id
//     LEFT JOIN units u1 ON i.small_unit_id = u1.unit_id
//     LEFT JOIN units u2 ON i.big_unit_id = u2.unit_id
//     ORDER BY poc.id
//   `;
//   db.all(sql, [], (err, rows) => {
//     if (err) {
//       console.error("Database error:", err);
//       return res.status(500).json({ error: "Internal server error" });
//     }
//     res.json(rows);
//   });
// });

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
  const sql = `
    SELECT poc.id, poc.po_master_id, poc.item_id, poc.item_rate, poc.item_qty - IFNULL(poc_prv.item_qty, 0) AS item_qty, poc.discount_amount, poc.item_amount, poc.item_note, poc.order_qty,
    i.item_name, i.unit_difference_qty, u1.unit_name as small_unit_name, u2.unit_name as big_unit_name, 0 AS ismodified
    FROM po_child poc
    LEFT JOIN items i ON poc.item_id = i.item_id
    LEFT JOIN units u1 ON i.small_unit_id = u1.unit_id
    LEFT JOIN units u2 ON i.big_unit_id = u2.unit_id
    JOIN po_master pom on poc.po_master_id = pom.po_master_id
    LEFT JOIN po_master pom_prv on pom.order_no = pom_prv.ref_no
    LEFT JOIN po_child poc_prv on pom_prv.po_master_id = poc_prv.po_master_id
    WHERE pom.order_no = ?
    ORDER BY poc.id
  `;
  db.all(sql, [orderNo], (err, rows) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(rows);
  });
});

// Get purchase order child by ID
// router.get("/:id", (req, res) => {
//   const { id } = req.params;
//   const sql = `
//     SELECT poc.*, i.item_name, i.unit_difference_qty, u1.unit_name as small_unit_name, u2.unit_name as big_unit_name
//     FROM po_child poc
//     LEFT JOIN items i ON poc.item_id = i.item_id
//     LEFT JOIN units u1 ON i.small_unit_id = u1.unit_id
//     LEFT JOIN units u2 ON i.big_unit_id = u2.unit_id
//     WHERE poc.id = ?
//   `;
//   db.get(sql, [id], (err, row) => {
//     if (err) {
//       console.error("Database error:", err);
//       return res.status(500).json({ error: "Internal server error" });
//     }
//     if (!row) {
//       return res.status(404).json({ error: "Purchase order item not found" });
//     }
//     res.json(row);
//   });
// });

// Create new purchase order child
// router.post("/", (req, res) => {
//   const {
//     id,
//     po_master_id,
//     item_id,
//     item_rate,
//     item_qty,
//     discount_amount,
//     item_amount,
//     item_note,
//     order_qty,
//   } = req.body;

//   //console.log("- " + JSON.stringify(req.body));

//   if (
//     !id ||
//     !po_master_id ||
//     !item_id 
//     // !item_rate ||
//     // !item_qty || 
//     // !item_amount || 
//     // !order_qty 
//   ) {
//     return res
//       .status(400)
//       .json({
//         error:
//           "ID, master ID, item ID, rate, quantity, amount, and order qty are required",
//       });
//   }

//   const sql = `
//     INSERT INTO po_child (id, po_master_id, item_id, item_rate, item_qty, discount_amount, item_amount, item_note, order_qty)
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
//   `;
//   const params = [
//     id,
//     po_master_id,
//     item_id,
//     item_rate,
//     item_qty,
//     discount_amount || 0,
//     item_amount,
//     item_note || "",
//     order_qty,
//   ];

//   db.run(sql, params, function (err) {
//     if (err) {
//       console.error("Database error:", err);
//       return res.status(500).json({ error: "Internal server error" });
//     }
//     res.status(201).json({ id, ...req.body });
//   });
// });

// Update purchase order child
// router.post("/update", (req, res) => {
//   const {
//     id,
//     po_master_id,
//     item_id,
//     item_rate,
//     item_qty,
//     discount_amount,
//     item_amount,
//     item_note,
//     order_qty,
//   } = req.body;

//   if (
//     !id ||
//     !po_master_id ||
//     !item_id
//     // !item_rate ||
//     // !item_qty ||
//     // !item_amount ||
//     // !order_qty
//   ) {
//     return res
//       .status(400)
//       .json({
//         error:
//           "ID, master ID, item ID, rate, quantity, amount, and order qty are required",
//       });
//   }

//   const sql = `
//     UPDATE po_child SET
//       po_master_id = ?,
//       item_id = ?,
//       item_rate = ?,
//       item_qty = ?,
//       discount_amount = ?,
//       item_amount = ?,
//       item_note = ?,
//       order_qty = ?,
//       updated_at = CURRENT_TIMESTAMP
//     WHERE id = ?
//   `;
//   const params = [
//     po_master_id,
//     item_id,
//     item_rate,
//     item_qty,
//     discount_amount || 0,
//     item_amount,
//     item_note || "",
//     order_qty,
//     id,
//   ];

//   db.run(sql, params, function (err) {
//     if (err) {
//       console.error("Database error:", err);
//       return res.status(500).json({ error: "Internal server error" });
//     }
//     if (this.changes === 0) {
//       return res.status(404).json({ error: "Purchase order item not found" });
//     }
//     res.json({ id, ...req.body });
//   });
// });

// Delete purchase order child
// router.post("/delete", (req, res) => {
//   const { id } = req.body;

//   if (!id) {
//     return res.status(400).json({ error: "ID is required" });
//   }

//   db.run("DELETE FROM po_child WHERE id = ?", [id], function (err) {
//     if (err) {
//       console.error("Database error:", err);
//       return res.status(500).json({ error: "Internal server error" });
//     }
//     if (this.changes === 0) {
//       return res.status(404).json({ error: "Purchase order item not found" });
//     }
//     res.json({ message: "Purchase order item deleted successfully" });
//   });
// });

module.exports = router;
