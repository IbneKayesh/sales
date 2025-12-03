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
    label: "1. Mark 0 for all contacts current balance",
    sql: `UPDATE contacts SET current_balance = 0 WHERE current_balance != 0`,
    params: [],
  });

    scripts.push({
    label: "2. Update contact current balanace from Purchase and Sales",
    sql: `WITH cur_balance AS (
          SELECT contact_id, due_amount
          FROM po_master
          WHERE due_amount > 0
          UNION ALL
          SELECT contact_id, 0-due_amount
          FROM so_master
          WHERE due_amount > 0
          )
          UPDATE contacts
          SET current_balance = (
          SELECT due_amount
          FROM cur_balance
          WHERE cur_balance.contact_id = contacts.contact_id
          )
          WHERE EXISTS (
          SELECT 1
          FROM cur_balance
          WHERE cur_balance.contact_id = contacts.contact_id
          )`,
    params: [],
  });

    scripts.push({
    label: "3. Update bank accounts from Payments",
    sql: `WITH payments AS
    (
        SELECT account_id, sum(payment_amount)payment_amount
        FROM (
          SELECT bp.account_id,0-bp.payment_amount as payment_amount
            FROM bank_payments bp
            WHERE bp.payment_head in ('Purchase Order', 'Purchase Order Expenses')
          UNION ALL
          SELECT bp.account_id,bp.payment_amount
            FROM bank_payments bp
            WHERE bp.payment_head in ('Sales Order', 'Sales Order Expenses')
        )total_payments
      GROUP by account_id
    )
    UPDATE bank_accounts
    SET
      current_balance = (
      SELECT payments.payment_amount
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

// Update product stock
router.post("/update-product-stock", async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Transaction ID is required" });
  }

  const scripts = [];

  // scripts.push({
  //   label: "Update Item Stock Qty",
  //   sql: `UPDATE items
  //           SET stock_qty = (
  //               SELECT SUM(
  //                   CASE
  //                       WHEN pom.order_type IN ('Purchase Receive','Purchase Order') THEN poc.order_qty
  //                       WHEN pom.order_type = 'Return Purchase' THEN -poc.order_qty
  //                   END
  //               )
  //               FROM po_child poc
  //               JOIN po_master pom ON poc.po_master_id = pom.po_master_id
  //               WHERE poc.item_id = items.item_id
  //           )`,
  //   params: [],
  // });

  scripts.push({
    label: "Update Purchase Details Sales Qty after Sales Transaction",
    sql: `WITH sales AS (
          SELECT sod.ref_id, sum(sod.order_qty)order_qty
          FROM so_details sod
          JOIN po_details pod on sod.ref_id = pod.po_details_id
          WHERE pod.stock_qty > 0
          GROUP by sod.ref_id
          )
          UPDATE po_details
          SET sales_qty = (
          SELECT order_qty
          FROM sales
          WHERE sales.ref_id = po_details.po_details_id
          )
          WHERE EXISTS (
          SELECT 1
          FROM sales
          WHERE sales.ref_id = po_details.po_details_id
          )`,
    params: [],
  });

  
  scripts.push({
    label: "Update Purchase Details Stock Qty after Sales Transaction",
    sql: `UPDATE po_details
          SET stock_qty = product_qty - (return_qty + sales_qty)
          WHERE stock_qty > 0`,
    params: [],
  });


    scripts.push({
    label: "Delete Item Stock Qty after purchase and sales transactions",
    sql: `UPDATE products SET stock_qty = 0 WHERE stock_qty > 0`,
    params: [],
  });


  scripts.push({
    label: "Update Item Stock Qty after purchase and sales transactions",
    sql: `WITH purchase AS (
              SELECT pod.product_id, sum(pod.stock_qty)stock_qty
              FROM po_details pod
              JOIN po_master pom on pod.po_master_id = pom.po_master_id
              WHERE pod.stock_qty > 0
              AND pom.is_posted = 1
              GROUP by pod.product_id
              )
              UPDATE products
              SET
                stock_qty = (
                SELECT stock_qty
                FROM purchase
                WHERE purchase.product_id = products.product_id
              )
              WHERE EXISTS (
              SELECT 1
                FROM purchase
                WHERE purchase.product_id = products.product_id
                )`,
    params: [],
  });

  try {
    const results = await runScriptsSequentially(scripts, {
      useTransaction: false,
    });
    res.status(201).json({
      message: "Product stock data processed successfully!",
      result: results,
    });
  } catch (error) {
    console.error("Error processing product stock data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
