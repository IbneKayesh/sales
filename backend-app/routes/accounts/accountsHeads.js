const express = require("express");
const router = express.Router();

const {
  runScriptsSequentially,
  dbRun,
  dbGet,
  dbAll,
} = require("../../db/asyncScriptsRunner");

//get all accounts heads
router.get("/", async (req, res) => {
  try {
    const sql = `SELECT ba.*, 0 as edit_stop
        FROM accounts_heads ba ORDER BY ba.head_name ASC`;
    const rows = await dbAll(sql, []);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching  accounts heads:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;
