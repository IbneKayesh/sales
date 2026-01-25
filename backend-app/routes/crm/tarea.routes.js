const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManager");
const { v4: uuidv4 } = require("uuid");

// get by dzone
router.post("/get-by-dzone", async (req, res) => {
  try {
    const { cntct_users, tarea_dzone } = req.body;

    // Validate input
    if (!cntct_users) {
      return res.json({
        success: false,
        message: "User ID is required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT ara.*, 0 as edit_stop
    FROM tmcb_tarea ara
    WHERE ara.tarea_dzone = ?
    ORDER BY ara.tarea_tname`;
    const params = [tarea_dzone];

    const rows = await dbGetAll(sql, params, `Get areas for ${tarea_dzone}`);
    res.json({
      success: true,
      message: "Areas fetched successfully",
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
