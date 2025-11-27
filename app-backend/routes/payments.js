const express = require("express");
const { db } = require("../db/init");
const router = express.Router();
const {
  runScriptsSequentially,
  dbRun,
  dbGet,
} = require("../db/asyncScriptsRunner.js");
const { processInvoiceData } = require("../dbproc/dbproc.js");

// Get all dues
router.get("/dues", (req, res) => {
  const sql = `SELECT con.contact_id,con.contact_name,con.contact_type,pom.order_type,pom.order_no,pom.order_date,pom.due_amount
  FROM po_master pom
  LEFT JOIN contacts con on pom.contact_id = con.contact_id
  WHERE pom.order_type IN ('Purchase Booking')
  AND pom.due_amount > 0`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(rows);
  });
});

// Get payment by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM payments WHERE payment_id = ?", [id], (err, row) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (!row) {
      return res.status(404).json({ error: "Unit not found" });
    }
    res.json(row);
  });
});

// Get payment by ref no
router.get("/refno/:refNo", (req, res) => {
  const { refNo } = req.params;
  db.all("SELECT * FROM payments WHERE ref_no = ?", [refNo], (err, rows) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(rows);
  });
});

// Get payment by ref no
router.get("/supplier/:supplierId", (req, res) => {
  const { supplierId } = req.params;
  const sql = `SELECT p.payment_id,p.bank_account_id,'Purchase Receive' payment_type, p.payment_mode, p.payment_date, p.contact_id,
'' ref_no, p.payment_amount - p.order_amount payment_amount, p.order_amount, p.payment_note, p.payment_id ref_id,p.created_at, p.updated_at
FROM payments p
WHERE p.payment_type IN ('Purchase Booking')
AND (p.payment_amount - p.order_amount) > 0
AND p.contact_id = ?`;
  db.all(sql, [supplierId], (err, rows) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(rows);
  });
});

// Create new payment
router.post("/", async (req, res) => {
  const {
    payment_id,
    bank_account_id,
    payment_type,
    payment_mode,
    payment_date,
    contact_id,
    ref_no,
    payment_amount,
    payment_note,
  } = req.body;

  // Validate
  if (
    !payment_id ||
    !bank_account_id ||
    !payment_type ||
    !payment_mode ||
    !payment_date ||
    !contact_id ||
    !ref_no ||
    !payment_amount
  ) {
    return res.status(400).json({
      error:
        "Id, bank account id, payment type, payment mode, payment date, contact id, ref no, payment amount, payment note are required",
    });
  }

  // Build SQL scripts for transaction
  const scripts = [];

  scripts.push({
    label: "Insert Payment",
    sql: `
    INSERT INTO payments (payment_id, bank_account_id, payment_type, payment_mode, payment_date, contact_id, ref_no, payment_amount, payment_note)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    params: [
      payment_id,
      bank_account_id,
      payment_type,
      payment_mode,
      payment_date,
      contact_id,
      ref_no,
      payment_amount,
      payment_note,
    ],
  });

  // --- Run all scripts inside a transaction ---
  const results = await runScriptsSequentially(scripts, {
    useTransaction: true,
  });

  //update invoice status
  processInvoiceData();

  res.status(201).json({
    message: "Payment created successfully!",
    payment_id,
    bank_account_id,
    payment_type,
    payment_mode,
    payment_date,
    contact_id,
    ref_no,
    payment_amount,
    payment_note,
  });
});

// Update payment
router.post("/update", (req, res) => {
  const { id, payment_name } = req.body;

  if (!id || !payment_name) {
    return res.status(400).json({ error: "Payment ID and name are required" });
  }

  const sql = `
    UPDATE payments SET
      payment_name = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE payment_id = ?
  `;
  const params = [payment_name, id];

  db.run(sql, params, function (err) {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Payment not found" });
    }
    res.json({ payment_id: id, payment_name });
  });
});

// Delete payment
router.post("/delete", (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Payment ID is required" });
  }

  db.run("DELETE FROM payments WHERE payment_id = ?", [id], function (err) {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Unit not found" });
    }
    res.json({ message: "Unit deleted successfully" });
  });
});

module.exports = router;
