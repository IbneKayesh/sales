const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
  try {
    const { muser_id, bsins_id } = req.body;

    // Validate input
    if (!muser_id || !bsins_id) {
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
    WHERE ara.tarea_users = $1
    AND ara.tarea_bsins = $2
    ORDER BY dzo.dzone_dname, ara.tarea_tname`;
    const params = [muser_id, bsins_id];

    const rows = await dbGetAll(sql, params, `Get TArea for ${muser_id}`);
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
      muser_id,
      bsins_id,
      suser_id,
    } = req.body;

    //console.log(req.body)

    // Validate input
    if (!id || !tarea_dzone || !tarea_tname || !suser_id) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `INSERT INTO tmcb_tarea(id, tarea_users, tarea_bsins, tarea_dzone, tarea_tname, tarea_crusr, tarea_upusr)
    VALUES ($1, $2, $3, $4, $5, $6, $7)`;
    const params = [
      id,
      muser_id,
      bsins_id,
      tarea_dzone,
      tarea_tname,
      suser_id,
      suser_id,
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
      muser_id,
      bsins_id,
      suser_id,
    } = req.body;

    // Validate input
    if (
      !id ||
      !tarea_dzone ||
      !tarea_tname ||
      !suser_id
    ) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmcb_tarea
    SET tarea_tname = $1,
    tarea_dzone = $2,
    tarea_upusr = $3,
    tarea_updat = CURRENT_TIMESTAMP,
    tarea_rvnmr = tarea_rvnmr + 1
    WHERE id = $4`;
    const params = [tarea_tname, tarea_dzone, suser_id, id];
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
    const { id, muser_id, tarea_tname, suser_id } = req.body;

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
    SET tarea_actve = NOT tarea_actve,
    tarea_upusr = $1,
    tarea_updat = CURRENT_TIMESTAMP,
    tarea_rvnmr = tarea_rvnmr + 1
    WHERE id = $2`;
    const params = [suser_id, id];

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
    const { muser_id, tarea_dzone } = req.body;

    // Validate input
    if (!muser_id) {
      return res.json({
        success: false,
        message: "User ID is required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT ara.*, 0 as edit_stop
    FROM tmcb_tarea ara
    WHERE ara.tarea_dzone = $1
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
