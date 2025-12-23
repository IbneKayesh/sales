//as example contacts.js
const express = require("express");
const router = express.Router();

const { generateGuid } = require("../../guid.js");

const {
  runScriptsSequentially,
  dbRun,
  dbGet,
  dbAll,
} = require("../../db/asyncScriptsRunner");

//get all ledger
router.get("/", async (req, res) => {
  try {
    const sql = `SELECT al.*, act.account_name, ach.head_name ,con.contact_name, 0 as edit_stop
        FROM accounts_ledger al
        LEFT JOIN accounts act ON al.account_id = act.account_id
        LEFT JOIN accounts_heads ach on al.head_id = ach.head_id
        LEFT JOIN contacts con ON al.contact_id = con.contact_id
        ORDER BY al.created_at DESC`;
    const rows = await dbAll(sql, []);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching ledger:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//create new ledger
router.post("/", async (req, res) => {
  try {
    const {
      ledger_id,
      account_id,
      head_id,
      contact_id,
      ledger_date,
      ledger_ref,
      ledger_note,
      payment_mode,
      debit_amount,
      credit_amount,
    } = req.body;

    if (!ledger_id) {
      return res.status(400).json({ error: "Ledger ID is required" });
    }

    if (!account_id) {
      return res.status(400).json({ error: "Account ID is required" });
    }

    if (!contact_id) {
      return res.status(400).json({ error: "Contact ID is required" });
    }

    if (!head_id) {
      return res.status(400).json({ error: "Head ID is required" });
    }

    if (!ledger_date) {
      return res.status(400).json({ error: "Ledger date is required" });
    }

    if (!payment_mode) {
      return res.status(400).json({ error: "Payment mode is required" });
    }

    const sql = `INSERT INTO accounts_ledger (ledger_id,account_id,head_id,contact_id,ledger_date,ledger_ref,ledger_note,payment_mode,debit_amount,credit_amount)
      VALUES (?,?,?,?,?,?,?,?,?,?)`;
    const params = [
      ledger_id,
      account_id,
      head_id,
      contact_id,
      ledger_date,
      ledger_ref,
      ledger_note,
      payment_mode,
      debit_amount,
      credit_amount,
    ];
    await dbRun(sql, params, `Created ledger ${ledger_id}`);
    res.status(201).json({ ledger_id, ...req.body });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
//update ledger
router.post("/update", async (req, res) => {
  try {
    const {
      account_id,
      head_id,
      contact_id,
      ledger_date,
      ledger_ref,
      ledger_note,
      payment_mode,
      debit_amount,
      credit_amount,
      ledger_id,
    } = req.body;

    if (!ledger_id) {
      return res.status(400).json({ error: "Ledger ID is required" });
    }

    if (!account_id) {
      return res.status(400).json({ error: "Account ID is required" });
    }

    if (!contact_id) {
      return res.status(400).json({ error: "Contact ID is required" });
    }

    if (!head_id) {
      return res.status(400).json({ error: "Head ID is required" });
    }

    if (!ledger_date) {
      return res.status(400).json({ error: "Ledger date is required" });
    }

    if (!payment_mode) {
      return res.status(400).json({ error: "Payment mode is required" });
    }

    const sql = `UPDATE accounts_ledger
    SET head_id = ?,
    ledger_date = ?,
    ledger_ref = ?,
    ledger_note = ?,
    payment_mode = ?,
    debit_amount = ?,
    credit_amount = ?,
    updated_at = CURRENT_TIMESTAMP
    WHERE ledger_id = ?`;
    const params = [
      head_id,
      ledger_date,
      ledger_ref,
      ledger_note,
      payment_mode,
      debit_amount,
      credit_amount,
      ledger_id,
    ];
    const result = await dbRun(sql, params, `Updated ledger ${ledger_id}`);
    if (result.changes === 0) {
      return res.status(404).json({ error: "Ledger not found" });
    }
    res.status(200).json({ ledger_id, ...req.body });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
//delete  bank
router.post("/delete", async (req, res) => {
  try {
    const { ledger_id } = req.body;
    if (!ledger_id) {
      return res.status(400).json({ error: "Ledger ID is required" });
    }
    const sql = `DELETE FROM accounts_ledger WHERE ledger_id = ?`;
    const params = [ledger_id];
    const result = await dbRun(sql, params, `Deleted  ledger ${ledger_id}`);
    if (result.changes === 0) {
      return res.status(404).json({ error: "Ledger not found" });
    }
    res.json({ message: "Ledger deleted successfully" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//create new ledger
router.post("/create-transfer", async (req, res) => {
  try {
    const {
      ledger_id,
      account_id,
      to_account_id,
      ledger_date,
      ledger_ref,
      ledger_note,
      payment_mode,
      transfer_amount,
    } = req.body;

    if (!ledger_id) {
      return res.status(400).json({ error: "Ledger ID is required" });
    }

    if (!account_id) {
      return res.status(400).json({ error: "Account ID is required" });
    }

    if (!to_account_id) {
      return res.status(400).json({ error: "To Account ID is required" });
    }

    if (!ledger_date) {
      return res.status(400).json({ error: "Ledger date is required" });
    }

    if (!payment_mode) {
      return res.status(400).json({ error: "Payment mode is required" });
    }

    if (!transfer_amount) {
      return res.status(400).json({ error: "Transfer amount is required" });
    }

    const scripts = [];

    scripts.push({
      label: "1 of 1 :: Transfer Ledger From Account",
      sql: `INSERT INTO accounts_ledger (ledger_id,account_id,head_id,contact_id,ledger_date,
      ledger_ref,ledger_note,payment_mode,debit_amount,credit_amount)
      VALUES (?,?,'Z601','internal',?,
      ?,?,?,0,?)`,
      params: [
        ledger_id,
        account_id,
        ledger_date,
        ledger_ref,
        ledger_note,
        payment_mode,
        transfer_amount,
      ],
    });

    scripts.push({
      label: "2 of 2 :: Transfer Ledger To Account",
      sql: `INSERT INTO accounts_ledger (ledger_id,account_id,head_id,contact_id,ledger_date,
      ledger_ref,ledger_note,payment_mode,debit_amount,credit_amount)
      VALUES (?,?,'Z602','internal',?,
      ?,?,?,?,0)`,
      params: [
        generateGuid(),
        to_account_id,
        ledger_date,
        ledger_ref,
        ledger_note,
        payment_mode,
        transfer_amount,
      ],
    });

    await runScriptsSequentially(scripts);
    res.json({ success: true });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
