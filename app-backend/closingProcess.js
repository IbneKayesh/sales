// Update item
router.post("/update-item11", (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Transaction ID is required" });
  }

  //update margin rate
  const sql = `
    UPDATE items
    SET margin_rate = (sales_rate - (sales_rate * discount_percent / 100.0)) - purchase_rate
    WHERE 1 = 1
  `;

  db.run(sql, [], function (err) {
    if (err) {
      console.error("Database error:", err);
      //return res.status(500).json({ error: "Internal server error" });
    }
    if (this.changes === 0) {
      //return res.status(404).json({ error: "Data not found" });
    }
    res.json({ id });
  });

  //update order qty

  const sql_b = "";

  db.run(sql_b, [], function (err) {
    if (err) {
      console.error("Database error in sql_b:", err);
      r; //eturn;
    }
  });

  //update stock qty
  const sql_stock_v1 = `UPDATE items
              SET stock_qty = (
                  SELECT SUM(order_qty)
                  FROM (
                      SELECT poc.item_id, SUM(poc.order_qty) AS order_qty
                      FROM po_child poc
                      JOIN po_master pom ON poc.po_master_id = pom.po_master_id
                      WHERE pom.order_type IN ('Purchase Receive','Purchase Order')
                      GROUP BY poc.item_id

                      UNION ALL

                      SELECT poc.item_id, -SUM(poc.order_qty) AS order_qty
                      FROM po_child poc
                      JOIN po_master pom ON poc.po_master_id = pom.po_master_id
                      WHERE pom.order_type IN ('Return Purchase')
                      GROUP BY poc.item_id
                  ) tmp
                  WHERE tmp.item_id = items.id
              )
              WHERE items.id IN (
                  SELECT item_id FROM po_child
              )`;

  const sql_c = ``;
  db.run(sql_c, [], function (err) {
    if (err) {
      console.error("Database error in sql_c:", err);
      //return;
    }
  });
});

// Update purchase
router.post("/update-purchase", async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Transaction ID is required" });
  }

  const scripts = [];

  scripts.push({
    label: "Update Payment and Due for Pay later",
    sql: `
    UPDATE po_master AS pom
    SET paid_amount = (
        SELECT COALESCE(SUM(p.payment_amount), 0)
        FROM payments p
        WHERE p.ref_no = pom.order_no
        AND p.contact_id = pom.contact_id
    ),
    due_amount = total_amount - (
        SELECT COALESCE(SUM(p.payment_amount), 0)
        FROM payments p
        WHERE p.ref_no = pom.order_no
        AND p.contact_id = pom.contact_id
    )
    WHERE is_paid in ('Unpaid','Partial')`,
    params: [],
  });

  scripts.push({
    label: "Update Payment Status for Pay later",
    sql: `
    UPDATE po_master
    SET is_paid =
        CASE
            WHEN due_amount = 0 AND is_paid IN ('Unpaid', 'Partial')
                THEN 'Paid'
            WHEN paid_amount != due_amount AND is_paid = 'Unpaid'
                THEN 'Partial'
            ELSE is_paid
        END`,
    params: [],
  });

  scripts.push({
    label: "Update Booking Order Qty from Purchase Receive",
    sql: `UPDATE po_child AS poc
          SET order_qty = (
              SELECT SUM(poc_o.order_qty)
              FROM po_child AS poc_o
              JOIN po_master AS pom ON poc.po_master_id = pom.po_master_id
              WHERE poc_o.ref_id = poc.id
                AND pom.order_type = 'Purchase Booking'
                AND pom.is_posted = 1
                AND pom.is_completed = 0
          )
          WHERE EXISTS (
              SELECT 1
              FROM po_child AS poc_o
              JOIN po_master AS pom ON poc.po_master_id = pom.po_master_id
              WHERE poc_o.ref_id = poc.id
                AND pom.order_type = 'Purchase Booking'
                AND pom.is_posted = 1
                AND pom.is_completed = 0
          )`,
    params: [],
  });

  scripts.push({
    label: "Purchase Booking Mark as Completed when purchase received",
    sql: `UPDATE po_master AS pom
          SET is_completed = (
              SELECT CASE
                      WHEN SUM(poc.booking_qty - poc.order_qty) > 0 THEN 0
                      ELSE 1
                    END
              FROM po_child AS poc
              WHERE poc.po_master_id = pom.po_master_id
          )
          WHERE pom.order_type IN ('Purchase Booking')
            AND pom.is_posted = 1
            AND pom.is_completed = 0
          `,
    params: [],
  });

  scripts.push({
    label: "Purchase Receive and Return Mark as completed for Pay later",
    sql: `UPDATE po_master AS pom
          SET is_completed = 1
          WHERE pom.order_type IN ('Purchase Receive','Purchase Order','Return Purchase')
            AND pom.is_posted = 1
            AND pom.is_paid = 'Paid'
            AND pom.is_completed = 0
          `,
    params: [],
  });

  scripts.push({
    label: "Purchase Order payment update for later payment",
    sql: `WITH purchase_order_filtered AS (
            SELECT 
                payment_id, 
                SUM(payment_amount) AS payment_amount,
                SUM(order_amount) AS order_amount
            FROM payments p
            WHERE payment_type = 'Purchase Order'
              AND p.payment_amount != p.order_amount
            GROUP BY payment_id
          )
          UPDATE payments
          SET order_amount = purchase_order_filtered.payment_amount
          FROM purchase_order_filtered
          WHERE payments.payment_id = purchase_order_filtered.payment_id`,
    params: [],
  })

  scripts.push({
    label: "Update Pyaments order amount for Purchase Receive",
    sql: `UPDATE payments AS p
          SET order_amount = (
              SELECT IFNULL(SUM(pr.payment_amount), 0)
              FROM payments pr
              WHERE pr.payment_type = 'Purchase Receive'
                AND pr.ref_id = p.payment_id
          )
          WHERE p.payment_type = 'Purchase Booking'
            AND p.payment_amount > p.order_amount`,
    params: [],
  });

  scripts.push({
    label: "Update Contact Balance",
    sql: `UPDATE contacts
        SET current_balance = (
            SELECT SUM(payment_amount - order_amount)
            FROM payments
            WHERE payments.contact_id = contacts.contact_id
              AND payment_amount != order_amount
        )`,
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