const express = require("express");
const { db } = require("../db/init");
const router = express.Router();
const { generateGuid } = require("../guid.js");
const {
  runScriptsSequentially,
  dbRun,
  dbGet,
} = require("../db/asyncScriptsRunner.js");




// Update purchase order master, child and payment
router.post("/update", async (req, res) => {
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
    cost_amount,
    total_amount,
    paid_amount,
    due_amount,
    is_paid,
    is_posted,
    is_completed,
    other_cost,
    childs_create,
    childs_update,
    childs_delete,
    payments_create,
  } = req.body;

  //console.log("/update/req.body " + JSON.stringify(req.body));

  if (!po_master_id || !order_type || !order_date || !contact_id) {
    return res.status(400).json({
      error:
        "Master ID, order type, order date, contacts and childs are required",
    });
  }

  // Fetch default bank account
  const bankRow = await dbGet(
    "SELECT bank_account_id FROM bank_accounts WHERE is_default = 1"
  );

  if (!bankRow) {
    return res.status(404).json({ error: "Default bank account not found" });
  }

  const bank_account_id = bankRow.bank_account_id;

  const scripts = [];

  // -------------------------------
  // UPDATE MASTER
  // -------------------------------
  scripts.push({
    label: "Update Master",
    sql: `
      UPDATE po_master SET      
      order_date = ?,
      contact_id = ?,
      ref_no = ?,
      order_note = ?,
      order_amount = ?,
      discount_amount = ?,
      cost_amount = ?,
      total_amount = ?,
      paid_amount = ?,
      due_amount = ?,
      is_paid = ?,
      is_posted = ?,
      other_cost = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE po_master_id = ?
  `,
    params: [
      order_date,
      contact_id,
      ref_no || "",
      order_note || "",
      order_amount || 0,
      discount_amount || 0,
      cost_amount || 0,
      total_amount || 0,
      paid_amount || 0,
      due_amount || 0,
      is_paid || 0,
      is_posted || 0,
      other_cost || 0,
      po_master_id,
    ],
  });

  //Insert Child Records
  for (const child of childs_create || []) {
    scripts.push({
      label: `Insert Child ${child.id}`,
      sql: `
      INSERT INTO po_child 
      (id, po_master_id, item_id, item_rate, booking_qty, order_qty, discount_percent, discount_amount, item_amount, cost_rate, item_note, ref_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      params: [
        child.id,
        po_master_id,
        child.item_id,
        child.item_rate,
        child.booking_qty || 0,
        child.order_qty || 0,
        child.discount_percent || 0,
        child.discount_amount || 0,
        child.item_amount || 0,
        child.cost_rate || 0,
        child.item_note || "",
        child.ref_id || "",
      ],
    });
  }

  //Update Child Records
  for (const child of childs_update || []) {
    scripts.push({
      label: `Update Child ${child.id}`,
      sql: `
      UPDATE po_child 
      SET item_rate = ?,
      booking_qty = ?,
      order_qty = ?,
      discount_percent = ?,
      discount_amount = ?,
      item_amount = ?,
      cost_rate = ?,
      item_note = ?,
      ref_id = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
    `,
      params: [
        child.item_rate,
        child.booking_qty,
        child.order_qty,
        child.discount_percent || 0,
        child.discount_amount || 0,
        child.item_amount || 0,
        child.cost_rate,
        child.item_note || "",
        child.ref_id || "",
        child.id,
      ],
    });
  }

  //Delete Child Records
  for (const child of childs_delete || []) {
    scripts.push({
      label: `Delete Child ${child.id}`,
      sql: `DELETE FROM po_child WHERE id = ?`,
      params: [child.id],
    });
  }

  //Delete Old Payments
  scripts.push({
    label: "Delete Old Payments",
    sql: `DELETE FROM payments WHERE ref_no = ?`,
    params: [order_no],
  });

  console.log("order_no " + order_no);

  //Insert New Payments
  for (const payment of payments_create || []) {
    scripts.push({
      label: `Insert Payment ${payment.id}`,
      sql: `
      INSERT INTO payments 
      (payment_id, bank_account_id, payment_type, payment_mode,
      payment_date, contact_id, ref_no, payment_amount,
      order_amount, payment_note, ref_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      params: [
        generateGuid(),
        bank_account_id,
        payment.payment_type,
        payment.payment_mode,
        payment.payment_date,
        contact_id,
        order_no,
        payment.payment_amount,
        payment.order_amount,
        payment.payment_note || "",
        payment.ref_id || "",
      ],
    });
  }

  //Insert Other Cost Payments
  if (other_cost > 0) {
    scripts.push({
      label: "Insert Other Cost Payment",
      sql: `
      INSERT INTO payments 
      (payment_id, bank_account_id, payment_type, payment_mode,
      payment_date, contact_id, ref_no, payment_amount,
      order_amount, payment_note, ref_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      params: [
        generateGuid(),
        bank_account_id,
        `${order_type} Expenses`,
        "Cash",
        order_date,
        "0",
        order_no,
        other_cost,
        other_cost,
        "Other Cost Expenses",
        "",
      ],
    });
  }

  // -------------------------------
  // EXECUTE ALL (TRANSACTIONAL)
  // -------------------------------
  const results = await runScriptsSequentially(scripts, {
    useTransaction: true,
  });

  // check master update success
  const masterResult = results[0];
  if (!masterResult.success || masterResult.changes === 0) {
    return res
      .status(400)
      .json({ error: "Master update failed or record not found" });
  }

  return res.json({
    message: "Purchase Order updated successfully!",
    po_master_id,
  });
});

// Delete purchase order master
router.post("/delete", async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }

  const sql_master =
    "SELECT order_no FROM po_master WHERE is_posted = 1 AND is_completed = 1 AND po_master_id = ?";
  const masterRow = await dbGet(sql_master, [id]);

  if (!masterRow) {
    return res.status(404).json({ error: "Master not found" });
  }

  const order_no = masterRow.order_no;
  console.log("order_no " + order_no);

  const scripts = [];

  scripts.push({
    label: "Delete Childs",
    sql: "DELETE FROM po_child WHERE po_master_id = ?",
    params: [id],
  });

  scripts.push({
    label: "Delete Payments",
    sql: "DELETE FROM payments WHERE ref_no = ?",
    params: [order_no],
  });

  scripts.push({
    label: "Delete Master",
    sql: "DELETE FROM po_master WHERE po_master_id = ?",
    params: [id],
  });

  const results = await runScriptsSequentially(scripts, {
    useTransaction: true,
  });

  // check master delete success
  const masterResult = results[2];
  if (!masterResult.success || masterResult.changes === 0) {
    return res
      .status(400)
      .json({ error: "Master delete failed or record not found" });
  }

  return res.json({
    message: "Purchase Order deleted successfully!",
    po_master_id: id,
  });
});

module.exports = router;
