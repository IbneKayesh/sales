const express = require("express");
const router = express.Router();
const {
  runScriptsSequentially,
  dbRun,
  dbGet,
  dbAll,
} = require("../../db/asyncScriptsRunner");

// Update purchase due
router.post("/update-purchase-due", async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Purchase ID is required" });
  }

  const scripts = [];

  scripts.push({
    label: "Update Purchase Payment and Due for Pay later",
    sql: `WITH payment AS (
        SELECT pm.order_type, pm.order_no,SUM(bp.payment_amount) AS payment_amount
        FROM po_master pm
        JOIN bank_payments bp ON pm.contact_id = bp.contact_id
           AND pm.order_type = bp.payment_head
           AND pm.order_no = bp.ref_no
        WHERE pm.is_paid IN ('Partial', 'Unpaid')
        GROUP BY pm.order_type, pm.order_no
    )
    UPDATE po_master
    SET 
        paid_amount = (
            SELECT payment.payment_amount
            FROM payment
            WHERE payment.order_no = po_master.order_no
              AND payment.order_type = po_master.order_type
        ),
        due_amount = payable_amount - (
            SELECT payment.payment_amount
            FROM payment
            WHERE payment.order_no = po_master.order_no
              AND payment.order_type = po_master.order_type
        )
    WHERE EXISTS (
        SELECT 1
        FROM payment
        WHERE payment.order_no = po_master.order_no
          AND payment.order_type = po_master.order_type
    )`,
    params: [],
  });

  scripts.push({
    label: "Update Purchase Payment status",
    sql: `UPDATE po_master
    SET is_paid = 'Paid'
    WHERE is_paid IN ('Partial', 'Unpaid')
    AND due_amount = 0
    AND payable_amount = paid_amount`,
    params: [],
  });

  scripts.push({
    label: "Update Purchase complete status",
    sql: `UPDATE po_master
    SET is_completed = 1
    WHERE is_paid = 'Paid'
    AND is_posted = 1
    AND is_completed = 0`,
    params: [],
  });

  try {
    const results = await runScriptsSequentially(scripts, {
      useTransaction: false,
    });
    res.status(201).json({
      message: "Purchase data processed successfully!",
      result: results,
    });
  } catch (error) {
    console.error("Error processing purchase data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



// Update bank accounts
router.post("/update-bank-accounts", async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Bank account ID is required" });
  }

  const scripts = [];

  scripts.push({
    label: "Update bank accounts",
    sql: `WITH payments AS
    (SELECT bp.account_id,0-SUM(bp.payment_amount)balance
    FROM bank_payments bp
    WHERE bp.payment_head in ('Purchase Order', 'Purchase Order Expenses')
    GROUP by bp.account_id
    )
    UPDATE bank_accounts
    SET
      current_balance = (
      SELECT payments.balance
      FROM payments
      WHERE payments.account_id = bank_accounts.account_id
      )
    WHERE EXISTS (
    SELECT 1
      FROM payments
      WHERE payments.account_id = bank_accounts.account_id
      )`,
    params: [],
  });
  try {
    const results = await runScriptsSequentially(scripts, {
      useTransaction: false,
    });
    res.status(201).json({
      message: "Bank accounts data processed successfully!",
      result: results,
    });
  } catch (error) {
    console.error("Error processing bank accounts data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
