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
      cost_amount,
      total_amount,
      payable_amount,
      paid_amount,
      payable_note,
      due_amount,
      other_cost,
      is_paid,
      is_posted,
      is_completed,
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
    const prefix = order_type.split(" ").map(word => word[0]).join("");
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yy = String(now.getFullYear()).slice(-2);
    const date_part = dd + mm + yy;

    const max_sequence_no_sql = await dbGet(
      "SELECT MAX(CAST(SUBSTR(order_no, -5) AS INTEGER)) as max_seq FROM po_master WHERE order_type = ? AND strftime('%Y-%m-%d', order_date) = strftime('%Y-%m-%d', 'now')",
      [order_type]
    );
    const max_sequence_no = String((max_sequence_no_sql.max_seq || 0) + 1).padStart(5, '0');
    const order_no_new = `${prefix}-${date_part}-${max_sequence_no}`;

    //fetch default bank account
    const bank_account = await dbGet(
      "SELECT * FROM bank_accounts WHERE is_default = 1",
      []
    );
    if (!bank_account) {
      return res.status(400).json({ error: "Default bank account not found" });
    }
    const bank_account_id = bank_account.account_id;

    //build scripts
    const scripts = [];

    //Insert Master
    scripts.push({
      label: "Insert Purchase Master " + order_no_new,
      sql: `INSERT INTO po_master (po_master_id, order_type, order_no, order_date, contact_id, ref_no,
      order_note, order_amount, discount_amount, vat_amount, cost_amount, total_amount,
      payable_amount, paid_amount, payable_note, due_amount, other_cost,
      is_paid, is_posted, is_completed)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        cost_amount || 0,
        total_amount || 0,
        payable_amount || 0,
        paid_amount || 0,
        payable_note,
        due_amount || 0,
        other_cost || 0,
        is_paid || 'Unpaid',
        is_posted || 0,
        is_completed || 0,
      ],
    });
    //Insert Details
    for (const detail of details_create) {
      scripts.push({
        label: "Insert Purchase Detail " + detail.product_id,
        sql: `INSERT INTO po_details (po_details_id, po_master_id, product_id, product_price, product_qty,
        discount_percent, discount_amount, vat_percent, vat_amount, cost_price, total_amount,
        product_note, ref_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        ],
      });
    }
    //Insert Payments
    for (const payment of payments_create) {
      scripts.push({
        label: "Insert Purchase Payment " + payment.payment_id,
        sql: `INSERT INTO bank_payments (payment_id, account_id, payment_head, payment_mode, payment_date,
        contact_id, payment_amount, order_amount, payment_note, ref_no, ref_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        params: [
          payment.payment_id,
          bank_account_id,
          payment.payment_head,
          payment.payment_mode,
          order_date,
          contact_id,
          payment.payment_amount || 0,
          payment.order_amount || 0,
          payment.payment_note,
          order_no_new,
          payment.ref_id,
        ],
      });
    }
    //Other cost goes to expesnes with default contact account
    if (other_cost > 0) {
      scripts.push({
        label: "Insert Purchase Other Cost " + po_master_id,
        sql: `INSERT INTO bank_payments (payment_id, account_id, payment_head, payment_mode, payment_date,
    contact_id, payment_amount, order_amount, payment_note, ref_no, ref_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        params: [
          generateGuid(),
          bank_account_id,
          `${order_type} Expenses`,
          'Cash',
          order_date,
          '0',
          other_cost,
          other_cost,
          'Other Cost',
          order_no_new,
          '',
        ],
      });
    }

    const results = await runScriptsSequentially(scripts, { useTransaction: true });
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

module.exports = router;
