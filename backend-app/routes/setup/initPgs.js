const express = require("express");
const router = express.Router();
const { pool } = require("../../db/database");

const { contacts, contactsData } = require("../../db/contactsPgs")();

router.get("/init-tables", async (req, res) => { 

  // create table
  await pool.query(contacts);

  // insert default rows
  for (const c of contactsData) {
    const sql = `
    INSERT INTO contacts (contact_id, contact_name, contact_mobile, contact_email, contact_address, contact_type, credit_limit, payable_balance, advance_balance, current_balance, shop_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    ON CONFLICT (contact_id) DO NOTHING
  `;
    const params = [
      c.contact_id,
      c.contact_name,
      c.contact_mobile,
      c.contact_email,
      c.contact_address,
      c.contact_type,
      c.credit_limit,
      c.payable_balance,
      c.advance_balance,
      c.current_balance,
      c.shop_id,
    ];
    await pool.query(sql, params);
  }
});

module.exports = router;
