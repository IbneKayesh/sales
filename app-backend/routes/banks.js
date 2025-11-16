const express = require("express");
const { db } = require("../db/init");
const router = express.Router();

// Get all banks
router.get("/", (req, res) => {
  db.all(
    "SELECT b.*, 0 AS ismodified FROM banks b ORDER BY b.bank_id",
    [],
    (err, rows) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.json(rows);
    }
  );
});

// Get bank by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM banks WHERE bank_id = ?", [id], (err, row) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (!row) {
      return res.status(404).json({ error: "Bank not found" });
    }
    res.json(row);
  });
});

// Create new bank
router.post("/", (req, res) => {
  const {
    bank_id,
    bank_name,
    bank_address,
    routing_number,
    debit_balance,
    credit_balance,
    current_balance,
  } = req.body;

  if (!bank_name) {
    return res.status(400).json({ error: "Bank name is required" });
  }

  if (!bank_id) {
    return res.status(400).json({ error: "Bank ID is required" });
  }

  const sql = `
    INSERT INTO banks (bank_id, bank_name, bank_address, routing_number, debit_balance, credit_balance, current_balance)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    bank_id,
    bank_name,
    bank_address || "",
    routing_number || "",
    debit_balance || 0,
    credit_balance || 0,
    current_balance || 0,
  ];

  db.run(sql, params, function (err) {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.status(201).json({ bank_id, ...req.body });
  });
});

// Update bank
router.post("/update", (req, res) => {
  const {
    id,
    bank_name,
    bank_address,
    routing_number,
    debit_balance,
    credit_balance,
    current_balance,
  } = req.body;

  if (!id || !bank_name) {
    return res.status(400).json({ error: "Bank ID and name are required" });
  }

  const sql = `
    UPDATE banks SET
      bank_name = ?,
      bank_address = ?,
      routing_number = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE bank_id = ?
  `;
  // debit_balance = ?,
  // credit_balance = ?,
  // current_balance = ?,

  const params = [
    bank_name,
    bank_address || "",
    routing_number || "",
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
      return res.status(404).json({ error: "Bank not found" });
    }
    res.json({
      bank_id: id,
      bank_name,
      bank_address,
      routing_number,
      debit_balance,
      credit_balance,
      current_balance,
    });
  });
});

// Delete bank
router.post("/delete", (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Bank ID is required" });
  }

  db.run("DELETE FROM banks WHERE bank_id = ?", [id], function (err) {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Bank not found" });
    }
    res.json({ message: "Bank deleted successfully" });
  });
});

module.exports = router;
