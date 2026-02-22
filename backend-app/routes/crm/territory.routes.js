const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManager");
const { v4: uuidv4 } = require("uuid");


// get all
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
    const sql = `SELECT trt.*, ara.tarea_tname, dz.dzone_dname, 0 as edit_stop
    FROM tmcb_trtry trt
    LEFT JOIN tmcb_tarea ara ON trt.trtry_tarea = ara.id
    LEFT JOIN tmcb_dzone dz ON ara.tarea_dzone = dz.id
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

// create
router.post("/create", async (req, res) => {
  try {
    const { id, trtry_users, trtry_bsins, trtry_tarea, trtry_wname, user_id } =
      req.body;

    // Validate input
    if (
      !id ||
      !trtry_users ||
      !trtry_bsins ||
      !trtry_tarea ||
      !trtry_wname ||
      !user_id
    ) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `INSERT INTO tmcb_trtry(id, trtry_users, trtry_bsins, trtry_tarea, trtry_wname, trtry_crusr, trtry_upusr)
    VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const params = [
      id,
      trtry_users,
      trtry_bsins,
      trtry_tarea,
      trtry_wname,
      user_id,
      user_id,
    ];

    await dbRun(sql, params, `Create territory for ${trtry_wname}`);
    res.json({
      success: true,
      message: "Territory created successfully",
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
      id, trtry_users, trtry_bsins, trtry_tarea, trtry_wname, user_id
    } = req.body;

    // Validate input
    if (
      !id ||
      !trtry_users ||
      !trtry_bsins ||
      !trtry_tarea ||
      !trtry_wname ||
      !user_id
    ) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmcb_trtry
    SET trtry_tarea = ?,
    trtry_wname = ?,
    trtry_upusr = ?,
    trtry_rvnmr = trtry_rvnmr + 1
    WHERE id = ?`;
    const params = [
      trtry_tarea,
      trtry_wname,
      user_id,
      id,
    ];

    await dbRun(sql, params, `Update territory for ${trtry_wname}`);
    res.json({
      success: true,
      message: "Territory updated successfully",
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
    const { id, trtry_wname } = req.body;

    // Validate input
    if (!id) {
      return res.json({
        success: false,
        message: "Territory ID is required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmcb_trtry
    SET trtry_actve = 1 - trtry_actve
    WHERE id = ?`;
    const params = [id];

    await dbRun(sql, params, `Delete territory for ${trtry_wname}`);
    res.json({
      success: true,
      message: "Territory deleted successfully",
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

// get by tarea
router.post("/get-by-tarea", async (req, res) => {
  try {
    const { trtry_users, trtry_bsins, trtry_tarea } = req.body;

    // Validate input
    if (!trtry_users || !trtry_bsins || !trtry_tarea) {
      return res.json({
        success: false,
        message: "User ID, Business ID and Area ID are required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT trt.*, 0 as edit_stop
    FROM tmcb_trtry trt
    WHERE trt.trtry_users = ?
    AND trt.trtry_bsins = ?
    AND trt.trtry_tarea = ?
    ORDER BY trt.trtry_wname`;
    const params = [trtry_users, trtry_bsins, trtry_tarea];

    const rows = await dbGetAll(sql, params, `Get territories for ${trtry_tarea}`);
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
