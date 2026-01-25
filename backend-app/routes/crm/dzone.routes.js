const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManager");
const { v4: uuidv4 } = require("uuid");

// get by country
router.post("/get-by-country", async (req, res) => {
  try {
    const { cntct_users, dzone_cntry } = req.body;

    // Validate input
    if (!cntct_users) {
      return res.json({
        success: false,
        message: "User ID is required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT dzn.*, 0 as edit_stop
    FROM tmcb_dzone dzn
    WHERE dzn.dzone_cntry = ?
    ORDER BY dzn.dzone_dname`;
    const params = [dzone_cntry];

    const rows = await dbGetAll(sql, params, `Get zones for ${dzone_cntry}`);
    res.json({
      success: true,
      message: "Zones fetched successfully",
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
