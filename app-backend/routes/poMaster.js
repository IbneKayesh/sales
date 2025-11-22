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
  const orderType = req.query.orderType || "-";
  const filter = req.query.filter || "default";
  let whereClause = "";

  if (orderType) {
    whereClause = "WHERE pom.order_type = '" + orderType + "' ";
  }

  switch (filter) {
    case "7days":
      whereClause +=
        "AND pom.is_paid = 1 AND pom.is_posted = 1 AND pom.is_completed = 1 AND pom.order_date >= date('now', '-7 days')";
      break;
    case "30days":
      whereClause +=
        "AND pom.is_paid = 1 AND pom.is_posted = 1 AND pom.is_completed = 1 AND pom.order_date >= date('now', '-30 days')";
      break;
    case "90days":
      whereClause +=
        "AND pom.is_paid = 1 AND pom.is_posted = 1 AND pom.is_completed = 1 AND pom.order_date >= date('now', '-90 days')";
      break;
    case "alldays":
      whereClause +=
        "AND pom.is_paid = 1 AND pom.is_posted = 1 AND pom.is_completed = 1";
      break;
    case "default":
    default:
      whereClause +=
        "AND ((pom.is_paid = 0 AND pom.is_posted = 0 AND pom.is_completed = 0) OR (pom.order_date = date('now')))";
      break;
  }
  const sql = `
    SELECT pom.*, c.contact_name, is_posted AS isedit , 0 AS ismodified
    FROM po_master pom
    LEFT JOIN contacts c ON pom.contacts_id = c.contact_id
    ${whereClause}
    ORDER BY pom.is_paid ASC, pom.is_completed ASC
  `;
  //console.log(sql);

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
    order_amount,
    discount_amount,
    total_amount,
    paid_amount,
    cost_amount,
    is_paid,
    is_posted,
    is_completed,
    childs_create,
  } = req.body;

  if (
    !po_master_id ||
    !order_type ||
    !order_date ||
    !contacts_id ||
    !childs_create ||
    !Array.isArray(childs_create)
  ) {
    return res.status(400).json({
      error:
        "Master ID, order type, order date, contacts and childs are required",
    });
  }

  //console.log("childs_create " + JSON.stringify(childs_create))

  generate_order_number(order_type, (err, order_no) => {
    if (err) {
      console.error("Error generating order number:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    const sqlMaster = `
      INSERT INTO po_master (po_master_id, order_type, order_no, order_date, contacts_id, ref_no, order_note, order_amount, discount_amount, total_amount, paid_amount, cost_amount, is_paid, is_posted)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const masterParams = [
      po_master_id,
      order_type,
      order_no,
      order_date,
      contacts_id,
      ref_no || "",
      order_note || "",
      order_amount || 0,
      discount_amount || 0,
      total_amount || 0,
      paid_amount || 0,
      cost_amount || 0,
      is_paid || 0,
      is_posted || 0,
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
        (id, po_master_id, item_id, item_rate, booking_qty, order_qty, discount_percent, discount_amount, item_amount, cost_rate, item_note, ref_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      childs_create.forEach((child) => {
        //console.log("child " + JSON.stringify(child));
        const itemQty = order_type === "";
        const paramsChild = [
          child.id,
          po_master_id,
          child.item_id,
          child.item_rate,
          child.booking_qty || 0,
          child.order_qty || 0,
          child.discount_percent || 0,
          child.discount_amount || 0,
          child.item_amount || 0,
          child.cost_rate || 0,
          child.item_note || "",
          child.ref_id || "",
        ];

        db.run(sqlChild, paramsChild, function (err) {
          if (err) console.error("Child insert error:", err);

          //execute invoice data processing
          //processInvoiceData(po_master_id, order_type, ref_no);
        });
      });

      res.status(201).json({
        message: "Purchase Order created successfully!",
        po_master_id,
        order_no,
        childs_create,
      });
    });
  });
});

