const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManager");
const { v4: uuidv4 } = require("uuid");

// get by tarea
router.post("/get-by-tarea", async (req, res) => {
  try {
    const { tarea_users, tarea_dzone } = req.body;

    // Validate input
    if (!tarea_users) {
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

// get
router.post("/", async (req, res) => {
  try {
    const { trtry_users, trtry_bsins } = req.body;

    // Validate input
    if (!trtry_users || !trtry_bsins) {
      return res.json({
        success: false,
        message: "User ID and Business ID are required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT trt.*, 0 as edit_stop
    FROM tmcb_trtry trt
    WHERE trt.trtry_users = ?
    AND trt.trtry_bsins = ?
    ORDER BY trt.trtry_wname`;
    const params = [trtry_users,trtry_bsins];

    const rows = await dbGetAll(sql, params, `Get territories for ${trtry_users}`);
    res.json({
      success: true,
      message: "Territories fetched successfully",
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
