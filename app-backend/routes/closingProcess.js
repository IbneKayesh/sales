const express = require("express");
const { db } = require("../db/init");
const router = express.Router();

// Update bank transactions
router.post("/update-bank-transaction", (req, res) => {
  // in First: Handle supplier balance updates and bank transactions for purchase orders
  const poSql = `
      SELECT pom.po_master_id, pom.order_type, pom.contacts_id, pom.total_amount, pom.paid_amount, pom.order_no, pom.order_date, c.contact_name
      FROM po_master pom
      JOIN contacts c ON pom.contacts_id = c.contact_id
      WHERE pom.order_type IN ('Purchase Booking', 'Purchase Receive') AND c.contact_type IN ('Supplier', 'Both')
    `;

  db.all(poSql, [], (err3, poRows) => {
    if (err3) {
      console.error("Error fetching purchase orders:", err3);
      return res.status(500).json({ error: "Internal server error" });
    }

    // Get a default bank account for transactions
    const bankAccountSql = `SELECT bank_account_id FROM bank_accounts WHERE is_default = 1 LIMIT 1`;
    db.get(bankAccountSql, [], (err4, bankAccount) => {
      if (err4) {
        console.error("Error fetching bank account:", err4);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (!bankAccount) {
        console.error("No bank account found");
        return res.status(500).json({ error: "No bank account available" });
      }

      const bankAccountId = bankAccount.bank_account_id;

      let processed = 0;
      const total = poRows.length;

      if (total === 0) {
        // in last: update bank_accounts
        const updateBankAccountsSql = `
          UPDATE bank_accounts
          SET debit_balance = COALESCE(
                  (SELECT SUM(debit_amount)
                   FROM bank_transactions
                   WHERE bank_account_id = bank_accounts.bank_account_id), 0),
              credit_balance = COALESCE(
                  (SELECT SUM(credit_amount)
                   FROM bank_transactions
                   WHERE bank_account_id = bank_accounts.bank_account_id), 0),
              current_balance = debit_balance - credit_balance;
        `;

        db.run(updateBankAccountsSql, function (err) {
          if (err) {
            console.error("Error updating bank_accounts:", err);
            return res.status(500).json({ error: "Internal server error" });
          }

          return res.json({
            success: true,
            message: "Bank balances and supplier balances updated successfully",
          });
        });
        return;
      }

      poRows.forEach((po) => {
        const {
          order_type,
          contacts_id,
          total_amount,
          paid_amount,
          order_no,
          order_date,
          contact_name,
        } = po;


        let balanceChange = 0;
        let debitAmount = 0;
        let creditAmount = 0;
        let transType = order_type;
        let transDesc = "";

        if (order_type === "Purchase Booking") {
          debitAmount = total_amount;
          transDesc = `PB for ${contact_name} on ${order_date}`;
        } else if (order_type === "Purchase Receive") {
          creditAmount = paid_amount;
          transDesc = `PR for ${contact_name} on ${order_date}`;
        }

        balanceChange = debitAmount - creditAmount;

        // Update supplier balance
        const updateBalanceSql = `
            UPDATE contacts
            SET current_balance = current_balance + ?
            WHERE contact_id = ?
          `;
        db.run(
          updateBalanceSql,
          [balanceChange, contacts_id],
          function (err5) {
            if (err5) {
              console.error("Error updating supplier balance:", err5);
            }

            // Create bank transaction if not already created by reference_no
            // if already created transaction, then update transaction debit and credit amount
            const checkTransSql = `SELECT bank_transactions_id FROM bank_transactions WHERE reference_no = ?`;
            db.get(checkTransSql, [order_no], (err7, existingTrans) => {
              if (err7) {
                console.error("Error checking existing transaction:", err7);
              }

              if (existingTrans) {
                // Update existing transaction
                const updateTransSql = `UPDATE bank_transactions SET debit_amount = ?, credit_amount = ? WHERE bank_transactions_id = ?`;
                db.run(updateTransSql, [debitAmount, creditAmount, existingTrans.bank_transactions_id], function (err8) {
                  if (err8) {
                    console.error("Error updating bank transaction:", err8);
                  }

                  processed++;
                  if (processed === total) {
                    // in last: update bank_accounts
                    const updateBankAccountsSql = `
                      UPDATE bank_accounts
                      SET debit_balance = COALESCE(
                              (SELECT SUM(debit_amount)
                               FROM bank_transactions
                               WHERE bank_account_id = bank_accounts.bank_account_id), 0),
                          credit_balance = COALESCE(
                              (SELECT SUM(credit_amount)
                               FROM bank_transactions
                               WHERE bank_account_id = bank_accounts.bank_account_id), 0),
                          current_balance = debit_balance - credit_balance;
                    `;

                    db.run(updateBankAccountsSql, function (err) {
                      if (err) {
                        console.error("Error updating bank_accounts:", err);
                        return res.status(500).json({ error: "Internal server error" });
                      }

                      res.json({
                        success: true,
                        message: "Bank balances and supplier balances updated successfully",
                      });
                    });
                  }
                });
              } else {
                // Insert new transaction
                const transId = require("crypto").randomUUID();
                const insertTransSql = `
                  INSERT INTO bank_transactions (
                    bank_transactions_id, bank_account_id, transaction_date, transaction_name, reference_no,
                    transaction_details, debit_amount, credit_amount
                  )
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `;
                const transParams = [
                  transId,
                  bankAccountId,
                  order_date,
                  transType,
                  order_no,
                  transDesc,
                  debitAmount,
                  creditAmount,
                ];

                db.run(insertTransSql, transParams, function (err6) {
                  if (err6) {
                    console.error("Error creating bank transaction:", err6);
                  }

                  processed++;
                  if (processed === total) {
                    // in last: update bank_accounts
                    const updateBankAccountsSql = `
                      UPDATE bank_accounts
                      SET debit_balance = COALESCE(
                              (SELECT SUM(debit_amount)
                               FROM bank_transactions
                               WHERE bank_account_id = bank_accounts.bank_account_id), 0),
                          credit_balance = COALESCE(
                              (SELECT SUM(credit_amount)
                               FROM bank_transactions
                               WHERE bank_account_id = bank_accounts.bank_account_id), 0),
                          current_balance = debit_balance - credit_balance;
                    `;

                    db.run(updateBankAccountsSql, function (err) {
                      if (err) {
                        console.error("Error updating bank_accounts:", err);
                        return res.status(500).json({ error: "Internal server error" });
                      }

                      res.json({
                        success: true,
                        message: "Bank balances and supplier balances updated successfully",
                      });
                    });
                  }
                });
              }
            });
          }
        );
      });
    });
  });
});

// Update item
router.post("/update-item", (req, res) => {
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
      return res.status(500).json({ error: "Internal server error" });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Data not found" });
    }
    res.json({ id });
  });

  //update order qty

  const sql_b = `UPDATE items
          SET order_qty = (
              SELECT IFNULL(SUM(poc.item_qty - poc.received_qty), 0)
              FROM po_child poc
              JOIN po_master pom 
                  ON poc.po_master_id = pom.po_master_id
              WHERE poc.item_id = items.item_id
            AND pom.order_type = 'Purchase Booking'
          )`;

  db.run(sql_b, [], function (err) {
    if (err) {
      console.error("Database error in sql_b:", err);
      return;
    }
  });


  //update stock qty


  const sql_c = `UPDATE items
          SET stock_qty = (
              SELECT IFNULL(SUM(poc.item_qty), 0)
              FROM po_child poc
              JOIN po_master pom 
                  ON poc.po_master_id = pom.po_master_id
              WHERE poc.item_id = items.item_id
            AND pom.order_type = 'Purchase Receive'
          )`;

  db.run(sql_c, [], function (err) {
    if (err) {
      console.error("Database error in sql_b:", err);
      return;
    }
  });
});

module.exports = router;
