const express = require("express");
const router = express.Router();

const { generateGuid } = require("../../guid.js");

const {
    runScriptsSequentially,
    dbRun,
    dbGet,
    dbAll,
} = require("../../db/asyncScriptsRunner");

// Get all accounts payable dues suppliers
router.get("/accounts-payable-dues-suppliers", async (req, res) => {
    try {
        const sql = `SELECT '' as payment_id, pom.contact_id,pom.order_type as payment_head, 'Cash' payment_mode,
'' payment_date, pom.due_amount as payment_amount, pom.due_amount as balance_amount,
pom.order_no as ref_no, pom.due_amount as allocation_amount,
pom.order_date, con.contact_name, pom.payable_amount
FROM po_master pom
LEFT JOIN contacts con on pom.contact_id = con.contact_id
WHERE pom.is_posted = 1
AND pom.due_amount > 0
    ORDER by pom.order_date DESC`;
        const rows = await dbAll(sql, []);
        res.json(rows);
    } catch (error) {
        console.error("Error fetching accounts payable dues suppliers:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//get by id
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const sql = `SELECT ba.*, 0 as ismodified
        FROM bank_accounts ba WHERE ba.account_id = ?`;
        const row = await dbGet(sql, [id]);
        if (!row) {
            return res.status(404).json({ error: "Bank account not found" });
        }
        res.json(row);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//create new accounts payable dues suppliers - create
router.post("/accounts-payable-dues-suppliers-create", async (req, res) => {
    try {
        const {
            payment_id,
            contact_id,
            payment_head,
            payment_mode,
            payment_date,
            payment_amount,
            balance_amount,
            payment_note,
            ref_no,
            allocation_amount,
        } = req.body;

        if (!contact_id) {
            return res.status(400).json({ error: "Contact ID is required" });
        }

        if (!payment_head) {
            return res.status(400).json({ error: "Payment head is required" });
        }

        if (!payment_mode) {
            return res.status(400).json({ error: "Payment mode is required" });
        }

        if (!payment_date) {
            return res.status(400).json({ error: "Payment date is required" });
        }

        if (!payment_amount) {
            return res.status(400).json({ error: "Payment amount is required" });
        }

        if (!ref_no) {
            return res.status(400).json({ error: "Reference No is required" });
        }

        if (!allocation_amount) {
            return res.status(400).json({ error: "Allocation amount is required" });
        }



        //build scripts
        const scripts = [];

        const payment_id_new = generateGuid();

        // payment master
        scripts.push({
            label: "Insert Purchase Payment " + ref_no,
            sql: `INSERT INTO payments (payment_id, contact_id, payment_head, payment_mode, payment_date,
        payment_amount, balance_amount, payment_note, ref_no)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            params: [
                payment_id_new,
                contact_id,
                payment_head,
                payment_mode,
                payment_date,
                payment_amount,
                0,
                payment_note,
                ref_no
            ],
        });

        //payment details allocation
        scripts.push({
            label: "Insert Purchase Payment Details" + ref_no,
            sql: `INSERT INTO payment_details (payment_id, ref_no, allocation_amount)
        VALUES (?, ?, ?)`,
            params: [
                payment_id_new,
                ref_no,
                payment_amount
            ],
        });

        scripts.push({
            label: "Insert Purchase Ledger Payment :: Supplier Account Debit " + ref_no,
            sql: `INSERT INTO accounts_ledger (ledger_id, contact_id, payment_head, payment_mode, payment_date,
              ref_no, debit_amount, credit_amount, payment_note)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            params: [
                generateGuid(),
                contact_id,
                payment_head,
                "Product Payment Due",
                payment_date,
                ref_no,
                payment_amount,
                0,
                payment_note,
            ],
        });

        //cash account credit
        scripts.push({
            label: "Insert Purchase Ledger Payment :: Cash Account Credit " + ref_no,
            sql: `INSERT INTO accounts_ledger (ledger_id, contact_id, payment_head, payment_mode, payment_date,
              ref_no, debit_amount, credit_amount, payment_note)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            params: [
                generateGuid(),
                'cash',
                payment_head,
                "Product Payment Due",
                payment_date,
                ref_no,
                0,
                payment_amount,
                payment_note,
            ],
        });



        //cash account credit
        scripts.push({
            label: "Update Purchase Due " + ref_no,
            sql: `UPDATE po_master
                    SET
                    paid_amount = paid_amount + ?,
                    due_amount = due_amount - ?,
                    updated_at = current_timestamp
                    WHERE order_no = ?`,
            params: [
                payment_amount,
                payment_amount,
                ref_no,
            ],
        });

        const results = await runScriptsSequentially(scripts, {
            useTransaction: true,
        });
        // If any failed, transaction has already rolled back
        if (!results.every((r) => r.success)) {
            return res.status(500).json({ error: "Failed to create payment" });
        }
        // ❗ Only one response is sent
        res.status(201).json({
            message: "Payment created successfully!",
            payment_id,
            ref_no,
        });

    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
//update bank account
router.post("/update", async (req, res) => {
    try {
        const {
            account_id,
            bank_name,
            bank_branch,
            account_name,
            account_number,
            opening_date,
            current_balance,
            is_default,
        } = req.body;

        if (!account_id) {
            return res.status(400).json({ error: "Account ID is required" });
        }

        if (!bank_name) {
            return res.status(400).json({ error: "Bank name is required" });
        }

        if (!account_name) {
            return res.status(400).json({ error: "Account name is required" });
        }

        const sql = `UPDATE bank_accounts
    SET bank_name = ?, bank_branch = ?,
    account_name = ?, account_number = ?,
    opening_date = ?, current_balance = ?,
    is_default = ?, updated_at = CURRENT_TIMESTAMP
    WHERE account_id = ?`;
        const params = [
            bank_name,
            bank_branch,
            account_name,
            account_number,
            opening_date,
            current_balance,
            is_default,
            account_id,
        ];
        const result = await dbRun(
            sql,
            params,
            `Updated bank account ${account_name}`
        );
        if (result.changes === 0) {
            return res.status(404).json({ error: "Bank account not found" });
        }
        res.status(200).json({ account_id, ...req.body });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
//delete bank account
router.post("/delete", async (req, res) => {
    try {
        const { account_id, account_name } = req.body;
        if (!account_id) {
            return res.status(400).json({ error: "Account ID is required" });
        }
        const sql = `DELETE FROM bank_accounts WHERE account_id = ?`;
        const params = [account_id];
        const result = await dbRun(
            sql,
            params,
            `Deleted bank account ${account_name}`
        );
        if (result.changes === 0) {
            return res.status(404).json({ error: "Bank account not found" });
        }
        res.json({ message: "Bank account deleted successfully" });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
