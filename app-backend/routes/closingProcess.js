const express = require("express");
const { db } = require("../db/init");
const router = express.Router();

// Update bank transactions
// JS run async but there need sync
router.post("/update-bank-transaction", (req, res) => {
  // First SQL: update bank_accounts
  const updateBankAccountsSql = `
    UPDATE bank_accounts
    SET debit_balance = COALESCE(
            (SELECT SUM(debit_amount)
             FROM bank_transactions
             WHERE bank_account_id = bank_accounts.bank_account_id), 0),
        credit_balance = COALESCE(
            (SELECT SUM(credit_amount)
             FROM bank_transactions
             WHERE bank_account_id = bank_accounts.bank_account_id), 0),
        current_balance = debit_balance - credit_balance;
  `;

  db.run(updateBankAccountsSql, function (err) {
    if (err) {
      console.error("Error updating bank_accounts:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    // Second SQL: update banks
    const updateBanksSql = `
      UPDATE banks
      SET debit_balance = COALESCE(
              (SELECT SUM(debit_balance)
               FROM bank_accounts
               WHERE bank_id = banks.bank_id), 0),
          credit_balance = COALESCE(
              (SELECT SUM(credit_balance)
               FROM bank_accounts
               WHERE bank_id = banks.bank_id), 0),
          current_balance = debit_balance - credit_balance;
    `;

    db.run(updateBanksSql, function (err2) {
      if (err2) {
        console.error("Error updating banks:", err2);
        return res.status(500).json({ error: "Internal server error" });
      }

      res.json({
        success: true,
        message: "Bank balances updated successfully",
      });
    });
  });
});

// Update item approx profit
router.post("/update-item-profit", (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Transaction ID is required" });
  }

  const sql = `
    UPDATE items
    SET approx_profit = (sales_rate - (sales_rate * discount_percent / 100.0)) - purchase_rate
    WHERE 1 = 1
  `;
  const params = [];

  db.run(sql, params, function (err) {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Data not found" });
    }
    res.json({ id });
  });
});

module.exports = router;
