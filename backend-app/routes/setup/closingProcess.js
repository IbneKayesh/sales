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

  const scripts = [];

  scripts.push({
    label:
      "1 of 7 :: Update payment balance from payment details allocation [due payment]",
    sql: `WITH allocation AS (
          SELECT pmd.payment_id, sum(pmd.allocation_amount)allocation_amount
          FROM payment_details pmd
          JOIN payments pm on pmd.payment_id = pm.payment_id
          WHERE pm.balance_amount > 0
          GROUP by pmd.payment_id
          )
          UPDATE payments
          SET
            balance_amount = (
            SELECT allocation_amount FROM allocation
            WHERE allocation.payment_id = payments.payment_id
            )
          WHERE payment_id in (SELECT payment_id FROM allocation)`,
    params: [],
  });

  scripts.push({
    label: "2 of 7 :: Update Purchase Due Amount",
    sql: `WITH pay AS (
      SELECT pom.order_no, IFNULL(SUM(pmd.allocation_amount), 0) AS payment_amount
      FROM po_master pom
	  LEFT JOIN payments pm on pom.contact_id = pm.contact_id
      LEFT JOIN payment_details pmd on pmd.payment_id = pm.payment_id AND pom.order_no = pmd.ref_no
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
    label: "3 of 7 :: Update Sales Due Amount",
    sql: `WITH pay AS (
            SELECT pom.order_no, IFNULL(SUM(pmd.allocation_amount), 0) AS payment_amount
            FROM so_master pom
          LEFT JOIN payments pm on pom.contact_id = pm.contact_id
            LEFT JOIN payment_details pmd on pmd.payment_id = pm.payment_id AND pom.order_no = pmd.ref_no
            WHERE pom.is_paid IN ('Partial', 'Unpaid')
            GROUP BY pom.order_no
        )
        UPDATE so_master
        SET 
            paid_amount = (SELECT payment_amount FROM pay WHERE pay.order_no = so_master.order_no),
            due_amount  = payable_amount - (SELECT payment_amount FROM pay WHERE pay.order_no = so_master.order_no)
        WHERE order_no IN (SELECT order_no FROM pay)`,
    params: [],
  });

  scripts.push({
    label: "4 of 7 :: Update Purchase Payment status",
    sql: `UPDATE po_master
            SET is_paid = 'Paid'
            WHERE is_paid IN ('Partial', 'Unpaid')
            AND due_amount = 0
            AND payable_amount = paid_amount`,
    params: [],
  });

  scripts.push({
    label: "5 of 7 :: Update Sales Payment status",
    sql: `UPDATE so_master
            SET is_paid = 'Paid'
            WHERE is_paid IN ('Partial', 'Unpaid')
            AND due_amount = 0
            AND payable_amount = paid_amount`,
    params: [],
  });

  scripts.push({
    label: "6 of 7 :: Update Purchase Complete status",
    sql: `UPDATE po_master
            SET is_completed = 1
            WHERE is_paid = 'Paid'
            AND is_posted = 1
            AND is_completed = 0`,
    params: [],
  });

  scripts.push({
    label: "7 of 7 :: Update Sales Complete status",
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

  const scripts = [];

  scripts.push({
    label: "1 of 3 :: Set 0 balance for all contacts",
    sql: `UPDATE contacts SET current_balance = 0 WHERE current_balance != 0`,
    params: [],
  });

  scripts.push({
    label:
      "2 of 3 :: Update contact current balance from Purchase and Sales dues",
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
    label: "3 of 3 :: Update bank accounts from payments",
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
    label: "1 of 5 :: Update Purchase Details > Sales Qty from Sales Details",
    sql: `WITH sales AS (
              SELECT pod.po_details_id,sum(sod.sales_qty)sales_qty
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
    label: "2 of 5 :: Update Purchase Details > Stock Qty",
    sql: `UPDATE po_details
          SET stock_qty = product_qty - (return_qty + sales_qty)
          WHERE stock_qty > 0`,
    params: [],
  });

  scripts.push({
    label: "3 of 5 :: Reset all product stock, booking qty",
    sql: `UPDATE products SET stock_qty = 0, purchase_booking_qty = 0 WHERE stock_qty > 0 OR purchase_booking_qty > 0`,
    params: [],
  });

  scripts.push({
    label:
      "4 of 5 :: Update all product stock from Purchase Details > Stock Qty",
    sql: `WITH purchase AS (
                SELECT pod.product_id, sum(pod.stock_qty)stock_qty
                FROM po_details pod
                JOIN po_master pom on pod.po_master_id = pom.po_master_id
                WHERE pom.is_posted = 1
                AND pod.stock_qty > 0
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

  scripts.push({
    label:
      "5 of 5 :: Update all product purchase_booking_qty from Purchase Details > Product Qty",
    sql: `WITH purchase AS (
                SELECT pod.product_id, sum(pod.product_qty)purchase_booking_qty
                FROM po_details pod
                JOIN po_master pom on pod.po_master_id = pom.po_master_id
                WHERE pom.is_posted = 0
                AND pod.product_qty > 0
                GROUP by pod.product_id
              )
              UPDATE products
              SET
                purchase_booking_qty = (
                SELECT purchase_booking_qty
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


//purchase-booking-cancel
router.post("/purchase-booking-cancel", async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Transaction ID is required" });
  }

  const scripts = [];

  scripts.push({
    label: "1 of 4 :: Update purchase booking cancelled flag",
    sql: `WITH cancelledPO as (
		SELECT pom.master_id
		FROM po_booking pob
		JOIN po_master pom on pob.master_id = pom.master_id
		WHERE pob.cancelled_qty > 0
		AND pom.has_cancelled = 0
		)
		UPDATE po_master
		SET has_cancelled = 1
		WHERE has_cancelled = 0
		AND master_id in (
		SELECT master_id FROM cancelledPO
		)`,
    params: [],
  });

  // scripts.push({
  //   label: "2 of 4 :: update purchase cost price",
  //   sql: ``,
  //   params: [],
  // });


  scripts.push({
    label: "3 of 4 :: Reset products purchase booking qty",
    sql: `UPDATE products
    SET purchase_booking_qty = 0
    WHERE purchase_booking_qty > 0 `,
    params: [],
  });

  scripts.push({
    label: "4 of 4 :: Update products purchase booking qty",
    sql: `WITH booking as (
      SELECT pob.product_id, sum(pob.pending_qty) as purchase_booking_qty
      FROM po_booking pob
      JOIN po_master pobm on pob.master_id = pobm.master_id
      WHERE pob.pending_qty > 0
      AND pobm.is_posted = 1
      GROUP by pob.product_id
      )
      UPDATE products
      SET purchase_booking_qty = (
        SELECT b.purchase_booking_qty
        FROM booking b
        WHERE b.product_id = products.product_id
      )
      WHERE products.product_id in (
        SELECT b.product_id
        FROM booking b
      )`,
    params: [],
  });


  try {
    const results = await runScriptsSequentially(scripts, {
      useTransaction: false,
    });
    res.status(201).json({
      message: "Data processed successfully!",
      result: results,
    });
  } catch (error) {
    console.error("Error processing data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


//purchase-invoice
router.post("/purchase-invoice", async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Transaction ID is required" });
  }

  const scripts = [];

  scripts.push({
    label: "1 of 6 :: Update purchase booking invoice_qty and pending_qty",
    sql: `WITH invoice as (
              SELECT poi.booking_id, sum(poi.product_qty) as product_qty
              FROM po_booking pob
              JOIN po_invoice poi on pob.booking_id = poi.booking_id
              WHERE pob.pending_qty > 0
              GROUP by poi.booking_id
              )
              UPDATE po_booking
              SET
              invoice_qty = (SELECT inv.product_qty
                FROM invoice inv
                WHERE po_booking.booking_id = inv.booking_id
                ),
              pending_qty = po_booking.product_qty - 
                (SELECT inv.product_qty
                FROM invoice inv
                WHERE po_booking.booking_id = inv.booking_id
                )
              WHERE po_booking.pending_qty > 0
              AND po_booking.booking_id in (
              SELECT booking_id
              FROM invoice
              )`,
    params: [],
  });

  scripts.push({
    label: "2 of 6 :: Reset products purchase booking qty",
    sql: `UPDATE products
    SET purchase_booking_qty = 0
    WHERE purchase_booking_qty > 0 `,
    params: [],
  });

  scripts.push({
    label: "3 of 6 :: Update products purchase booking qty",
    sql: `WITH booking as (
      SELECT pob.product_id, sum(pob.pending_qty) as purchase_booking_qty
      FROM po_booking pob
      JOIN po_master pobm on pob.master_id = pobm.master_id
      WHERE pob.pending_qty > 0
      AND pobm.is_posted = 1
      GROUP by pob.product_id
      )
      UPDATE products
      SET purchase_booking_qty = (
        SELECT b.purchase_booking_qty
        FROM booking b
        WHERE b.product_id = products.product_id
      )
      WHERE products.product_id in (
        SELECT b.product_id
        FROM booking b
      )`,
    params: [],
  });

  scripts.push({
    label: "4 of 6 :: Reset products stock qty",
    sql: `UPDATE products
    SET stock_qty = 0
    WHERE stock_qty > 0 `,
    params: [],
  });

  scripts.push({
    label: "5 of 6 :: Update products stock qty",
    sql: `WITH stock as (
          SELECT product_id, sum(stock_qty)as stock_qty
          FROM (
                SELECT poo.product_id,poo.stock_qty
                FROM po_order poo
                WHERE poo.stock_qty > 0
              UNION ALL
              SELECT por.product_id,por.stock_qty
                FROM po_invoice por
              WHERE por.stock_qty > 0
              )
          GROUP by product_id
      )
      UPDATE products
      SET stock_qty = (
        SELECT s.stock_qty
        FROM stock s
        WHERE products.product_id = s.product_id
        )
      WHERE products.product_id in (
        SELECT s.product_id
        FROM stock s
        )`,
    params: [],
  });

  scripts.push({
    label: "6 of 6 :: Update booking close status",
    sql: `WITH booking_closed as (
                SELECT pob.master_id, sum(pob.pending_qty) as pending_qty
                FROM po_master pom
                JOIN po_booking pob on pom.master_id = pob.master_id
                WHERE pom.order_type = 'Booking'
                AND pom.is_paid = 'Paid'
                AND pom.is_posted = 1
                AND pom.is_closed = 0
                GROUP by pob.master_id
                HAVING sum(pob.pending_qty) = 0
                )
                UPDATE po_master
                SET is_closed = 1
                WHERE is_closed = 0
                AND order_type = 'Booking'
                AND is_paid = 'Paid'
                AND is_posted = 1
                AND master_id in 
                (SELECT master_id from booking_closed)`,
    params: [],
  });

  try {
    const results = await runScriptsSequentially(scripts, {
      useTransaction: false,
    });
    res.status(201).json({
      message: "Data processed successfully!",
      result: results,
    });
  } catch (error) {
    console.error("Error processing data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//purchase-order
router.post("/purchase-order", async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Transaction ID is required" });
  }

  const scripts = [];

  scripts.push({
    label: "1 of 2 :: Reset products stock qty",
    sql: `UPDATE products
    SET stock_qty = 0
    WHERE stock_qty > 0 `,
    params: [],
  });

  scripts.push({
    label: "2 of 2 :: Update products stock qty",
    sql: `WITH stock as (
          SELECT product_id, sum(stock_qty)as stock_qty
          FROM (
                SELECT poo.product_id,poo.stock_qty
                FROM po_order poo
                WHERE poo.stock_qty > 0
              UNION ALL
              SELECT por.product_id,por.stock_qty
                FROM po_invoice por
              WHERE por.stock_qty > 0
              )
          GROUP by product_id
      )
      UPDATE products
      SET stock_qty = (
        SELECT s.stock_qty
        FROM stock s
        WHERE products.product_id = s.product_id
        )
      WHERE products.product_id in (
        SELECT s.product_id
        FROM stock s
        )`,
    params: [],
  });

  try {
    const results = await runScriptsSequentially(scripts, {
      useTransaction: false,
    });
    res.status(201).json({
      message: "Data processed successfully!",
      result: results,
    });
  } catch (error) {
    console.error("Error processing data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//purchase-return
router.post("/purchase-return", async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Transaction ID is required" });
  }

  const scripts = [];

  scripts.push({
    label: "1 of 4 :: Update purchase details return_qty from return purchase",
    sql: `WITH returnQty as (
            SELECT por.invoice_order_id, sum(por.product_qty) as product_qty
            FROM po_return por
            WHERE por.source_type = 'Order'
            GROUP by por.invoice_order_id
          )
          UPDATE po_order
          SET returned_qty = (
              SELECT rq.product_qty
              FROM returnQty rq
              WHERE po_order.order_id = rq.invoice_order_id
          ),
          stock_qty = po_order.product_qty - (
              SELECT rq.product_qty
              FROM returnQty rq
              WHERE po_order.order_id = rq.invoice_order_id
          ) - po_order.sales_qty
          WHERE po_order.order_id in (
          SELECT invoice_order_id
          FROM returnQty
          )`,
    params: [],
  });

  scripts.push({
    label: "2 of 4 :: Update purchase details return_qty from return purchase",
    sql: `WITH returnQty as (
            SELECT por.invoice_order_id, sum(por.product_qty) as product_qty
            FROM po_return por
            WHERE por.source_type = 'Invoice'
            GROUP by por.invoice_order_id
          )
          UPDATE po_invoice
          SET returned_qty = (
              SELECT rq.product_qty
              FROM returnQty rq
              WHERE po_invoice.invoice_id = rq.invoice_order_id
          ),
          stock_qty = po_invoice.product_qty - (
              SELECT rq.product_qty
              FROM returnQty rq
              WHERE po_invoice.invoice_id = rq.invoice_order_id
          ) - po_invoice.sales_qty
          WHERE po_invoice.invoice_id in (
          SELECT invoice_order_id
          FROM returnQty
          )`,
    params: [],
  });

  scripts.push({
    label: "3 of 4 :: Reset products stock qty",
    sql: `UPDATE products
    SET stock_qty = 0
    WHERE stock_qty > 0 `,
    params: [],
  });

  scripts.push({
    label: "4 of 3 :: Update products stock qty",
    sql: `WITH stock as (
          SELECT product_id, sum(stock_qty)as stock_qty
          FROM (
                SELECT poo.product_id,poo.stock_qty
                FROM po_order poo
                WHERE poo.stock_qty > 0
              UNION ALL
              SELECT por.product_id,por.stock_qty
                FROM po_invoice por
              WHERE por.stock_qty > 0
              )
          GROUP by product_id
      )
      UPDATE products
      SET stock_qty = (
        SELECT s.stock_qty
        FROM stock s
        WHERE products.product_id = s.product_id
        )
      WHERE products.product_id in (
        SELECT s.product_id
        FROM stock s
        )`,
    params: [],
  });

  try {
    const results = await runScriptsSequentially(scripts, {
      useTransaction: false,
    });
    res.status(201).json({
      message: "Data processed successfully!",
      result: results,
    });
  } catch (error) {
    console.error("Error processing data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//payable-due
router.post("/payable-due", async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Transaction ID is required" });
  }

  const scripts = [];

  scripts.push({
    label: "1 of 3 :: Update purchase payment and dues",
    sql: `WITH payment as (
      SELECT pom.master_id,sum(pym.payment_amount)as payment_amount
      FROM po_master pom
      JOIN payments pym on pom.master_id = pym.master_id
      WHERE pom.due_amount > 0
      AND pom.order_type in ('Booking', 'Order')
      AND pom.is_paid in ('Partial','Unpaid')
      GROUP by pom.master_id
      UNION ALL
      SELECT pom.master_id,sum(pym.payment_amount)as payment_amount
      FROM po_master pom
      JOIN payments pym on pom.master_id = pym.master_id
      WHERE pom.due_amount < 0
      AND pom.order_type in ('Booking')
      AND pom.has_cancelled = 1
      GROUP by pom.master_id
      )
      UPDATE po_master
      SET paid_amount = (
                SELECT p.payment_amount 
                FROM payment p
                WHERE po_master.master_id = p.master_id
              ),
        due_amount = payable_amount - (
                SELECT p.payment_amount 
                FROM payment p
                WHERE po_master.master_id = p.master_id
              )
      WHERE po_master.master_id in (
          SELECT p.master_id 
          FROM payment p
      )`,
    params: [],
  });

  scripts.push({
    label: "2 of 3 :: Update purchase payment status paid",
    sql: `UPDATE po_master
    SET is_paid = 'Paid'
    WHERE due_amount = 0
    AND order_type in ('Booking', 'Order')
    AND is_paid in ('Partial','Unpaid')`,
    params: [],
  });

  scripts.push({
    label: "3 of 3 :: Update purchase payment status partial",
    sql: `UPDATE po_master
    SET is_paid = 'Partial'
    WHERE due_amount > 0
    AND due_amount < payable_amount
    AND order_type in ('Booking', 'Order')
    AND is_paid in ('Partial','Unpaid')`,
    params: [],
  });

  try {
    const results = await runScriptsSequentially(scripts, {
      useTransaction: false,
    });
    res.status(201).json({
      message: "Data processed successfully!",
      result: results,
    });
  } catch (error) {
    console.error("Error processing data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});




//accounts-ledger
router.post("/accounts-ledger", async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Transaction ID is required" });
  }

  const scripts = [];

  scripts.push({
    label: "1 of 2 :: Update accounts current balance",
    sql: `WITH cb as (
            SELECT al.account_id ,sum(al.debit_amount - al.credit_amount) as current_balance
            FROM accounts_ledger al
            GROUP by al.account_id
            )
            UPDATE accounts
            SET current_balance = (
            SELECT current_balance
            FROM cb
            WHERE cb.account_id = accounts.account_id
            )
            WHERE accounts.account_id in (
            SELECT account_id FROM cb
            )`,
    params: [],
  });

  scripts.push({
    label: "2 of 2 :: Update bank current balance",
    sql: `WITH cb as (
          SELECT bank_id, sum(current_balance) as current_balance
          FROM accounts
          GROUP by bank_id
          )
          UPDATE banks
          SET current_balance = (
          SELECT current_balance from cb WHERE cb.bank_id = banks.bank_id
          )
          WHERE bank_id in (
          SELECT bank_id FROM cb
          )`,
    params: [],
  });

  try {
    const results = await runScriptsSequentially(scripts, {
      useTransaction: false,
    });
    res.status(201).json({
      message: "Data processed successfully!",
      result: results,
    });
  } catch (error) {
    console.error("Error processing data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
