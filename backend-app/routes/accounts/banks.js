const express = require("express");
const router = express.Router();

const {
  runScriptsSequentially,
  dbRun,
  dbGet,
  dbAll,
} = require("../../db/asyncScriptsRunner");

//get all  banks
router.get("/", async (req, res) => {
  try {
    const sql = `SELECT ba.*, 0 as edit_stop
        FROM banks ba ORDER BY ba.branch_name ASC`;
    const rows = await dbAll(sql, []);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching  banks:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//create new  bank
router.post("/", async (req, res) => {
  try {
    const { bank_id, bank_name, branch_name, swift_code, current_balance } =
      req.body;

    if (!bank_id) {
      return res.status(400).json({ error: "Bank ID is required" });
    }

    if (!bank_name) {
      return res.status(400).json({ error: "Bank name is required" });
    }

    if (!branch_name) {
      return res.status(400).json({ error: "Branch name is required" });
    }

    const sql = `INSERT INTO banks (bank_id, bank_name, branch_name, swift_code, current_balance)
      VALUES (?, ?, ?, ?, ?)`;
    const params = [
      bank_id,
      bank_name,
      branch_name,
      swift_code,
      current_balance,
    ];
    await dbRun(sql, params, `Created  bank ${bank_name}`);
    res.status(201).json({ account_id, ...req.body });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
//update bank
router.post("/update", async (req, res) => {
  try {
    const { bank_id, bank_name, branch_name, swift_code, current_balance } =
      req.body;

    if (!bank_id) {
      return res.status(400).json({ error: "Account ID is required" });
    }

    if (!bank_name) {
      return res.status(400).json({ error: " name is required" });
    }

    if (!branch_name) {
      return res.status(400).json({ error: "Branch name is required" });
    }

    const sql = `UPDATE banks
    SET bank_name = ?,
    branch_name = ?,
    swift_code = ?,
    updated_at = CURRENT_TIMESTAMP
    WHERE bank_id = ?`;
    const params = [bank_name, branch_name, swift_code, bank_id];
    const result = await dbRun(sql, params, `Updated  bank ${bank_name}`);
    if (result.changes === 0) {
      return res.status(404).json({ error: "Bank not found" });
    }
    res.status(200).json({ bank_id, ...req.body });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
//delete  bank
router.post("/delete", async (req, res) => {
  try {
    const { bank_id, bank_name } = req.body;
    if (!bank_id) {
      return res.status(400).json({ error: "Bank ID is required" });
    }
    const sql = `DELETE FROM banks WHERE bank_id = ?`;
    const params = [bank_id];
    const result = await dbRun(sql, params, `Deleted  bank ${bank_name}`);
    if (result.changes === 0) {
      return res.status(404).json({ error: "Bank not found" });
    }
    res.json({ message: "Bank deleted successfully" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//get all accounts
router.get("/accounts-all", async (req, res) => {
  try {
    const sql = `SELECT bsa.*, ba.bank_name, 0 as edit_stop
        FROM accounts bsa
        JOIN banks ba ON bsa.bank_id = ba.bank_id
        ORDER BY bsa.account_name ASC`;
    const row = await dbAll(sql, []);
    res.json(row);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//get by id
router.get("/accounts/:bank_id", async (req, res) => {
  console.log("bank_id: " + req.params.bank_id);
  try {
    const { bank_id } = req.params;
    const sql = `SELECT bsa.*, 0 as edit_stop
        FROM accounts bsa WHERE bsa.bank_id = ? ORDER BY bsa.account_name ASC`;
    const row = await dbAll(sql, [bank_id]);
    if (!row) {
      return res.status(404).json({ error: "Account not found" });
    }
    res.json(row);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//create new account
router.post("/accounts", async (req, res) => {
  try {
    const {
      account_id,
      bank_id,
      account_name,
      account_no,
      account_note,
      opening_date,
    } = req.body;

    if (!account_id) {
      return res.status(400).json({ error: "Account ID is required" });
    }

    if (!account_name) {
      return res.status(400).json({ error: "Account name is required" });
    }

    const sql = `INSERT INTO accounts (account_id, bank_id, account_name, account_no, account_note, opening_date)
      VALUES (?, ?, ?, ?, ?, ?)`;
    const params = [
      account_id,
      bank_id,
      account_name,
      account_no,
      account_note,
      opening_date,
    ];
    await dbRun(sql, params, `Created account ${account_name}`);
    res.status(201).json({ account_id, ...req.body });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
//update  account
router.post("/accounts/update", async (req, res) => {
  try {
    const {
      account_id,
      bank_id,
      account_name,
      account_no,
      account_note,
      opening_date,
      is_default,
    } = req.body;

    if (!account_id) {
      return res.status(400).json({ error: "Account ID is required" });
    }

    if (!account_name) {
      return res.status(400).json({ error: "Account name is required" });
    }

    const sql = `UPDATE accounts
    SET account_name = ?,
    account_no = ?,
    account_note = ?,
    opening_date = ?, 
    is_default = ?,
    updated_at = CURRENT_TIMESTAMP
    WHERE account_id = ?`;
    const params = [
      account_name,
      account_no,
      account_note,
      opening_date,
      is_default,
      account_id,
    ];
    const result = await dbRun(sql, params, `Updated account ${account_name}`);
    if (result.changes === 0) {
      return res.status(404).json({ error: "Account not found" });
    }
    res.status(200).json({ account_id, ...req.body });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
//delete  account
router.post("/accounts/delete", async (req, res) => {
  try {
    const { account_id, account_name } = req.body;
    if (!account_id) {
      return res.status(400).json({ error: "Account ID is required" });
    }
    const sql = `DELETE FROM accounts WHERE account_id = ?`;
    const params = [account_id];
    const result = await dbRun(sql, params, `Deleted account ${account_name}`);
    if (result.changes === 0) {
      return res.status(404).json({ error: "Account not found" });
    }
    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
