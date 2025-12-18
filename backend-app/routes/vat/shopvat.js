const express = require("express");
const router = express.Router();

const {
  runScriptsSequentially,
  dbRun,
  dbGet,
  dbAll,
} = require("../../db/asyncScriptsRunner");

//Get all contacts
router.get("/", async (req, res) => {
  try {
    const sql = `SELECT c.*, 0 as ismodified
    FROM contacts c ORDER BY contact_id`;
    const rows = await dbAll(sql, []);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//get by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const sql =
      "SELECT c.*, 0 as ismodified FROM contacts c WHERE contact_id = ?";
    const row = await dbGet(sql, [id]);
    if (!row) {
      return res.status(404).json({ error: "Contact not found" });
    }
    res.json(row);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//create new contact
router.post("/", async (req, res) => {
  const {
    contact_id,
    contact_name,
    contact_mobile,
    contact_email,
    contact_address,
    contact_type,
    credit_limit,
    payable_balance,
    advance_balance,
    current_balance,
  } = req.body;

  if (!contact_name) {
    return res.status(400).json({ error: "Contact name is required" });
  }

  if (!contact_id) {
    return res.status(400).json({ error: "Contact ID is required" });
  }


  try {
    const sql = `INSERT INTO contacts (contact_id, contact_name, contact_mobile, contact_email, contact_address, contact_type, credit_limit, payable_balance, advance_balance, current_balance)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [
      contact_id,
      contact_name,
      contact_mobile,
      contact_email,
      contact_address,
      contact_type,
      credit_limit,
      0,
      0,
      0,
    ];
    await dbRun(sql, params, `Created contact ${contact_name}`);
    res.status(201).json({ contact_id, ...req.body });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//update contact
router.post("/update", async (req, res) => {
  const {
    contact_id,
    contact_name,
    contact_mobile,
    contact_email,
    contact_address,
    contact_type,
    credit_limit,
    payable_balance,
    advance_balance,
    current_balance,
  } = req.body;

  if (!contact_name) {
    return res.status(400).json({ error: "Contact name is required" });
  }

  if (!contact_id) {
    return res.status(400).json({ error: "Contact ID is required" });
  }

  try {
    const sql = `UPDATE contacts SET
    contact_name = ?,
    contact_mobile = ?,
    contact_email = ?,
    contact_address = ?,
    contact_type = ?,
    credit_limit = ?,
    updated_at = CURRENT_TIMESTAMP
    WHERE contact_id = ?`;
    const params = [
      contact_name,
      contact_mobile,
      contact_email,
      contact_address,
      contact_type,
      credit_limit,
      contact_id,
    ];
    const result = await dbRun(sql, params, `Updated contact ${contact_name}`);
    if (result.changes === 0) {
      return res.status(404).json({ error: "Contact not found" });
    }
    res.json({ contact_id, ...req.body });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Delete contact
router.post("/delete", async (req, res) => {
  const { contact_id, contact_name } = req.body;

  if (!contact_id) {
    return res.status(400).json({ error: "Contact ID is required" });
  }

  try {
    const sql =
      "DELETE FROM contacts WHERE contact_id = ? AND current_balance = 0";
    const result = await dbRun(
      sql,
      [contact_id],
      `Deleted contact ${contact_name}`
    );
    if (result.changes === 0) {
      return res.status(404).json({ error: "Contact not found" });
    }
    res.json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//vat collection
router.post("/vat-collection", async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }

  try {

    //build scripts
    const scripts = [];

    //collect vat from purchase
    scripts.push({
      label: "1 of 2 :: Collect VAT from Purchase",
      sql: `INSERT INTO vat_details (details_id, master_id, shop_id, contact_id, advance_amount, due_amount, reference_no, reference_date, reference_note, source_name)
      SELECT ROW_NUMBER() OVER (ORDER BY pom.master_id) as details_id, 'any' as master_id, pom.shop_id, pom.contact_id,
      CASE WHEN pom.is_vat_payable = 0 THEN pom.vat_amount ELSE 0 END as advance_amount,
      CASE WHEN pom.is_vat_payable = 1 THEN pom.vat_amount ELSE 0 END as due_amount,
      pom.order_no as reference_no, pom.order_date as reference_date,
      CASE WHEN pom.is_vat_payable = 0 THEN 'Paid at source' ELSE 'Pay later' END as reference_note,
      'Purchase' as source_name
      FROM po_master pom
      WHERE pom.vat_amount > 0
      AND pom.vat_collected = 0`,
      params: [],
    });

    scripts.push({
      label: "2 of 2 :: Update purchase VAT Collected",
      sql: `WITH vat_entry as (
        SELECT vatd.reference_no
        FROM vat_details vatd
        JOIN po_master pom on vatd.reference_no = pom.order_no
        WHERE pom.vat_collected = 0
        )
        UPDATE po_master
        SET vat_collected = 1
        WHERE order_no in (
        SELECT reference_no FROM vat_entry
        )
        OR vat_amount = 0`,
      params: [],
    });

    //run scripts
    const results = await runScriptsSequentially(scripts, {
      useTransaction: true,
    });



    // If any failed, transaction has already rolled back
    if (!results.every((r) => r.success)) {
      return res.status(500).json({ error: "Failed to collect VAT from purchase" });
    }
    // ❗ Only one response is sent
    res.status(201).json({
      message: "VAT collected successfully!",
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;
