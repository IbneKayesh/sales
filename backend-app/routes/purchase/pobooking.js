const express = require("express");
const router = express.Router();

const { generateGuid } = require("../../guid.js");

const {
  runScriptsSequentially,
  dbRun,
  dbGet,
  dbAll,
} = require("../../db/asyncScriptsRunner");

//get all
router.get("/", async (req, res) => {
  try {
    const sql = `SELECT pom.*, c.contact_name, c.contact_mobile, c.contact_address, pom.is_posted as edit_stop
    FROM po_master pom
    LEFT JOIN contacts c ON pom.contact_id = c.contact_id
    WHERE order_type = 'Booking'`;
    const rows = await dbAll(sql, []);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//get details
router.get("/details/:master_id", async (req, res) => {
  try {
    const master_id = req.params.master_id;
    const sql = `SELECT pob.*,
    p.product_code,
    p.product_name,
    p.unit_difference_qty,
    su.unit_name as small_unit_name,
    lu.unit_name as large_unit_name,
    0 as edit_stop
    FROM po_booking pob
    LEFT JOIN products p ON pob.product_id = p.product_id
    LEFT JOIN units su ON p.small_unit_id = su.unit_id
    LEFT JOIN units lu ON p.large_unit_id = lu.unit_id
    WHERE pob.master_id = ?
    ORDER BY pob.booking_id`;
    const rows = await dbAll(sql, [master_id]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//get payments
router.get("/payments/:master_id", async (req, res) => {
  try {
    const master_id = req.params.master_id;
    const sql = `SELECT pym.*, 0 as edit_stop
    FROM payments pym
    WHERE pym.master_id = ?
    ORDER by pym.created_at`;
    const rows = await dbAll(sql, [master_id]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


//get cancel booking
router.post("/cancel-booking/:master_id", async (req, res) => {
  try {
    const master_id = req.params.master_id;

    const scripts = [];

    scripts.push({
      label: "1 of 2 :: Update purchase booking cancelled flag",
      sql: `UPDATE po_booking
		SET product_qty = invoice_qty,
		discount_amount = (discount_percent / 100) * ( invoice_qty * product_price ),
		vat_amount = (vat_percent / 100) * ( invoice_qty * product_price ),
		total_amount = ( invoice_qty * product_price ) - (vat_percent / 100) * ( invoice_qty * product_price ) + (discount_percent / 100) * ( invoice_qty * product_price ),
		cost_price = (( invoice_qty * product_price ) - (vat_percent / 100) * ( invoice_qty * product_price ) + (discount_percent / 100) * ( invoice_qty * product_price )) / invoice_qty,
		cancelled_qty = pending_qty,
		pending_qty = 0
		WHERE master_id = ?
		AND pending_qty > 0`,
      params: [master_id],
    });


    scripts.push({
      label: "2 of 2 :: Update purchase booking cancelled amount",
      sql: `UPDATE po_master
			SET order_amount = src.order_amount,
			  discount_amount = src.discount_amount,
			  vat_amount = src.vat_amount,
			  total_amount = src.order_amount - ( src.discount_amount + src.vat_amount + include_cost + exclude_cost),
			  payable_amount = (src.order_amount + include_cost - src.discount_amount + ( CASE WHEN is_vat_payable = 1 THEN src.vat_amount ELSE 0 END)),
			  due_amount = (src.order_amount + include_cost - src.discount_amount + ( CASE WHEN is_vat_payable = 1 THEN src.vat_amount ELSE 0 END)) - paid_amount
			FROM (
			SELECT pob.master_id,sum(pob.product_price * pob.product_qty) as order_amount, sum (pob.discount_amount) as discount_amount, sum (pob.vat_amount) as vat_amount
			FROM po_booking pob
			WHERE pob.master_id = ?
			GROUP by pob.master_id
			) AS src
			WHERE po_master.master_id = src.master_id`,
      params: [master_id],
    });

    await runScriptsSequentially(scripts);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



//update
router.post("/update", async (req, res) => {
  try {
    const {
      master_id,
      shop_id,
      contact_id,
      order_type,
      order_no,
      order_date,
      order_note,
      order_amount,
      discount_amount,
      vat_amount,
      is_vat_payable,
      include_cost,
      exclude_cost,
      total_amount,
      payable_amount,
      paid_amount,
      due_amount,
      is_paid,
      is_posted,
      is_returned,
      is_closed,
      details_create,
      payments_create,
    } = req.body;

    //validate
    if (
      !master_id ||
      !shop_id ||
      !contact_id ||
      !order_type ||
      !order_no ||
      !details_create ||
      !Array.isArray(details_create)
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    //build scripts
    const scripts = [];

    //delete booking details
    scripts.push({
      label: `1 of 5 :: Delete details ${order_no}`,
      sql: `DELETE FROM po_booking WHERE master_id = ?`,
      params: [master_id],
    });

    //delete payment details
    scripts.push({
      label: `2 of 5 :: Delete payments ${order_no}`,
      sql: `DELETE FROM payments WHERE master_id = ?`,
      params: [master_id],
    });

    //Update order Master
    scripts.push({
      label: "3 of 5 :: Update Purchase Master " + order_no,
      sql: `UPDATE po_master 
      SET order_date = ?,
      order_note = ?,
      order_amount = ?,
      discount_amount = ?,
      vat_amount = ?,
      is_vat_payable = ?,
      include_cost = ?,
      exclude_cost = ?,
      total_amount = ?,
      payable_amount = ?,
      paid_amount = ?,
      due_amount = ?,
      is_paid = ?,
      is_posted = ?
      WHERE master_id = ?`,
      params: [
        order_date,
        order_note,
        order_amount || 0,
        discount_amount || 0,
        vat_amount || 0,
        is_vat_payable || 0,
        include_cost || 0,
        exclude_cost || 0,
        total_amount || 0,
        payable_amount || 0,
        paid_amount || 0,
        due_amount || 0,
        is_paid || "Unpaid",
        is_posted || 0,
        master_id,
      ],
    });

    //Insert booking details
    for (const detail of details_create) {
      scripts.push({
        label: "4 of 5 :: Insert Purchase Booking",
        sql: `INSERT INTO po_booking (booking_id, master_id, product_id, product_price, product_qty, discount_percent, discount_amount, vat_percent, vat_amount, cost_price, total_amount, product_note, invoice_qty, pending_qty)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        params: [
          generateGuid(),
          master_id,
          detail.product_id,
          detail.product_price || 0,
          detail.product_qty || 0,
          detail.discount_percent || 0,
          detail.discount_amount || 0,
          detail.vat_percent || 0,
          detail.vat_amount || 0,
          detail.cost_price || 0,
          detail.total_amount || 0,
          detail.product_note || "",
          0,
          detail.pending_qty || 0,
        ],
      });
    }

    //Insert order Payments
    for (const payment of payments_create) {
      scripts.push({
        label: "5 of 5 :: Insert Purchase Payments",
        sql: `INSERT INTO payments (payment_id, shop_id, master_id, contact_id, source_name, payment_type, payment_head, payment_mode, payment_date, payment_amount, payment_note, ref_no)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        params: [
          generateGuid(),
          shop_id,
          master_id,
          contact_id,
          'Purchase',
          'Cash Out',
          order_type,
          payment.payment_mode || "Cash",
          payment.payment_date,
          payment.payment_amount || 0,
          payment.payment_note || "",
          order_no,
        ],
      });
    }

    //run scripts
    const results = await runScriptsSequentially(scripts, {
      useTransaction: true,
    });



    // If any failed, transaction has already rolled back
    if (!results.every((r) => r.success)) {
      return res.status(500).json({ error: "Failed to update purchase booking" });
    }
    // ❗ Only one response is sent
    res.status(201).json({
      message: "Purchase Booking updated successfully!",
      master_id,
      order_no,
      details_create,
      payments_create,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
