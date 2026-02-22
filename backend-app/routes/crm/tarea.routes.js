const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManager");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
  try {
    const { tarea_users, tarea_bsins } = req.body;

    // Validate input
    if (!tarea_users || !tarea_bsins) {
      return res.json({
        success: false,
        message: "User ID and Business ID are required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT ara.id, ara.tarea_users, ara.tarea_bsins, ara.tarea_dzone, ara.tarea_tname, ara.tarea_actve, 
    dzo.dzone_dname, dzo.dzone_cntry,
    0 as edit_stop
    FROM tmcb_tarea ara
    LEFT JOIN tmcb_dzone dzo ON dzo.id = ara.tarea_dzone
    WHERE ara.tarea_users = ?
    AND ara.tarea_bsins = ?
    ORDER BY dzo.dzone_dname, ara.tarea_tname`;
    const params = [tarea_users, tarea_bsins];

    const rows = await dbGetAll(sql, params, `Get TArea for ${tarea_users}`);
    res.json({
      success: true,
      message: "TArea fetched successfully",
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
      tarea_users,
      tarea_bsins,
      tarea_dzone,
      tarea_tname,
      user_id,
    } = req.body;

    // Validate input
    if (
      !id ||
      !tarea_users ||
      !tarea_bsins ||
      !tarea_dzone ||
      !tarea_tname ||
      !user_id
    ) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `INSERT INTO tmcb_tarea(id, tarea_users, tarea_bsins, tarea_dzone, tarea_tname, tarea_crusr, tarea_upusr)
    VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const params = [
      id,
      tarea_users,
      tarea_bsins,
      tarea_dzone,
      tarea_tname,
      user_id,
      user_id,
    ];

    await dbRun(sql, params, `Create TArea for ${tarea_tname}`);
    res.json({
      success: true,
      message: "TArea created successfully",
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
      tarea_users,
      tarea_bsins,
      tarea_dzone,
      tarea_tname,
      user_id,
    } = req.body;

    // Validate input
    if (
      !id ||
      !tarea_users ||
      !tarea_bsins ||
      !tarea_dzone ||
      !tarea_tname ||
      !user_id
    ) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmcb_tarea
    SET tarea_tname = ?,
    tarea_dzone = ?,
    tarea_upusr = ?,
    tarea_rvnmr = tarea_rvnmr + 1
    WHERE id = ?`;
    const params = [
      tarea_tname,
      tarea_dzone,
      user_id,
      id,
    ];
    await dbRun(sql, params, `Update TArea for ${tarea_tname}`);
    res.json({
      success: true,
      message: "TArea updated successfully",
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
    const { id, tarea_tname } = req.body;

    // Validate input
    if (!id) {
      return res.json({
        success: false,
        message: "TArea ID is required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmcb_tarea
    SET tarea_actve = 1 - tarea_actve
    WHERE id = ?`;
    const params = [id];

    await dbRun(sql, params, `Delete TArea for ${tarea_tname}`);
    res.json({
      success: true,
      message: "TArea deleted successfully",
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

// get by dzone
router.post("/get-by-dzone", async (req, res) => {
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

module.exports = router;
