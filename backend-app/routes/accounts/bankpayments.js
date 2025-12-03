//as example contacts.js
const express = require("express");
const router = express.Router();

const {
  runScriptsSequentially,
  dbRun,
  dbGet,
  dbAll,
} = require("../../db/asyncScriptsRunner");

// Get all purchase dues
router.get("/purchase-dues", async (req, res) => {
  try {
    const sql = `SELECT '' as payment_id,'' as account_id,pom.order_type as payment_head, 'Cash' as payment_mode,
    pom.order_date as ref_date, pom.order_date as payment_date, pom.contact_id,
    pom.order_no as ref_no, pom.due_amount ,pom.due_amount as payment_amount, '' as payment_note, con.contact_name
    FROM po_master pom
    LEFT JOIN contacts con on pom.contact_id = con.contact_id
    WHERE is_paid in ('Partial','Unpaid')
    AND pom.due_amount > 0
    AND pom.is_posted = 1
    UNION ALL
    SELECT '' as payment_id,'' as account_id,pom.order_type as payment_head, 'Cash' as payment_mode,
    pom.order_date as ref_date, pom.order_date as payment_date, pom.contact_id,
    pom.order_no as ref_no, pom.due_amount ,pom.due_amount as payment_amount, '' as payment_note, con.contact_name
    FROM so_master pom
    LEFT JOIN contacts con on pom.contact_id = con.contact_id
    WHERE is_paid in ('Partial','Unpaid')
    AND pom.due_amount > 0
    AND pom.is_posted = 1
    ORDER by order_date DESC`;
    const rows = await dbAll(sql, []);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching purchase dues:", error);
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

//create new bank payment
router.post("/", async (req, res) => {
  try {
    const {
      payment_id,
      account_id,
      payment_head,
      payment_mode,
      payment_date,
      contact_id,
      ref_no,
      payment_amount,
      payment_note,
    } = req.body;

    if (!payment_id) {
      return res.status(400).json({ error: "Payment ID is required" });
    }

    if (!account_id) {
      return res.status(400).json({ error: "Account ID is required" });
    }

    if (!payment_head) {
      return res.status(400).json({ error: "Payment head is required" });
    }

    if (!payment_mode) {
      return res.status(400).json({ error: "Payment mode is required" });
    }

    if (!payment_date) {
      return res.status(400).json({ error: "Payment date is required" });
    }

    if (!contact_id) {
      return res.status(400).json({ error: "Contact ID is required" });
    }

    if (!ref_no) {
      return res.status(400).json({ error: "Reference number is required" });
    }

    if (!payment_amount) {
      return res.status(400).json({ error: "Payment amount is required" });
    }

    const sql = `INSERT INTO bank_payments (payment_id, account_id, payment_head, payment_mode, payment_date,
    contact_id, ref_no, payment_amount, payment_note)
    VALUES (?, ?, ?, ?, ?,
    ?, ?, ?, ?)`;
    const params = [
      payment_id,
      account_id,
      payment_head,
      payment_mode,
      payment_date,
      contact_id,
      ref_no,
      payment_amount,
      payment_note,
    ];
    await dbRun(sql, params, `Created bank payment ${ref_no}`);
    res.status(201).json({ payment_id, ...req.body });
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
    const result = await dbRun(
      sql,
      params,
      `Updated bank account ${account_name}`
    );
    if (result.changes === 0) {
      return res.status(404).json({ error: "Bank account not found" });
    }
    res.status(200).json({ account_id, ...req.body });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
//delete bank account
router.post("/delete", async (req, res) => {
  try {
    const { account_id, account_name } = req.body;
    if (!account_id) {
      return res.status(400).json({ error: "Account ID is required" });
    }
    const sql = `DELETE FROM bank_accounts WHERE account_id = ?`;
    const params = [account_id];
    const result = await dbRun(
      sql,
      params,
      `Deleted bank account ${account_name}`
    );
    if (result.changes === 0) {
      return res.status(404).json({ error: "Bank account not found" });
    }
    res.json({ message: "Bank account deleted successfully" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
