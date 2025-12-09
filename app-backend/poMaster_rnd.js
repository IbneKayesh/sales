async function upsertBankTrans({
  bank_account_id,
  trans_date,
  trans_head,
  contact_id,
  trans_name,
  ref_no,
  trans_details,
  debit_amount,
  credit_amount,
}) {
  // 1. If both are zero → delete existing entry (if any) and exit
  if (debit_amount === 0 && credit_amount === 0) {
    const existing = await dbGet(
      `
      SELECT bank_trans_id
      FROM bank_trans
      WHERE trans_head = ?
        AND contact_id = ?
        AND trans_name = ?
        AND ref_no = ?
      LIMIT 1
      `,
      [trans_head, contact_id, trans_name, ref_no]
    );

    if (existing) {
      await dbRun(`DELETE FROM bank_trans WHERE bank_trans_id = ?`, [
        existing.bank_trans_id,
      ]);
      console.log(
        `🗑  Deleted bank_trans because debit & credit = 0 : ${existing.bank_trans_id}`
      );
    } else {
      console.log(`⚪ No existing row — nothing to delete.`);
    }

    return null;
  }

  // 2. Check if transaction exists
  const existing = await dbGet(
    `
    SELECT bank_trans_id
    FROM bank_trans
    WHERE trans_head = ?
      AND contact_id = ?
      AND trans_name = ?
      AND ref_no = ?
    LIMIT 1
    `,
    [trans_head, contact_id, trans_name, ref_no]
  );

  if (existing) {
    // 3. UPDATE existing record
    await dbRun(
      `
      UPDATE bank_trans
      SET trans_date = ?, 
          trans_details = ?, 
          debit_amount = ?, 
          credit_amount = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE bank_trans_id = ?
      `,
      [
        trans_date,
        trans_details,
        debit_amount,
        credit_amount,
        existing.bank_trans_id,
      ]
    );

    console.log(`🔄 Updated existing bank_trans: ${existing.bank_trans_id}`);
    return existing.bank_trans_id;
  }

  // 4. INSERT new if not found
  const bank_trans_id = generateGuid();
  await dbRun(
    `
    INSERT INTO bank_trans
      (bank_trans_id, bank_account_id, trans_date, trans_head, contact_id,
       trans_name, ref_no, trans_details, debit_amount, credit_amount)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      bank_trans_id,
      bank_account_id,
      trans_date,
      trans_head,
      contact_id,
      trans_name,
      ref_no,
      trans_details,
      debit_amount,
      credit_amount,
    ]
  );

  console.log(`➕ Inserted new bank_trans: ${bank_trans_id}`);
  return bank_trans_id;
}

async function createAccountingData(
  contact_id,
  trans_date,
  ref_no,
  total_amount,
  paid_amount,
  cost_amount,
  order_type
) {
  try {
    // Start transaction
    await dbRun("BEGIN");

    // Get default bank account
    const row = await dbGet(`
      SELECT bank_account_id
      FROM bank_accounts
      WHERE is_default = 1
      LIMIT 1
    `);

    if (!row?.bank_account_id) {
      throw new Error("No default bank account found");
    }

    const bank_account_id = row.bank_account_id;

    if (order_type === "Purchase Booking") {
      //
      // 1️⃣ Supplier Debit  (Booking Advance) :: paid_amount
      //
      await upsertBankTrans({
        bank_account_id,
        trans_date,
        trans_head: "Purchases and Stock",
        contact_id,
        trans_name: order_type,
        ref_no,
        trans_details: "A/C Supplier - Advance Purchase Booking",
        debit_amount: paid_amount,
        credit_amount: 0,
      });

      //
      // 2️⃣ My Account Credit (Advance Payment) :: paid_amount
      //
      await upsertBankTrans({
        bank_account_id,
        trans_date,
        trans_head: "Purchases and Stock",
        contact_id: "0",
        trans_name: order_type,
        ref_no,
        trans_details: "A/C Default - Advance Purchase Payment",
        debit_amount: 0,
        credit_amount: paid_amount,
      });
    } else if (
      order_type === "Purchase Receive" ||
      order_type === "Purchase Order"
    ) {
      //
      // 1️⃣ Supplier Credit  (Invoice Amount) :: total_amount
      // 2️⃣ Supplier Debit (Invoice Payment) :: paid_amount
      //
      await upsertBankTrans({
        bank_account_id,
        trans_date,
        trans_head: "Purchases and Stock",
        contact_id,
        trans_name: order_type,
        ref_no,
        trans_details: "A/C Supplier - Invoice " + order_type,
        debit_amount: paid_amount,
        credit_amount: total_amount,
      });

      //
      // 3️⃣ My Account Credit (Invoice Payment) :: paid_amount
      //
      await upsertBankTrans({
        bank_account_id,
        trans_date,
        trans_head: "Purchases and Stock",
        contact_id: "0",
        trans_name: order_type,
        ref_no,
        trans_details: "A/C Default - Invoice " + order_type,
        debit_amount: 0,
        credit_amount: paid_amount,
      });
    } else if (order_type === "Purchase Return") {
      //
      // 1️⃣ Supplier Debit  (Invoice Amount) :: total_amount
      // 2️⃣ Supplier Credit (Invoice Payment) :: paid_amount
      //
      await upsertBankTrans({
        bank_account_id,
        trans_date,
        trans_head: "Purchases and Stock",
        contact_id,
        trans_name: order_type,
        ref_no,
        trans_details: "A/C Supplier - Invoice " + order_type,
        debit_amount: total_amount,
        credit_amount: paid_amount,
      });

      //
      // 3️⃣ My Account Credit (Invoice Payment) :: paid_amount
      //
      await upsertBankTrans({
        bank_account_id,
        trans_date,
        trans_head: "Purchases and Stock",
        contact_id: "0",
        trans_name: order_type,
        ref_no,
        trans_details: "A/C Default - Invoice " + order_type,
        debit_amount: paid_amount,
        credit_amount: 0,
      });
    }
    //
    // 3️⃣ My Account Credit (cost)
    //
    await upsertBankTrans({
      bank_account_id,
      trans_date,
      trans_head: "Expenses",
      contact_id: "0",
      trans_name: "Purchase Expenses",
      ref_no,
      trans_details: "Purchase Expenses Payment",
      debit_amount: 0,
      credit_amount: cost_amount,
    });

    // Commit transaction
    await dbRun("COMMIT");
    console.log("✔ UPSET accounting entries completed");
  } catch (err) {
    console.error("❌ Accounting transaction failed:", err);

    await dbRun("ROLLBACK").catch(() =>
      console.error("⚠ Rollback failed (DB might be locked)")
    );
  }
}

function processInvoiceData_v1(po_master_id, order_type, ref_no) {
    if (order_type === "Purchase Receive") {
      //if created from a reference, mark it as paid and complete

      //Update "Purchase Booking.received_qty" from "Purchase Receive.item_qty"
      const sql_update_received_qty = `WITH a AS (
          SELECT pom.ref_no, poc.item_id, SUM(poc.item_qty) AS item_qty
          FROM po_child poc
          JOIN po_master pom ON poc.po_master_id = pom.po_master_id
          WHERE pom.ref_no = ?
          GROUP BY pom.ref_no, poc.item_id
        )
        UPDATE po_child
        SET received_qty = (
          SELECT a.item_qty
          FROM a
          JOIN po_master pom ON a.ref_no = pom.order_no AND pom.po_master_id = po_child.po_master_id
          WHERE a.item_id = po_child.item_id
        )
        WHERE EXISTS (
          SELECT 1
          FROM a
          JOIN po_master pom ON a.ref_no = pom.order_no AND pom.po_master_id = po_child.po_master_id
          WHERE a.item_id = po_child.item_id
        )`;

      db.run(sql_update_received_qty, [ref_no], function (err) {
        if (err) {
          console.error("Database error in sql_update_received_qty:", err);
          //return; Go to next SQL
        }

        // Update "Purchase Receive.received_qty"
        const sql_update_received_qty2 = `UPDATE po_child
            SET received_qty = item_qty
            WHERE EXISTS (
              SELECT 1 FROM po_master pom
              WHERE po_child.po_master_id = pom.po_master_id
              AND pom.order_type = 'Purchase Receive'
              AND pom.po_master_id = ?
            )`;

        db.run(sql_update_received_qty2, [po_master_id], function (err) {
          if (err) {
            console.error("Database error in sql_update_received_qty2:", err);
            //return; Go to next SQL
          }
        });
      });
    } else {
      //do nothing
    }

    //Mark as complete when incomplete
    const sql_mark_as_complete = `UPDATE po_master
            SET is_complete = (
                SELECT CASE WHEN SUM(poc.item_qty - poc.received_qty) > 0 THEN 0 ELSE 1 END
                FROM po_child poc
                JOIN po_master pom ON poc.po_master_id = pom.po_master_id
                WHERE pom.order_no = po_master.order_no
            )
            WHERE po_master.is_complete = 0`;

    db.run(sql_mark_as_complete, [], function (err) {
      if (err) {
        console.error("Database error in sql_mark_as_complete:", err);
        //return; Go to next SQL
      }
    });

    // Mark as paid when paid and total are same
    const sql_e = `UPDATE po_master
              SET is_paid = 1
              WHERE is_paid = 0
              AND total_amount = paid_amount
              AND po_master_id = ? `;

    db.run(sql_e, [po_master_id], function (err) {
      if (err) {
        console.error("Database error in sql_e:", err);
      }
    });
  });
}