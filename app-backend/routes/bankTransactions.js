const express = require("express");
const { db } = require("../db/init");
const router = express.Router();

// Get all bank transactions
router.get("/", (req, res) => {
  const sql = `
    SELECT bt.*, ba.account_name, 0 AS ismodified
    FROM bank_trans bt
    LEFT JOIN bank_accounts ba ON bt.bank_account_id = ba.bank_account_id
    ORDER BY bt.trans_date DESC, bt.bank_trans_id DESC
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(rows);
  });
});

// Get bank transaction by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT bt.*, ba.account_name
    FROM bank_trans bt
    LEFT JOIN bank_accounts ba ON bt.bank_account_id = ba.bank_account_id
    WHERE bt.bank_trans_id = ?
  `;
  db.get(sql, [id], (err, row) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (!row) {
      return res.status(404).json({ error: "Bank transaction not found" });
    }
    res.json(row);
  });
});

// Create new bank transaction
router.post("/", (req, res) => {
  const {
    bank_transactions_id,
    bank_account_id,
    transaction_date,
    transaction_name,
    reference_no,
    transaction_details,
    debit_amount,
    credit_amount,
  } = req.body;

  if (!bank_account_id || !transaction_date || !transaction_name) {
    return res.status(400).json({
      error:
        "Bank account, transaction date, and transaction name are required",
    });
  }

  if (!bank_transactions_id) {
    return res.status(400).json({ error: "Bank transactions ID is required" });
  }

  const sql = `
    INSERT INTO bank_transactions (
      bank_transactions_id, bank_account_id, transaction_date, transaction_name, reference_no,
      transaction_details, debit_amount, credit_amount
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    bank_transactions_id,
    bank_account_id,
    transaction_date,
    transaction_name,
    reference_no || "",
    transaction_details || "",
    debit_amount || 0,
    credit_amount || 0,
  ];

  db.run(sql, params, function (err) {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.status(201).json({ bank_transactions_id, ...req.body });
  });
});

// Update bank transaction
router.post("/update", (req, res) => {
  const {
    id,
    bank_account_id,
    transaction_date,
    transaction_name,
    reference_no,
    transaction_details,
    debit_amount,
    credit_amount,
  } = req.body;

  if (!id || !bank_account_id || !transaction_date || !transaction_name) {
    return res.status(400).json({
      error:
        "Transaction ID, bank account, transaction date, and transaction name are required",
    });
  }

  const sql = `
    UPDATE bank_trans SET
      bank_account_id = ?,
      transaction_date = ?,
      transaction_name = ?,
      reference_no = ?,
      transaction_details = ?,
      debit_amount = ?,
      credit_amount = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE bank_trans_id = ?
  `;
  const params = [
    bank_account_id,
    transaction_date,
    transaction_name,
    reference_no || "",
    transaction_details || "",
    debit_amount || 0,
    credit_amount || 0,
    id,
  ];

  db.run(sql, params, function (err) {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Bank transaction not found" });
    }
    res.json({
      bank_transactions_id: id,
      bank_account_id,
      transaction_date,
      transaction_name,
      reference_no,
      transaction_details,
      debit_amount,
      credit_amount,
    });
  });
});

// Delete bank transaction
router.post("/delete", (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Bank transaction ID is required" });
  }

  db.run(
    "DELETE FROM bank_trans WHERE bank_trans_id = ?",
    [id],
    function (err) {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: "Bank transaction not found" });
      }
      res.json({ message: "Bank transaction deleted successfully" });
    }
  );
});

// Get bank transaction by ID
router.get("/availableRefNos/:groupName", (req, res) => {
  const { groupName } = req.params;
  console.log("groupName " + groupName);

  let sql = "";
  if (groupName === "Purchases and Stock") {
    sql = `SELECT pom.order_type, pom.order_no, pom.order_date, pom.contact_id, con.contact_name, pom.total_amount, pom.paid_amount, pom.cost_amount
    FROM po_master pom
    LEFT JOIN contacts con on pom.contact_id = con.contact_id
    WHERE pom.is_posted = 1
    AND pom.order_type IN ('Purchase Booking','Purchase Receive','Purchase Order','Purchase Return')
    AND pom.is_paid = 0`;
  }

  if (!sql) {
    return res.status(404).json({ error: "Transaction not found" });
  }

  db.all(sql, [], (err, row) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (!row) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json(row);
  });
});

module.exports = router;
