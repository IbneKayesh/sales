const express = require("express");
const { db } = require("../db/init");
const router = express.Router();

// Get all bank accounts
router.get("/", (req, res) => {
  const sql = `
    SELECT ba.*, b.bank_name, 0 AS ismodified
    FROM bank_accounts ba
    LEFT JOIN banks b ON ba.bank_id = b.bank_id
    ORDER BY ba.bank_account_id
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(rows);
  });
});

// Get bank account by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT ba.*, b.bank_name
    FROM bank_accounts ba
    LEFT JOIN banks b ON ba.bank_id = b.bank_id
    WHERE ba.bank_account_id = ?
  `;
  db.get(sql, [id], (err, row) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (!row) {
      return res.status(404).json({ error: "Bank account not found" });
    }
    res.json(row);
  });
});

// Create new bank account
router.post("/", (req, res) => {
  const {
    bank_account_id,
    bank_id,
    account_name,
    account_number,
    opening_date,
    debit_balance,
    credit_balance,
    current_balance,
  } = req.body;

  if (!account_name || !account_number) {
    return res
      .status(400)
      .json({ error: "Account name and number are required" });
  }

  if (!bank_account_id) {
    return res.status(400).json({ error: "Bank account ID is required" });
  }

  const sql = `
    INSERT INTO bank_accounts (bank_account_id, bank_id, account_name, account_number, opening_date, debit_balance, credit_balance, current_balance)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    bank_account_id,
    bank_id || null,
    account_name,
    account_number,
    opening_date || "",
    debit_balance || 0,
    credit_balance || 0,
    current_balance || 0,
  ];

  db.run(sql, params, function (err) {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.status(201).json({ bank_account_id, ...req.body });
  });
});

// Update bank account
router.post("/update", (req, res) => {
  const {
    id,
    bank_id,
    account_name,
    account_number,
    opening_date,
    debit_balance,
    credit_balance,
    current_balance,
  } = req.body;

  if (!id || !account_name || !account_number) {
    return res
      .status(400)
      .json({ error: "Account ID, name and number are required" });
  }

  const sql = `
    UPDATE bank_accounts SET
      bank_id = ?,
      account_name = ?,
      account_number = ?,
      opening_date = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE bank_account_id = ?
  `;
  // debit_balance = ?,
  // credit_balance = ?,
  // current_balance = ?,

  const params = [
    bank_id || null,
    account_name,
    account_number,
    opening_date || "",
    // debit_balance || 0,
    // credit_balance || 0,
    // current_balance || 0,
    id,
  ];

  db.run(sql, params, function (err) {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Bank account not found" });
    }
    res.json({
      bank_account_id: id,
      bank_id,
      account_name,
      account_number,
      opening_date,
      debit_balance,
      credit_balance,
      current_balance,
    });
  });
});

// Delete bank account
router.post("/delete", (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Bank account ID is required" });
  }

  db.run(
    "DELETE FROM bank_accounts WHERE bank_account_id = ?",
    [id],
    function (err) {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: "Bank account not found" });
      }
      res.json({ message: "Bank account deleted successfully" });
    }
  );
});

module.exports = router;