// Update purchase order master
router.post("/update", (req, res) => {
  const {
    po_master_id,
    order_type,
    order_date,
    contacts_id,
    ref_no,
    order_note,
    order_amount,
    discount_amount,
    total_amount,
    paid_amount,
    cost_amount,
    is_paid,
    is_posted,
    is_completed,
    childs_create,
    childs_update,
    childs_delete,
  } = req.body;

  //console.log("req.body " + JSON.stringify(req.body))

  if (!po_master_id || !order_type || !order_date || !contacts_id) {
    return res.status(400).json({
      error:
        "Master ID, order type, order date, contacts and childs are required",
    });
  }

  const sqlMaster = `
    UPDATE po_master SET      
      order_date = ?,
      contacts_id = ?,
      ref_no = ?,
      order_note = ?,
      order_amount = ?,
      discount_amount = ?,
      total_amount = ?,
      paid_amount = ?,
      cost_amount = ?,
      is_paid = ?,
      is_posted = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE po_master_id = ?
  `;

  const masterParams = [
    order_date,
    contacts_id,
    ref_no || "",
    order_note || "",
    order_amount || 0,
    discount_amount || 0,
    total_amount || 0,
    paid_amount || 0,
    cost_amount || 0,
    is_paid || 0,
    is_posted || 0,
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
      childs_create.forEach((child) => {
        const sqlChildCreate = `
        INSERT INTO po_child 
        (id, po_master_id, item_id, item_rate, booking_qty, order_qty, discount_percent, discount_amount, item_amount, cost_rate, item_note, ref_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const paramsChildCreate = [
          child.id,
          po_master_id,
          child.item_id,
          child.item_rate,
          child.booking_qty || 0,
          child.order_qty || 0,
          child.discount_percent || 0,
          child.discount_amount || 0,
          child.item_amount || 0,
          child.cost_rate || 0,
          child.item_note || "",
          child.ref_id || "",
        ];
        db.run(sqlChildCreate, paramsChildCreate, function (err) {
          if (err) console.error("Child create error:", err);
        });
      });
    }
    // Update purchase order child
    if (childs_update && Array.isArray(childs_update)) {
      childs_update.forEach((child) => {
        const sqlChildUpdate = `
          UPDATE po_child SET
            item_rate = ?,
            booking_qty = ?,
            order_qty = ?,
            discount_percent = ?,
            discount_amount = ?,
            item_amount = ?,
            cost_rate = ?,
            item_note = ?,
            ref_id = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `;
        const paramsChildUpdate = [
          child.item_rate,
          child.booking_qty,
          child.order_qty,
          child.discount_percent || 0,
          child.discount_amount || 0,
          child.item_amount,
          child.cost_rate,
          child.item_note || "",
          child.ref_id || "",
          child.id,
        ];
        db.run(sqlChildUpdate, paramsChildUpdate, function (err) {
          if (err) console.error("Child update error:", err);
        });
      });
    }
    // Delete purchase order child
    if (childs_delete && Array.isArray(childs_delete)) {
      childs_delete.forEach((child) => {
        db.run("DELETE FROM po_child WHERE id = ?", [child.id], function (err) {
          if (err) console.error("Child delete error:", err);
        });
      });
    }

    //ensure process
    //processData(po_master_id, order_type, ref_no);

    res.status(201).json({
      message: "Purchase Order updated successfully!",
      po_master_id,
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


function processInvoiceData_old(po_master_id, order_type, ref_no) {
  //sum childs item amount and update total_amount in po_master
  const sql_total_amount = `
    UPDATE po_master
    SET total_amount = (
      SELECT IFNULL(SUM(poc.item_rate * poc.item_qty - poc.discount_amount), 0)
      FROM po_child poc
      WHERE poc.po_master_id = po_master.po_master_id
    )
    WHERE is_complete = 0
    AND po_master_id = ?
  `;

  db.run(sql_total_amount, [po_master_id], function (err) {
    if (err) {
      console.error("Database error in sql_total_amount:", err);
      return;
    }

    if (order_type === "Purchase Receive") {
      //if created from a reference, mark it as paid and complete
      const sql_paid_amount = `
        UPDATE po_master
        SET paid_amount = total_amount, is_paid = 1
        WHERE is_complete = 0
        AND po_master_id = ?
        AND ref_no <> 'No Ref'
        AND order_type = 'Purchase Receive'
        AND is_paid = 0
      `;

      db.run(sql_paid_amount, [po_master_id], function (err) {
        if (err) {
          console.error("Database error in sql_paid_amount:", err);
          //return; Go to next SQL
        }
      });

      //Update "Purchase Booking.received_qty" from "Purchase Receive.item_qty"
      const sql_update_received_qty = `WITH a AS (
          SELECT pom.ref_no, poc.item_id, SUM(poc.item_qty) AS item_qty
          FROM po_child poc
          JOIN po_master pom ON poc.po_master_id = pom.po_master_id
          WHERE pom.ref_no = ?
          GROUP BY pom.ref_no, poc.item_id
        )
        UPDATE po_child
        SET received_qty = (
          SELECT a.item_qty
          FROM a
          JOIN po_master pom ON a.ref_no = pom.order_no AND pom.po_master_id = po_child.po_master_id
          WHERE a.item_id = po_child.item_id
        )
        WHERE EXISTS (
          SELECT 1
          FROM a
          JOIN po_master pom ON a.ref_no = pom.order_no AND pom.po_master_id = po_child.po_master_id
          WHERE a.item_id = po_child.item_id
        )`;

      db.run(sql_update_received_qty, [ref_no], function (err) {
        if (err) {
          console.error("Database error in sql_update_received_qty:", err);
          //return; Go to next SQL
        }

        // Update "Purchase Receive.received_qty"
        const sql_update_received_qty2 = `UPDATE po_child
            SET received_qty = item_qty
            WHERE EXISTS (
              SELECT 1 FROM po_master pom
              WHERE po_child.po_master_id = pom.po_master_id
              AND pom.order_type = 'Purchase Receive'
              AND pom.po_master_id = ?
            )`;

        db.run(sql_update_received_qty2, [po_master_id], function (err) {
          if (err) {
            console.error("Database error in sql_update_received_qty2:", err);
            //return; Go to next SQL
          }
        });
      });
    } else {
      //do nothing
    }

    //Mark as complete when incomplete
    const sql_mark_as_complete = `UPDATE po_master
            SET is_complete = (
                SELECT CASE WHEN SUM(poc.item_qty - poc.received_qty) > 0 THEN 0 ELSE 1 END
                FROM po_child poc
                JOIN po_master pom ON poc.po_master_id = pom.po_master_id
                WHERE pom.order_no = po_master.order_no
            )
            WHERE po_master.is_complete = 0`;

    db.run(sql_mark_as_complete, [], function (err) {
      if (err) {
        console.error("Database error in sql_mark_as_complete:", err);
        //return; Go to next SQL
      }
    });

    // Mark as paid when paid and total are same
    const sql_e = `UPDATE po_master
              SET is_paid = 1
              WHERE is_paid = 0
              AND total_amount = paid_amount
              AND po_master_id = ? `;

    db.run(sql_e, [po_master_id], function (err) {
      if (err) {
        console.error("Database error in sql_e:", err);
      }
    });
  });
}

module.exports = router;
