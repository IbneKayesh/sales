const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun } = require("../../db/database");

// ---------------- GET ALL CONTACTS ----------------
router.get("/", async (req, res) => {
  try {
    const sql = `SELECT u.*, s.shop_name, 0 as edit_stop 
    FROM contacts u 
    LEFT JOIN shops s ON u.shop_id = s.shop_id 
    ORDER BY contact_id`;
    const rows = await dbGetAll(sql, [], "Get all contacts");

    res.json({
      message: "Fetched all contacts",
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({
      message: "Internal server error",
      data: [],
    });
  }
});

// ---------------- GET CONTACT BY ID ----------------
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const sql =
      "SELECT u.*, 0 as edit_stop FROM contacts u WHERE contact_id = $1";
    const row = await dbGet(sql, [id], "Get contact by id");

    if (!row) {
      return res.status(404).json({
        message: "Contact not found",
        data: {},
      });
    }

    res.json({
      message: "Fetched contact",
      data: row,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({
      message: "Internal server error",
      data: {},
    });
  }
});

// ---------------- GET CONTACT BY TYPE ----------------
router.get("/by-type/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const sql =
      "SELECT u.*, 0 as edit_stop FROM contacts u WHERE contact_type = $1";
    const row = await dbGet(sql, [id], "Get contact by type");

    if (!row) {
      return res.status(404).json({
        message: "Contact not found",
        data: {},
      });
    }

    res.json({
      message: "Fetched contact",
      data: row,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({
      message: "Internal server error",
      data: {},
    });
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

// ---------------- CREATE CONTACT ----------------
router.post("/", async (req, res) => {
  const {
    contact_id,
    contact_name,
    contact_mobile,
    contact_email,
    contact_address,
    contact_type,
    credit_limit,
    shop_id,
  } = req.body;

  //console.log("CONTACT: " + JSON.stringify(req.body));

  if (
    !contact_id ||
    !contact_name ||
    !contact_mobile ||
    !contact_type ||
    !shop_id
  ) {
    return res.status(400).json({
      message:
        "contact_id, contact_name, contact_mobile, contact_type, and shop_id are required",
      data: req.body,
    });
  }

  try {
    const sql = `
    INSERT INTO contacts (contact_id, contact_name, contact_mobile, contact_email, contact_address, contact_type, credit_limit, payable_balance, advance_balance, current_balance, shop_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `;
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
      shop_id,
    ];

    console.log("params: " + JSON.stringify(params));
    await dbRun(sql, params, `Created contact ${contact_name}`);

    res.status(201).json({
      message: "Contact created successfully",
      data: req.body,
    });
  } catch (error) {
    console.error("Error creating contact:", error);
    res.status(500).json({
      message: "Internal server error",
      data: {},
    });
  }
});

// ---------------- UPDATE CONTACT ----------------
router.post("/update", async (req, res) => {
  const {
    contact_id,
    contact_name,
    contact_mobile,
    contact_email,
    contact_address,
    contact_type,
    credit_limit,
    shop_id,
  } = req.body;

  //console.log("CONTACT: " + JSON.stringify(req.body));

  if (
    !contact_id ||
    !contact_name ||
    !contact_mobile ||
    !contact_type ||
    !shop_id
  ) {
    return res.status(400).json({
      message:
        "contact_id, contact_name, contact_mobile, contact_type, and shop_id are required",
      data: req.body,
    });
  }

  try {
    const sql = `UPDATE contacts SET
    contact_name = $1,
    contact_mobile = $2,
    contact_email = $3,
    contact_address = $4,
    contact_type = $5,
    credit_limit = $6,
    updated_at = CURRENT_TIMESTAMP
    WHERE contact_id = $7`;
    const params = [
      contact_name,
      contact_mobile,
      contact_email,
      contact_address,
      contact_type,
      credit_limit,
      contact_id,
    ];

    console.log("params: " + JSON.stringify(params));

    const resultCount = await dbRun(
      sql,
      params,
      `Updated contact ${contact_name}`
    );

    if (resultCount === 0) {
      return res.status(404).json({
        message: "Contact not found",
        data: req.body,
      });
    }

    res.json({
      message: "Contact updated successfully",
      data: req.body,
    });
  } catch (error) {
    console.error("Error updating contact:", error);
    res.status(500).json({
      message: "Internal server error",
      data: {},
    });
  }
});

// ---------------- DELETE CONTACT ----------------
router.post("/delete", async (req, res) => {
  const { contact_id } = req.body;

  if (!contact_id) {
    return res.status(400).json({
      message: "contact_id is required",
      data: req.body,
    });
  }

  try {
    const sql =
      "DELETE FROM contacts WHERE contact_id = $1 AND current_balance = 0";
    const resultCount = await dbRun(sql, [user_id], `Deleted user ${user_id}`);

    if (resultCount === 0) {
      return res.status(404).json({
        message: "Contact not found",
        data: req.body,
      });
    }
    res.json({
      message: "Contact deleted successfully",
      data: req.body,
    });
  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).json({
      message: "Internal server error",
      data: {},
    });
  }
});

module.exports = router;
