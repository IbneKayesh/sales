//example as units.js
const express = require("express");
const router = express.Router();

const { generateGuid } = require("../../guid.js");

const {
  runScriptsSequentially,
  dbRun,
  dbGet,
  dbAll,
} = require("../../db/asyncScriptsRunner");

//get all purchase orders
router.get("/", async (req, res) => {
  const { poType, filter } = req.query;
  try {
    let whereClause = "";
    if (poType) {
      whereClause = "WHERE pom.order_type = '" + poType + "' ";
    }
    switch (filter) {
      case "7days":
        whereClause +=
          " AND pom.is_paid = 'Paid' AND pom.is_posted = 1 AND pom.is_completed = 1 AND pom.order_date >= date('now', '-7 days')";
        break;
      case "30days":
        whereClause +=
          " AND pom.is_paid = 'Paid' AND pom.is_posted = 1 AND pom.is_completed = 1 AND pom.order_date >= date('now', '-30 days')";
        break;
      case "90days":
        whereClause +=
          " AND pom.is_paid = 'Paid' AND pom.is_posted = 1 AND pom.is_completed = 1 AND pom.order_date >= date('now', '-90 days')";
        break;
      case "alldays":
        whereClause +=
          " AND pom.is_paid = 'Paid' AND pom.is_posted = 1 AND pom.is_completed = 1";
        break;
      case "default":
      default:
        whereClause +=
          " AND pom.is_paid != 'Paid' OR pom.is_posted = 0 OR pom.is_completed = 0";
        break;
    }
    const sql = `SELECT pom.*, c.contact_name, is_posted as isedit,0 as ismodified
                    FROM po_master pom
                    LEFT JOIN contacts c ON pom.contact_id = c.contact_id
                    ${whereClause}`;
    const rows = await dbAll(sql, []);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching purchase orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//create new purchase master, details and payments
router.post("/", async (req, res) => {
  try {
    const {
      po_master_id,
      order_type,
      order_no,
      order_date,
      contact_id,
      ref_no,
      order_note,
      order_amount,
      discount_amount,
      vat_amount,
      vat_payable,
      order_cost,
      cost_payable,
      total_amount,
      payable_amount,
      paid_amount,
      due_amount,
      other_cost,
      is_paid,
      is_posted,
      is_completed,
      is_returned,
      details_create,
      payments_create,
    } = req.body;

    //validate
    if (
      !po_master_id ||
      !order_type ||
      !order_date ||
      !contact_id ||
      !order_amount ||
      !details_create ||
      !Array.isArray(details_create)
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    //generate order no
    //order no format: order_type split word and take first  Char of each word - ddmmyy - max_sequence_no
    const prefix = order_type
      .split(" ")
      .map((word) => word[0])
      .join("");
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yy = String(now.getFullYear()).slice(-2);
    const date_part = dd + mm + yy;

    const sql = `SELECT MAX(CAST(SUBSTR(order_no, -5) AS INTEGER)) as max_seq
    FROM po_master
    WHERE order_type = ?
    AND strftime('%Y-%m-%d', order_date) = strftime('%Y-%m-%d', 'now')`;

    const max_seq = await dbGet(sql, [order_type]);
    const max_seq_no = String((max_seq.max_seq || 0) + 1).padStart(5, "0");
    const order_no_new = `${prefix}-${date_part}-${max_seq_no}`;
    console.log("New Transaction No: " + order_no_new);

    // //fetch default bank account
    // const bank_account = await dbGet(
    //   "SELECT * FROM bank_accounts WHERE is_default = 1",
    //   []
    // );
    // if (!bank_account) {
    //   return res.status(400).json({ error: "Default bank account not found" });
    // }
    // const bank_account_id = bank_account.account_id;

    //build scripts
    const scripts = [];

    //Insert order Master
    scripts.push({
      label: "Insert Purchase Master " + order_no_new,
      sql: `INSERT INTO po_master (po_master_id, order_type, order_no, order_date, contact_id, ref_no,
      order_note, order_amount, discount_amount, vat_amount, vat_payable, order_cost, cost_payable,
      total_amount, payable_amount, paid_amount, due_amount, other_cost,
      is_paid, is_posted, is_completed, is_returned)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      params: [
        po_master_id,
        order_type,
        order_no_new,
        order_date,
        contact_id,
        ref_no,
        order_note,
        order_amount || 0,
        discount_amount || 0,
        vat_amount || 0,
        vat_payable || 0,
        order_cost || 0,
        cost_payable || 0,
        total_amount || 0,
        payable_amount || 0,
        paid_amount || 0,
        due_amount || 0,
        other_cost || 0,
        is_paid || "Unpaid",
        is_posted || 0,
        is_completed || 0,
        is_returned || 0,
      ],
    });

    //Insert order Details
    for (const detail of details_create) {
      scripts.push({
        label: "Insert Purchase Detail " + order_no_new,
        sql: `INSERT INTO po_details (po_details_id, po_master_id, product_id, product_price, product_qty,
        discount_percent, discount_amount, vat_percent, vat_amount, cost_price, total_amount,
        product_note, ref_id, return_qty, sales_qty, stock_qty)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        params: [
          detail.po_details_id,
          po_master_id,
          detail.product_id,
          detail.product_price || 0,
          detail.product_qty || 0,
          detail.discount_percent || 0,
          detail.discount_amount || 0,
          detail.vat_percent || 0,
          detail.vat_amount || 0,
          detail.cost_price || 0,
          detail.total_amount || 0,
          detail.product_note,
          detail.ref_id,
          0,
          0,
          detail.product_qty || 0,
        ],
      });
    }


    //payment scripts
    const paymentScripts = paymentScriptsGen(
      payable_amount,
      other_cost,
      vat_payable,
      vat_amount,
      cost_payable,
      order_cost,
      order_no_new,
      order_date,
      order_type,
      contact_id,
      payments_create
    );

    scripts.push(...paymentScripts);

    const results = await runScriptsSequentially(scripts, {
      useTransaction: true,
    });
    // If any failed, transaction has already rolled back
    if (!results.every((r) => r.success)) {
      return res.status(500).json({ error: "Failed to create purchase order" });
    }
    // ❗ Only one response is sent
    res.status(201).json({
      message: "Purchase Order created successfully!",
      po_master_id,
      order_no: order_no_new,
      details_create,
      payments_create,
    });
  } catch (error) {
    console.error("Error creating purchase master:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//create new purchase master, details and payments
router.post("/update", async (req, res) => {
  try {
    const {
      po_master_id,
      order_type,
      order_no,
      order_date,
      contact_id,
      ref_no,
      order_note,
      order_amount,
      discount_amount,
      vat_amount,
      vat_payable,
      order_cost,
      cost_payable,
      total_amount,
      payable_amount,
      paid_amount,
      due_amount,
      other_cost,
      is_paid,
      is_posted,
      is_completed,
      is_returned,
      details_create,
      payments_create,
    } = req.body;

    //validate
    if (
      !po_master_id ||
      !order_type ||
      !order_date ||
      !contact_id ||
      !order_amount ||
      !details_create ||
      !Array.isArray(details_create)
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // //fetch default bank account
    // const bank_account = await dbGet(
    //   "SELECT * FROM bank_accounts WHERE is_default = 1",
    //   []
    // );
    // if (!bank_account) {
    //   return res.status(400).json({ error: "Default bank account not found" });
    // }
    // const bank_account_id = bank_account.account_id;

    //build scripts
    const scripts = [];

    //delete details
    scripts.push({
      label: `Delete Details ${order_no}`,
      sql: `DELETE FROM po_details WHERE po_master_id = ?`,
      params: [po_master_id],
    });

    //delete payment details
    scripts.push({
      label: `Delete Payment Details ${order_no}`,
      sql: `DELETE FROM payment_details WHERE ref_no = ?`,
      params: [order_no],
    });

    //delete payment master
    scripts.push({
      label: `Delete Payment Master ${order_no}`,
      sql: `DELETE FROM payments WHERE ref_no = ?`,
      params: [order_no],
    });

    //delete accounts ledger
    scripts.push({
      label: `Delete Accounts Ledger ${order_no}`,
      sql: `DELETE FROM accounts_ledger WHERE ref_no = ?`,
      params: [order_no],
    });

    //Update Master
    scripts.push({
      label: "Update Purchase Master " + order_no,
      sql: `UPDATE po_master SET
      order_date = ?,
      ref_no = ?,
      order_note = ?,
      order_amount = ?,
      discount_amount = ?,
      vat_amount = ?,
      vat_payable = ?,
      order_cost = ?,
      cost_payable = ?,
      total_amount = ?,
      payable_amount = ?,
      paid_amount = ?,
      due_amount = ?,
      other_cost = ?,
      is_paid = ?,
      is_posted = ?,
      updated_at = CURRENT_TIMESTAMP
      WHERE po_master_id = ?`,
      params: [
        order_date,
        ref_no,
        order_note,
        order_amount || 0,
        discount_amount || 0,
        vat_amount || 0,
        vat_payable || 0,
        order_cost || 0,
        cost_payable || 0,
        total_amount || 0,
        payable_amount || 0,
        paid_amount || 0,
        due_amount || 0,
        other_cost || 0,
        is_paid || "Unpaid",
        is_posted || 0,
        po_master_id,
      ],
    });

    //Insert Details
    for (const detail of details_create) {
      scripts.push({
        label: "Insert Purchase Detail " + order_no,
        sql: `INSERT INTO po_details (po_details_id, po_master_id, product_id, product_price, product_qty,
        discount_percent, discount_amount, vat_percent, vat_amount, cost_price, total_amount,
        product_note, ref_id, return_qty, sales_qty, stock_qty)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        params: [
          detail.po_details_id,
          po_master_id,
          detail.product_id,
          detail.product_price || 0,
          detail.product_qty || 0,
          detail.discount_percent || 0,
          detail.discount_amount || 0,
          detail.vat_percent || 0,
          detail.vat_amount || 0,
          detail.cost_price || 0,
          detail.total_amount || 0,
          detail.product_note,
          detail.ref_id,
          0,
          0,
          detail.product_qty || 0,
        ],
      });
    }

    //payment scripts
    const paymentScripts = paymentScriptsGen(
      payable_amount,
      other_cost,
      vat_payable,
      vat_amount,
      cost_payable,
      order_cost,
      order_no,
      order_date,
      order_type,
      contact_id,
      payments_create
    );

    scripts.push(...paymentScripts);

    const results = await runScriptsSequentially(scripts, {
      useTransaction: true,
    });
    // If any failed, transaction has already rolled back
    if (!results.every((r) => r.success)) {
      return res.status(500).json({ error: "Failed to update purchase order" });
    }
    // ❗ Only one response is sent
    res.status(201).json({
      message: "Purchase Order updated successfully!",
      po_master_id,
      order_no,
      details_create,
      payments_create,
    });
  } catch (error) {
    console.error("Error updating purchase master:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

function paymentScriptsGen(
  payable_amount,
  other_cost,
  vat_payable,
  vat_amount,
  cost_payable,
  order_cost,
  order_no_new,
  order_date,
  order_type,
  contact_id,
  payments_create
) {
  const scripts = [];

  //Insert Purchase Ledger Product :: Supplier Account Credit
  scripts.push({
    label:
      "Insert Purchase Ledger Product :: Supplier Account Credit " +
      order_no_new,
    sql: `INSERT INTO accounts_ledger (ledger_id, contact_id, payment_head, payment_mode, payment_date,
      ref_no, debit_amount, credit_amount, payment_note)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    params: [
      generateGuid(),
      contact_id,
      order_type,
      "Product",
      order_date,
      order_no_new,
      0,
      payable_amount || 0,
      "Purchase Product - Credit",
    ],
  });

  //Insert Purchase Ledger Product Expense :: Expense Account Credit
  const other_cost_amount = other_cost || 0;
  const vat_payable_amount = vat_payable ? 0 : vat_amount || 0; //ignore vat amount if vat payable
  const cost_payable_amount = cost_payable ? 0 : order_cost || 0; //ignore cost payable amount if cost payable
  const total_other_cost =
    other_cost_amount + vat_payable_amount + cost_payable_amount;

  if (other_cost_amount > 0) {
    scripts.push({
      label:
        "Insert Purchase Ledger Product Expense :: Expense Account Credit " +
        order_no_new,
      sql: `INSERT INTO accounts_ledger (ledger_id, contact_id, payment_head, payment_mode, payment_date,
      ref_no, debit_amount, credit_amount, payment_note)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      params: [
        generateGuid(),
        "expense",
        order_type,
        "Purchase Expense",
        order_date,
        order_no_new,
        0,
        total_other_cost,
        "Purchase Product - Credit",
      ],
    });
  }

  //Insert Payment Master :: Supplier Account Debit
  //Insert Payment Master :: Cash Account Credit
  for (const payment of payments_create) {
    const payment_id_new = generateGuid();

    // payment master
    scripts.push({
      label: "Insert Purchase Payment " + order_no_new,
      sql: `INSERT INTO payments (payment_id, contact_id, payment_head, payment_mode, payment_date,
        payment_amount, balance_amount, payment_note, ref_no)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      params: [
        payment_id_new,
        contact_id,
        order_type,
        payment.payment_mode,
        order_date,
        payment.payment_amount || 0,
        0,
        payment.payment_note,
        order_no_new,
      ],
    });

    //payment details allocation
    scripts.push({
      label: "Insert Purchase Payment Details" + order_no_new,
      sql: `INSERT INTO payment_details (payment_id, ref_no, allocation_amount)
        VALUES (?, ?, ?)`,
      params: [payment_id_new, order_no_new, payment.payment_amount || 0],
    });

    //supplier account debit
    scripts.push({
      label:
        "Insert Purchase Ledger Payment :: Supplier Account Debit " +
        order_no_new,
      sql: `INSERT INTO accounts_ledger (ledger_id, contact_id, payment_head, payment_mode, payment_date,
      ref_no, debit_amount, credit_amount, payment_note)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      params: [
        generateGuid(),
        contact_id,
        order_type,
        "Product Payment",
        order_date,
        order_no_new,
        payment.payment_amount || 0,
        0,
        payment.payment_note,
      ],
    });

    //cash account credit
    scripts.push({
      label:
        "Insert Purchase Ledger Payment :: Cash Account Credit " + order_no_new,
      sql: `INSERT INTO accounts_ledger (ledger_id, contact_id, payment_head, payment_mode, payment_date,
      ref_no, debit_amount, credit_amount, payment_note)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      params: [
        generateGuid(),
        "cash",
        order_type,
        "Product Payment",
        order_date,
        order_no_new,
        0,
        payment.payment_amount || 0,
        payment.payment_note,
      ],
    });
  }

  return scripts;
}

//get purchase details by po_master_id
router.get("/details/:poMasterId", async (req, res) => {
  try {
    const { poMasterId } = req.params;
    const sql = `SELECT pod.*,
    p.product_code,
    p.product_name,
    p.unit_difference_qty,
    su.unit_name as small_unit_name,
    lu.unit_name as large_unit_name,
    0 as ismodified
    FROM po_details pod
    LEFT JOIN products p ON pod.product_id = p.product_id
    LEFT JOIN units su ON p.small_unit_id = su.unit_id
    LEFT JOIN units lu ON p.large_unit_id = lu.unit_id
    WHERE pod.po_master_id = ?
    ORDER BY pod.po_details_id`;
    const rows = await dbAll(sql, [poMasterId]);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching purchase details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//get purchase payments by order_no
router.get("/payments/:orderNo", async (req, res) => {
  try {
    const { orderNo } = req.params;
    const sql = `SELECT pm.payment_id, pm.payment_head, pm.payment_mode, pm.payment_amount,
pmd.allocation_amount as order_amount, pm.payment_note
FROM payment_details pmd
LEFT JOIN payments pm on pmd.payment_id = pm.payment_id
WHERE pmd.ref_no = ?
ORDER BY pm.payment_date`;
    const rows = await dbAll(sql, [orderNo]);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching purchase payments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
