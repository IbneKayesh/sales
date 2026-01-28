const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManager");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
  try {
    const { expns_users, expns_bsins } = req.body;

    // Validate input
    if (!expns_users || !expns_bsins) {
      return res.json({
        success: false,
        message: "User, Business ID is required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT *
    FROM tmpb_expns
    WHERE expns_users = ?
    AND expns_bsins = ?`;

    //ORDER BY bkng.mbkng_cntct, bkng.mbkng_trnno
    const params = [expns_users, expns_bsins];

    const rows = await dbGetAll(sql, params, `Get expenses for ${expns_users}`);
    res.json({
      success: true,
      message: "Expenses fetched successfully",
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
