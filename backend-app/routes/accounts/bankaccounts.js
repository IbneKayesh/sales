//as example contacts.js
const express = require("express");
const router = express.Router();

const {
  runScriptsSequentially,
  dbRun,
  dbGet,
  dbAll,
} = require("../../db/asyncScriptsRunner");

//get all bank accounts
router.get("/", async (req, res) => {
  try {
    const sql = `SELECT ba.*, 0 as ismodified
        FROM bank_accounts ba ORDER BY ba.account_id`;
    const rows = await dbAll(sql, []);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching bank accounts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//get by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `SELECT ba.*, 0 as ismodified
        FROM bank_accounts ba WHERE ba.account_id = ?`;
    const row = await dbGet(sql, [id]);
    if (!row) {
      return res.status(404).json({ error: "Bank account not found" });
    }
    res.json(row);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
//create new bank account
router.post("/", async (req, res) => {
  try {
    const {
      account_id,
      bank_name,
      bank_branch,
      account_name,
      account_number,
      opening_date,
      current_balance,
      is_default,
    } = req.body;
    
  if (!account_id) {
    return res.status(400).json({ error: "Account ID is required" });
  }

  if (!bank_name) {
    return res.status(400).json({ error: "Bank name is required" });
  }

  if (!account_name) {
    return res.status(400).json({ error: "Account name is required" });
  }

    const sql = `INSERT INTO bank_accounts (account_id, bank_name, bank_branch, account_name, account_number, opening_date, current_balance, is_default)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [
      account_id,
      bank_name,
      bank_branch,
      account_name,
      account_number,
      opening_date,
      current_balance,
      is_default,
    ];
    await dbRun(sql, params, `Created bank account ${account_name}`);
    res.status(201).json({ account_id, ...req.body });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
//update bank account
router.post("/update", async (req, res) => {
  try {
    const {
      account_id,
      bank_name,
      bank_branch,
      account_name,
      account_number,
      opening_date,
      current_balance,
      is_default,
    } = req.body;
    
  if (!account_id) {
    return res.status(400).json({ error: "Account ID is required" });
  }

  if (!bank_name) {
    return res.status(400).json({ error: "Bank name is required" });
  }

  if (!account_name) {
    return res.status(400).json({ error: "Account name is required" });
  }

    const sql = `UPDATE bank_accounts
    SET bank_name = ?, bank_branch = ?,
    account_name = ?, account_number = ?,
    opening_date = ?, current_balance = ?,
    is_default = ?, updated_at = CURRENT_TIMESTAMP
    WHERE account_id = ?`;
    const params = [
      bank_name,
      bank_branch,
      account_name,
      account_number,
      opening_date,
      current_balance,
      is_default,
      account_id,
    ];
    const result = await dbRun(sql, params, `Updated bank account ${account_name}`);
    if (result.changes === 0) {
      return res.status(404).json({ error: "Bank account not found" });
    }
    res.status(200).json({ account_id, ...req.body });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
})
//delete bank account
router.post("/delete", async (req, res) => {
  try {
    const { account_id, account_name } = req.body;
    if (!account_id) {
      return res.status(400).json({ error: "Account ID is required" });
    }
    const sql = `DELETE FROM bank_accounts WHERE account_id = ?`;
    const params = [account_id];
    const result = await dbRun(sql, params, `Deleted bank account ${account_name}`);
    if (result.changes === 0) {
      return res.status(404).json({ error: "Bank account not found" });
    }
    res.json({ message: "Bank account deleted successfully" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
})

module.exports = router;
