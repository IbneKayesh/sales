// dbproc.js
const {
  runScriptsSequentially,
  dbRun,
  dbGet,
} = require("../db/asyncScriptsRunner.js");

//task : the async function processInvoiceData() will export the dbproc.js file
// and it will be called from the poChild.js file processInvoiceData function
// help me to complete the task

async function processInvoiceData() {
  const scripts = [];

  scripts.push({
    label: "Update Payment and Due",
    sql: `
    UPDATE po_master AS pom
    SET paid_amount = (
        SELECT COALESCE(SUM(p.payment_amount), 0)
        FROM payments p
        WHERE p.ref_no = pom.order_no
    ),
    due_amount = total_amount - (
        SELECT COALESCE(SUM(p.payment_amount), 0)
        FROM payments p
        WHERE p.ref_no = pom.order_no
    )
    WHERE is_paid in ('Unpaid','Partial')`,
    params: [],
  });

  scripts.push({
    label: "Update Payment Status",
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
    label: "Update Booking Order Qty",
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
    label: "Purchase Booking Mark as Completed",
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
    label: "Purchase Receive and Return Mark as completed",
    sql: `UPDATE po_master AS pom
          SET is_completed = 1
          WHERE pom.order_type IN ('Purchase Receive','Purchase Order','Purchase Return')
            AND pom.is_posted = 1
            AND pom.is_paid = 'Paid'
            AND pom.is_completed = 0
          `,
    params: [],
  });

  scripts.push({
    label: "Update Purchase Booking Payment",
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
  const results = await runScriptsSequentially(scripts, {
    useTransaction: true,
  });
  return results;
}

module.exports = {
  processInvoiceData,
};
