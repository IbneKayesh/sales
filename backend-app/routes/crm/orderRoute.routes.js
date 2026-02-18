const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManager");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
  try {
    const { rutes_users, rutes_bsins } = req.body;

    // Validate input
    if (!rutes_users || !rutes_bsins) {
      return res.json({
        success: false,
        message: "User ID and Business ID are required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT rts.*, trt.trtry_wname, ara.tarea_tname, dzn.dzone_dname,
    (
        SELECT COUNT(*)
        FROM tmcb_cntrt c
        WHERE c.cnrut_rutes = rts.id
        AND c.cnrut_actve = 1
    ) AS total_outlets
FROM tmcb_rutes rts
LEFT JOIN tmcb_trtry trt ON rts.rutes_trtry = trt.id
LEFT JOIN tmcb_tarea ara ON trt.trtry_tarea = ara.id
LEFT JOIN tmcb_dzone dzn ON ara.tarea_dzone = dzn.id
WHERE rts.rutes_users = ?
AND rts.rutes_bsins = ?
ORDER BY rts.rutes_rname`;
    const params = [rutes_users, rutes_bsins];

    const rows = await dbGetAll(sql, params, `Get routes for ${rutes_users}`);
    res.json({
      success: true,
      message: "Routes fetched successfully",
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

// create
router.post("/create", async (req, res) => {
  try {
    const {
      id,
      rutes_users,
      rutes_bsins,
      rutes_rname,
      rutes_dname,
      rutes_trtry,
      user_id,
    } = req.body;

    // Validate input
    if (!id || !rutes_users || !rutes_bsins || !rutes_rname || !rutes_dname) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `INSERT INTO tmcb_rutes(id, rutes_users, rutes_bsins, rutes_rname, rutes_dname, rutes_trtry,
    rutes_crusr, rutes_upusr)
    VALUES (?, ?, ?, ?, ?, ?,
    ?, ?)`;
    const params = [
      id,
      rutes_users,
      rutes_bsins,
      rutes_rname,
      rutes_dname,
      rutes_trtry,
      user_id,
      user_id,
    ];

    await dbRun(sql, params, `Create route for ${rutes_rname}`);
    res.json({
      success: true,
      message: "Route created successfully",
      data: null,
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

// update
router.post("/update", async (req, res) => {
  try {
    const {
      id,
      rutes_users,
      rutes_bsins,
      rutes_rname,
      rutes_dname,
      rutes_trtry,
      user_id,
    } = req.body;

    // Validate input
    if (!id || !rutes_users || !rutes_bsins || !rutes_rname || !rutes_dname) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmcb_rutes
    SET rutes_rname = ?,
    rutes_dname = ?,
    rutes_trtry = ?,
    rutes_upusr = ?,
    rutes_rvnmr = rutes_rvnmr + 1
    WHERE id = ?`;
    const params = [
      rutes_rname,
      rutes_dname,
      rutes_trtry,
      user_id,
      id,
    ];

    await dbRun(sql, params, `Update route for ${rutes_rname}`);
    res.json({
      success: true,
      message: "Route updated successfully",
      data: null,
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

// delete
router.post("/delete", async (req, res) => {
  try {
    const { id, rutes_rname } = req.body;

    // Validate input
    if (!id) {
      return res.json({
        success: false,
        message: "Contact ID is required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmcb_rutes
    SET rutes_actve = 1 - rutes_actve
    WHERE id = ?`;
    const params = [id];

    await dbRun(sql, params, `Delete route for ${rutes_rname}`);
    res.json({
      success: true,
      message: "Route deleted successfully",
      data: null,
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
