const express = require("express");
const { db } = require("../db/init");
const router = express.Router();

// Function to generate order number
function generate_order_number(order_type, callback) {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yy = String(now.getFullYear()).slice(-2);
  const datePart = dd + mm + yy;
  const prefix = order_type
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const sql = `
    SELECT MAX(CAST(SUBSTR(order_no, -5) AS INTEGER)) as max_seq
    FROM po_master
    WHERE order_type = ?
    AND strftime('%Y-%m', order_date) = strftime('%Y-%m', 'now')
  `;

  db.get(sql, [order_type], (err, row) => {
    if (err) {
      return callback(err);
    }
    const max_seq = row.max_seq || 0;
    const next_seq = max_seq + 1;
    const seq = String(next_seq).padStart(5, "0");
    const order_no = `${prefix}-${datePart}-${seq}`;
    callback(null, order_no);
  });
}

// Get all purchase order masters
router.get("/", (req, res) => {
  const sql = `
    SELECT pom.*, c.contact_name, 0 AS ismodified
    FROM po_master pom
    LEFT JOIN contacts c ON pom.contacts_id = c.contact_id
    ORDER BY pom.po_master_id DESC
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(rows);
  });
});

// Get purchase order master by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT pom.*, c.contact_name
    FROM po_master pom
    LEFT JOIN contacts c ON pom.contacts_id = c.contact_id
    WHERE pom.po_master_id = ?
  `;
  db.get(sql, [id], (err, row) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (!row) {
      return res.status(404).json({ error: "Purchase order not found" });
    }
    res.json(row);
  });
});

// Create new purchase order master
router.post("/", (req, res) => {
  const {
    po_master_id,
    order_type,
    order_date,
    contacts_id,
    ref_no,
    order_note,
    total_amount,
    paid_amount,
    is_paid,
    childs,
  } = req.body;

  if (
    !po_master_id ||
    !order_type ||
    !order_date ||
    !contacts_id ||
    !ref_no ||
    !childs ||
    !Array.isArray(childs)
  ) {
    return res.status(400).json({
      error:
        "PO Master ID, order type, order date, contacts, ref no and childs are required",
    });
  }

  //console.log("childs " + JSON.stringify(childs))

  generate_order_number(order_type, (err, order_no) => {
    if (err) {
      console.error("Error generating order number:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    const sqlMaster = `
      INSERT INTO po_master (po_master_id, order_type, order_no, order_date, contacts_id, ref_no, order_note, total_amount, paid_amount, is_paid)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const masterParams = [
      po_master_id,
      order_type,
      order_no,
      order_date,
      contacts_id,
      ref_no,
      order_note || "",
      total_amount || 0,
      paid_amount || 0,
      is_paid || 0,
    ];

    //add here // Create new purchase order child

    db.run(sqlMaster, masterParams, function (err) {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      // Insert children one by one
      const sqlChild = `
        INSERT INTO po_child 
        (id, po_master_id, item_id, item_rate, item_qty, discount_amount, item_amount, item_note, received_qty)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      childs.forEach((child) => {
        console.log("child " + JSON.stringify(child))
        const paramsChild = [
          child.id,
          po_master_id,
          child.item_id,
          child.item_rate,
          child.item_qty,
          child.discount_amount || 0,
          child.item_amount,
          child.item_note || "",
          child.received_qty,
        ];

        db.run(sqlChild, paramsChild, function (err) {
          if (err) console.error("Child insert error:", err);
        });
      });

      res.status(201).json({
        message: "Purchase Order created successfully!",
        po_master_id,
        order_no,
        childs,
      });
    });
  });
});

// Update purchase order master
router.post("/update", (req, res) => {
  const {
    po_master_id,
    order_type,
    order_no,
    order_date,
    contacts_id,
    ref_no,
    order_note,
    total_amount,
    paid_amount,
    is_paid,
    childs_create,
    childs_update,
    childs_delete,
  } = req.body;

  //console.log("req.body " + JSON.stringify(req.body))
 

  if (
    !po_master_id ||
    !order_type ||
    !order_no ||
    !order_date ||
    !contacts_id ||
    !ref_no
  ) {
    return res.status(400).json({
      error:
        "ID, order type, order no, order date, contacts, and ref no are required",
    });
  }

  const sqlMaster = `
    UPDATE po_master SET      
      order_date = ?,
      contacts_id = ?,
      ref_no = ?,
      order_note = ?,
      total_amount = ?,
      paid_amount = ?,
      is_paid = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE po_master_id = ?
  `;
  // order_type = ?,
  // order_no = ?,
  const masterParams = [
    // order_type,
    // order_no,
    order_date,
    contacts_id,
    ref_no,
    order_note || "",
    total_amount || 0,
    paid_amount || 0,
    is_paid || 0,
    po_master_id,
  ];

  db.run(sqlMaster, masterParams, function (err) {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Purchase order not found" });
    }
    // Create new purchase order child
    if (childs_create && Array.isArray(childs_create)) {
      childs_create.forEach((item) => {
        const sqlChildCreate = `
          INSERT INTO po_child (id, po_master_id, item_id, item_rate, item_qty, discount_amount, item_amount, item_note, received_qty)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const paramsChildCreate = [
          item.id,
          po_master_id,
          item.item_id,
          item.item_rate,
          item.item_qty,
          item.discount_amount || 0,
          item.item_amount,
          item.item_note || "",
          item.received_qty,
        ];
        db.run(sqlChildCreate, paramsChildCreate, function (err) {
          if (err) console.error("Child create error:", err);
        });
      });
    }
    // Update purchase order child
    if (childs_update && Array.isArray(childs_update)) {
      childs_update.forEach((item) => {
        const sqlChildUpdate = `
          UPDATE po_child SET
            item_rate = ?,
            item_qty = ?,
            discount_amount = ?,
            item_amount = ?,
            item_note = ?,
            received_qty = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `;
        const paramsChildUpdate = [
          item.item_rate,
          item.item_qty,
          item.discount_amount || 0,
          item.item_amount,
          item.item_note || "",
          item.received_qty,
          item.id,
        ];
        db.run(sqlChildUpdate, paramsChildUpdate, function (err) {
          if (err) console.error("Child update error:", err);
        });
      });
    }
    // Delete purchase order child
    if (childs_delete && Array.isArray(childs_delete)) {
      childs_delete.forEach((item) => {
        db.run("DELETE FROM po_child WHERE id = ?", [item.id], function (err) {
          if (err) console.error("Child delete error:", err);
        });
      });
    }

    res.status(201).json({
      message: "Purchase Order updated successfully!",
      po_master_id,
      order_no,
      childs_create,
      childs_update,
      childs_delete,
    });
  });
});

// Delete purchase order master
router.post("/delete", (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }

  db.run("DELETE FROM po_master WHERE po_master_id = ?", [id], function (err) {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Purchase order not found" });
    }
    res.json({ message: "Purchase order deleted successfully" });
  });
});

module.exports = router;
