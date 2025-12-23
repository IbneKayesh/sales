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

//get by type
router.get("/by-type/:id", async (req, res) => {

  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "Contact type is required" });
  }
  try {
    const sql =
      "SELECT c.*, 0 as edit_stop FROM contacts c WHERE contact_type = ?";
    const rows = await dbAll(sql, [id]);
    res.json(rows);
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

// Get contact ledger by ID
router.get("/ledger/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `SELECT *
    FROM accounts_ledger ald
    WHERE ald.contact_id = ?
    ORDER by ald.created_at`;
    const row = await dbAll(sql, [id]);
    if (!row) {
      return res.status(404).json({ error: "Contact not found" });
    }
    res.json(row);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
