const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManager");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
  try {
    const { trhed_users } = req.body;

    // Validate input
    if (!trhed_users) {
      return res.json({
        success: false,
        message: "User ID is required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT acts.*, 0 as edit_stop
      FROM tmtb_trhed acts
      WHERE acts.trhed_users = ?
      ORDER BY acts.id`;
    const params = [trhed_users];

    const rows = await dbGetAll(sql, params, `Get account heads for ${trhed_users}`);
    res.json({
      success: true,
      message: "Account heads fetched successfully",
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
