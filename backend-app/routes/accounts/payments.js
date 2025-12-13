const express = require("express");
const router = express.Router();

const {
  runScriptsSequentially,
  dbRun,
  dbGet,
  dbAll,
} = require("../../db/asyncScriptsRunner");

// Get all purchase dues
router.get("/", async (req, res) => {
  try {
    const sql = `SELECT pym.*, con.contact_name, 0 as ismodified
FROM payments pym
LEFT JOIN contacts con on pym.contact_id = con.contact_id
ORDER by pym.payment_date DESC`;
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
    const sql = `SELECT pym.*, 0 as ismodified
        FROM payments pym
        WHERE pym.payment_id = ?`;
    const row = await dbGet(sql, [id]);
    if (!row) {
      return res.status(404).json({ error: "Payment not found" });
    }
    res.json(row);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//create new payment
router.post("/", async (req, res) => {
  try {
    const {
      payment_id,
      contact_id,
      payment_head,
      payment_mode,
      payment_date,
      payment_amount,
      balance_amount,
      payment_note,
      ref_no,
    } = req.body;

    if (!payment_id) {
      return res.status(400).json({ error: "Payment ID is required" });
    }

    if (!contact_id) {
      return res.status(400).json({ error: "Contact ID is required" });
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

    if (!ref_no) {
      return res.status(400).json({ error: "Reference number is required" });
    }

    if (!payment_amount) {
      return res.status(400).json({ error: "Payment Amount is required" });
    }

    //build scripts
    const scripts = [];

    const payment_id_new = generateGuid();

    // payment master
    scripts.push({
      label: "Insert Purchase Payment " + ref_no,
      sql: `INSERT INTO payments (payment_id, contact_id, payment_head, payment_mode, payment_date,
            payment_amount, balance_amount, payment_note, ref_no)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      params: [
        payment_id_new,
        contact_id,
        payment_head,
        payment_mode,
        payment_date,
        payment_amount,
        balance_amount,
        payment_note,
        ref_no
      ],
    });





    const results = await runScriptsSequentially(scripts, {
      useTransaction: true,
    });
    // If any failed, transaction has already rolled back
    if (!results.every((r) => r.success)) {
      return res.status(500).json({ error: "Failed to create payment" });
    }
    // ❗ Only one response is sent
    res.status(201).json({
      message: "Payment created successfully!",
      payment_id,
      ref_no,
    });

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
