//example as units.js
const express = require("express");
const router = express.Router();

const {
    runScriptsSequentially,
    dbRun,
    dbGet,
    dbAll,
} = require("../../db/asyncScriptsRunner");

//get all purchase orders
router.get("/", async (req, res) => {
  try {
    const sql = `SELECT pom.*, c.contact_name, is_posted as isedit,0 as ismodified
                    FROM po_master pom
                    LEFT JOIN contacts c ON pom.contact_id = c.contact_id`;
    const rows = await dbAll(sql, []);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching purchase orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



module.exports = router;
