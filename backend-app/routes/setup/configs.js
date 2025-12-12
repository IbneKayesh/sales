const express = require("express");
const router = express.Router();

const {
  runScriptsSequentially,
  dbRun,
  dbGet,  
  dbAll,
} = require("../../db/asyncScriptsRunner");


// Get configuration by name
router.get("/transaction/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const sql =`SELECT *
    FROM config_transaction
    WHERE config_name = ?`;
    const row = await dbGet(sql, [name]);
    if (!row) {
      return res.status(404).json({ error: "Configuration not found" });
    }
    res.json(row);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
