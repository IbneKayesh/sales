const express = require("express");
const router = express.Router();
const {
  runScriptsSequentially,
  dbRun,
  dbGet,
  dbAll,
} = require("../../db/asyncScriptsRunner");

// Update invoice due
router.post("/update-invoice-due", async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }

  //1.1 Update Purchase Payment and Due Amount
  //1.2 Update Sales Payment and Due Amount
  //2.1 Update Purchase Payment status
  //2.2 Update Sales Payment status
  //3.1 Update Purchase Complete status
  //3.2 Update Sales Complete status

  const scripts = [];

  scripts.push({
    label: "1.1 Update Purchase Payment and Due Amount",
    sql: `WITH pay AS (
      SELECT pom.order_no, IFNULL(SUM(bp.payment_amount), 0) AS payment_amount
      FROM po_master pom
      LEFT JOIN bank_payments bp
          ON pom.contact_id = bp.contact_id AND pom.order_no = bp.ref_no AND pom.order_type = bp.payment_head
      WHERE pom.is_paid IN ('Partial', 'Unpaid')
      GROUP BY pom.order_no
  )
  UPDATE po_master
  SET 
      paid_amount = (SELECT payment_amount FROM pay WHERE pay.order_no = po_master.order_no),
      due_amount  = payable_amount - (SELECT payment_amount FROM pay WHERE pay.order_no = po_master.order_no)
  WHERE order_no IN (SELECT order_no FROM pay)`,
    params: [],
  });

  scripts.push({
    label: "1.2 Update Sales Payment and Due Amount",
    sql: `WITH pay AS (
      SELECT som.order_no, IFNULL(SUM(bp.payment_amount), 0) AS payment_amount
      FROM so_master som
      LEFT JOIN bank_payments bp
          ON som.contact_id = bp.contact_id AND som.order_no = bp.ref_no AND som.order_type = bp.payment_head
      WHERE som.is_paid IN ('Partial', 'Unpaid')
      GROUP BY som.order_no
  )
  UPDATE so_master
  SET 
      paid_amount = (SELECT payment_amount FROM pay WHERE pay.order_no = so_master.order_no),
      due_amount  = payable_amount - (SELECT payment_amount FROM pay WHERE pay.order_no = so_master.order_no)
  WHERE order_no IN (SELECT order_no FROM pay)`,
    params: [],
  });

  scripts.push({
    label: "2.1 Update Purchase Payment status",
    sql: `UPDATE po_master
            SET is_paid = 'Paid'
            WHERE is_paid IN ('Partial', 'Unpaid')
            AND due_amount = 0
            AND payable_amount = paid_amount`,
    params: [],
  });

  scripts.push({
    label: "2.2 Update Sales Payment status",
    sql: `UPDATE so_master
            SET is_paid = 'Paid'
            WHERE is_paid IN ('Partial', 'Unpaid')
            AND due_amount = 0
            AND payable_amount = paid_amount`,
    params: [],
  });

  scripts.push({
    label: "3.1 Update Purchase Complete status",
    sql: `UPDATE po_master
            SET is_completed = 1
            WHERE is_paid = 'Paid'
            AND is_posted = 1
            AND is_completed = 0`,
    params: [],
  });

  scripts.push({
    label: "3.2 Update Sales Complete status",
    sql: `UPDATE so_master
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
      message: "Invoice data processed successfully!",
      result: results,
    });
  } catch (error) {
    console.error("Error processing invoice data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Update balances
router.post("/update-balances", async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }

//1.1 Set 0 balance for all contacts
//1.2 Update contact current balance from Purchase and Sales dues
//2.0 Update bank accounts from payments


  const scripts = [];

  scripts.push({
    label: "1.1 Set 0 balance for all contacts",
    sql: `UPDATE contacts SET current_balance = 0 WHERE current_balance != 0`,
    params: [],
  });

  scripts.push({
    label: "1.2 Update contact current balance from Purchase and Sales dues",
    sql: `WITH cr_balance AS (
            SELECT contact_id, sum(due_amount) credit_amount
            FROM (
                SELECT contact_id, due_amount
                FROM po_master
                WHERE due_amount > 0
                UNION ALL
                SELECT contact_id, 0-due_amount
                FROM so_master
                WHERE due_amount > 0
            )invoice
            GROUP by contact_id
          )
          UPDATE contacts
          SET current_balance = (
          SELECT credit_amount
          FROM cr_balance
          WHERE cr_balance.contact_id = contacts.contact_id
          )
          WHERE EXISTS (
          SELECT 1
          FROM cr_balance
          WHERE cr_balance.contact_id = contacts.contact_id
          )`,
    params: [],
  });

  scripts.push({
    label: "2.0 Update bank accounts from payments",
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
//1.1 Update Purchase Details > Sales Qty from Sales Details
//0.0 Update actual order_qty in so_details when return raised
//1.2 Update Purchase Details > Stock Qty
//2.1 Reset all product stock
//2.2 Update all product stock from Purchase Details > Stock Qty



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
    label: "1.1 Update Purchase Details > Sales Qty from Sales Details",
    sql: `WITH sales AS (
              SELECT pod.po_details_id,sum(sod.order_qty)sales_qty
              FROM po_details pod
              JOIN so_details sod on pod.po_details_id = sod.ref_id
              WHERE pod.stock_qty > 0
              GROUP by pod.po_details_id
          )
          UPDATE po_details
          SET sales_qty = (
          SELECT sales_qty
          FROM sales
          WHERE sales.po_details_id = po_details.po_details_id
          )
          WHERE EXISTS (
          SELECT 1
          FROM sales
          WHERE sales.po_details_id = po_details.po_details_id
          )`,
    params: [],
  });

  scripts.push({
    label: "1.2 Update Purchase Details > Stock Qty",
    sql: `UPDATE po_details
          SET stock_qty = product_qty - (return_qty + sales_qty)
          WHERE stock_qty > 0`,
    params: [],
  });

  scripts.push({
    label: "2.1 Reset all product stock",
    sql: `UPDATE products SET stock_qty = 0 WHERE stock_qty > 0`,
    params: [],
  });

  scripts.push({
    label: "2.2 Update all product stock from Purchase Details > Stock Qty",
    sql: `WITH purchase AS (
                SELECT pod.product_id, sum(pod.stock_qty)stock_qty
                FROM po_details pod
                WHERE pod.stock_qty > 0
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
