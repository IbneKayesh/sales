const express = require("express");
const router = express.Router();

const { generateGuid } = require("../../guid.js");

const {
  runScriptsSequentially,
  dbRun,
  dbGet,
  dbAll,
} = require("../../db/asyncScriptsRunner.js");

//get all
router.get("/", async (req, res) => {
  try {
    const sql = `SELECT pom.*, c.contact_name, pom.is_posted as edit_stop
    FROM po_master pom
    LEFT JOIN contacts c ON pom.contact_id = c.contact_id
    WHERE order_type = 'Return'`;
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
    const sql = `SELECT por.*,
    p.product_code,
    p.product_name,
    p.unit_difference_qty,
    su.unit_name as small_unit_name,
    lu.unit_name as large_unit_name,
    0 as edit_stop
    FROM po_return por
    LEFT JOIN products p ON por.product_id = p.product_id
    LEFT JOIN units su ON p.small_unit_id = su.unit_id
    LEFT JOIN units lu ON p.large_unit_id = lu.unit_id
    WHERE por.master_id = ?
    ORDER BY por.return_id`;
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

//create
router.post("/create", async (req, res) => {
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
      !details_create ||
      !Array.isArray(details_create)
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    //generate order no
    //order no format: order_type split word and take first  Char of each word - ddmmyy - max_sequence_no
    // const prefix = order_type
    //   .split(" ")
    //   .map((word) => word[0])
    //   .join("");
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
    const order_no_new = `PR-${date_part}-${max_seq_no}`;
    console.log("New Transaction No: " + order_no_new);

    //build scripts
    const scripts = [];

    //Insert order Master
    scripts.push({
      label: "1 of 4 :: Insert Purchase Return Master" + order_no_new,
      sql: `INSERT INTO po_master (master_id,shop_id,contact_id,order_type,order_no,order_date,order_note,order_amount,discount_amount,vat_amount,is_vat_payable,include_cost,exclude_cost,total_amount,payable_amount,paid_amount,due_amount,is_paid,is_posted,is_returned,is_closed)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      params: [
        master_id,
        shop_id,
        contact_id,
        order_type,
        order_no_new,
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
        "Paid",
        1,
        1,
        1,
      ],
    });

    //Insert order details
    for (const detail of details_create) {
      scripts.push({
        label: "2 of 4 :: Insert Purchase Return Details",
        sql: `INSERT INTO po_return (return_id, master_id,
        product_id, product_price, product_qty, discount_percent,
        discount_amount, vat_percent, vat_amount, cost_price,
        total_amount, product_note, invoice_order_id, source_type)
        VALUES (?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?)`,
        params: [
          generateGuid(),
          master_id,
          detail.product_id,
          detail.product_price,
          detail.product_qty || 0,
          detail.discount_percent || 0,
          detail.discount_amount || 0,
          detail.vat_percent || 0,
          detail.vat_amount || 0,
          detail.cost_price || 0,
          detail.total_amount || 0,
          detail.product_note,
          detail.invoice_order_id,
          detail.source_type,
        ],
      });

      //set po master return flag
      scripts.push({
        label: "3 of 4 :: Update Purchase Source Return flag",
        sql: `
        WITH returnedPO as (
        SELECT poo.master_id
        FROM po_order poo
        WHERE poo.order_id = ?
        GROUP by poo.master_id
        UNION ALL
        SELECT poi.master_id
        FROM po_invoice poi
        WHERE poi.invoice_id = ?
        GROUP by poi.master_id
        )
        UPDATE po_master
        SET is_returned = 1
        WHERE master_id in (
        SELECT master_id FROM returnedPO
        )`,
        params: [detail.invoice_order_id, detail.invoice_order_id],
      });
    }

    //Insert order Payments
    for (const payment of payments_create) {
      scripts.push({
        label: "4 of 4 :: Insert Purchase Return Payments",
        sql: `INSERT INTO payments (payment_id, shop_id, master_id, contact_id, source_name, payment_type, payment_head, payment_mode, payment_date, payment_amount, payment_note, ref_no)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        params: [
          generateGuid(),
          shop_id,
          master_id,
          contact_id,
          "Purchase",
          "Cash In",
          order_type,
          payment.payment_mode || "Cash",
          payment.payment_date,
          payment.payment_amount || 0,
          payment.payment_note || "",
          order_no_new,
        ],
      });
    }

    //run scripts
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
      master_id,
      order_no: order_no_new,
      details_create,
      payments_create,
    });
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

    //delete order details
    scripts.push({
      label: `1 of 5 :: Delete details ${order_no}`,
      sql: `DELETE FROM po_return WHERE master_id = ?`,
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
      due_amount = ?
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
        master_id,
      ],
    });

    //Insert order details
    for (const detail of details_create) {
      scripts.push({
        label: "4 of 5 :: Insert Purchase Return",
        sql: `INSERT INTO po_return (return_id, master_id,
        product_id, product_price, product_qty, discount_percent,
        discount_amount, vat_percent, vat_amount, cost_price,
        total_amount, product_note, invoice_order_id, source_type)
        VALUES (?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?)`,
        params: [
          generateGuid(),
          master_id,
          detail.product_id,
          detail.product_price,
          detail.product_qty || 0,
          detail.discount_percent || 0,
          detail.discount_amount || 0,
          detail.vat_percent || 0,
          detail.vat_amount || 0,
          detail.cost_price || 0,
          detail.total_amount || 0,
          detail.product_note,
          detail.invoice_order_id,
          detail.source_type,
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
          "Purchase",
          "Cash Out",
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
      return res
        .status(500)
        .json({ error: "Failed to update purchase booking" });
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

//newreturn-master
router.post("/newreturn-master", async (req, res) => {
  try {
    const { master_id, order_type } = req.body;
    const sql = `SELECT '' as master_id, pom.shop_id, pom.contact_id, 'Return' as order_type, '[Auto SL]' as order_no, DATE('now') as order_date, pom.order_note, 0 as order_amount, 0 as discount_amount, 0 as vat_amount, pom.is_vat_payable,
    pom.include_cost, 0 as exclude_cost, 0 as total_amount, 0 as payable_amount, 0 as paid_amount, 0 as due_amount, 'Unpaid' as is_paid, 1 as is_posted, 1 is_returned, 1 is_closed,
    con.contact_name, con.contact_mobile, con.contact_address, con.credit_limit
    FROM po_master pom
    LEFT JOIN contacts con ON pom.contact_id = con.contact_id
    WHERE pom.master_id = ?
    AND pom.order_type = ?`;
    const rows = await dbGet(sql, [master_id, order_type]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//newreturn-details
router.post("/newreturn-details", async (req, res) => {
  try {
    const { master_id, order_type } = req.body;
    let sql = "";
    if (order_type === "Order") {
      sql = `SELECT poo.order_id as return_id, '' as master_id, poo.product_id,poo.product_price, poo.stock_qty as product_qty, poo.discount_percent, poo.discount_amount,
      poo.vat_percent, poo.vat_amount,poo.cost_price,poo.total_amount, poo.product_note, poo.order_id as invoice_order_id,'Order' as source_type,
      p.product_code,
      p.product_name,
      p.unit_difference_qty,
    su.unit_name as small_unit_name,
    lu.unit_name as large_unit_name,
    poo.stock_qty,
    0 as edit_stop
FROM po_order poo
LEFT JOIN products p ON poo.product_id = p.product_id
LEFT JOIN units su ON p.small_unit_id = su.unit_id
LEFT JOIN units lu ON p.large_unit_id = lu.unit_id
WHERE poo.master_id = ?`;
    }

    if (order_type === "Invoice") {
      sql = `SELECT poi.invoice_id as return_id, '' as master_id, poi.product_id,poi.product_price, poi.stock_qty as product_qty, poi.discount_percent, poi.discount_amount,
            poi.vat_percent, poi.vat_amount,poi.cost_price,poi.total_amount, poi.product_note, poi.invoice_id as invoice_order_id,'Invoice' as source_type,
            p.product_code,
            p.product_name,
            p.unit_difference_qty,
          su.unit_name as small_unit_name,
          lu.unit_name as large_unit_name,
          poi.stock_qty,
          0 as edit_stop
        FROM po_invoice poi
        LEFT JOIN products p ON poi.product_id = p.product_id
        LEFT JOIN units su ON p.small_unit_id = su.unit_id
        LEFT JOIN units lu ON p.large_unit_id = lu.unit_id
        WHERE poi.master_id = ?`;
    }

    const rows = await dbAll(sql, [master_id]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
