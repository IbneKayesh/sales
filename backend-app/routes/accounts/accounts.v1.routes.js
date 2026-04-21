const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
  try {
    const { user_m, user_b } = req.body;

    // Validate input
    if (!user_m || !user_b) {
      return res.json({
        success: false,
        message: "User is required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT acts.*, 0 as edit_stop
      FROM tmtb_bacts acts
      WHERE acts.bacts_users = $1
      AND acts.bacts_bsins = $2
      ORDER BY acts.bacts_bankn
      LIMIT 1000`;
    const params = [user_m, user_b];

    const rows = await dbGetAll(sql, params, `Get accounts for ${user_m}`);
    res.json({
      success: true,
      message: "Accounts fetched successfully",
      data: rows,
    });
  } catch (error) {
    console.error("database action error:", error);
    return res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: null,
    });
  }
});


module.exports = router;