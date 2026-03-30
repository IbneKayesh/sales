const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
  try {
    const { scyle_users, scyle_bsins } = req.body;

    // Validate input
    if (!scyle_users || !scyle_bsins) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT scyle.*, 0 as edit_stop
      FROM tmhb_scyle scyle
      WHERE scyle.scyle_users = $1
      AND scyle.scyle_bsins = $2
      ORDER BY scyle.scyle_cname`;
    const params = [scyle_users, scyle_bsins];

    const rows = await dbGetAll(
      sql,
      params,
      `Get salary cycle for ${scyle_users}`,
    );
    res.json({
      success: true,
      message: "Salary Cycle fetched successfully",
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
      scyle_users,
      scyle_bsins,
      scyle_yerid,
      scyle_gname,
      scyle_cname,
      scyle_frdat,
      scyle_todat,
      scyle_today,
      scyle_notes,
      scyle_iscmp,
      muser_id,
      suser_id,
    } = req.body;

    // Validate input
    if (
      !id ||
      !scyle_users ||
      !scyle_bsins ||
      !scyle_yerid ||
      !scyle_gname ||
      !scyle_cname ||
      !scyle_frdat ||
      !scyle_todat ||
      !scyle_today ||
      !muser_id ||
      !suser_id
    ) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `INSERT INTO tmhb_scyle(id, scyle_users, scyle_bsins, scyle_yerid, scyle_gname, scyle_cname,
    scyle_frdat, scyle_todat, scyle_today, scyle_notes, scyle_iscmp, scyle_crusr, scyle_upusr)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`;
    const params = [
      id,
      scyle_users,
      scyle_bsins,
      scyle_yerid !== undefined ? scyle_yerid : 0,
      scyle_gname,
      scyle_cname,
      scyle_frdat,
      scyle_todat,
      scyle_today !== undefined ? scyle_today : 1,
      scyle_notes || '',
      scyle_iscmp !== undefined ? scyle_iscmp : false,
      suser_id,
      suser_id,
    ];

    await dbRun(sql, params, `Create salary cycle for ${scyle_cname}`);
    res.json({
      success: true,
      message: "Salary Cycle created successfully",
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
      scyle_users,
      scyle_bsins,
      scyle_yerid,
      scyle_gname,
      scyle_cname,
      scyle_frdat,
      scyle_todat,
      scyle_today,
      scyle_notes,
      scyle_iscmp,
      muser_id,
      suser_id,
    } = req.body;

    // Validate input
    if (
      !id ||
      !scyle_users ||
      !scyle_bsins ||
      !scyle_yerid ||
      !scyle_gname ||
      !scyle_cname ||
      !scyle_frdat ||
      !scyle_todat ||
      !scyle_today ||
      !muser_id ||
      !suser_id
    ) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmhb_scyle
    SET scyle_yerid = $1,
    scyle_gname = $2,
    scyle_cname = $3,
    scyle_frdat = $4,
    scyle_todat = $5,
    scyle_today = $6,
    scyle_notes = $7,
    scyle_iscmp = $8,
    scyle_upusr = $9,
    scyle_updat = CURRENT_TIMESTAMP,
    scyle_rvnmr = scyle_rvnmr + 1
    WHERE id = $10`;
    const params = [
      scyle_yerid !== undefined ? scyle_yerid : 0,
      scyle_gname,
      scyle_cname,
      scyle_frdat,
      scyle_todat,
      scyle_today !== undefined ? scyle_today : 1,
      scyle_notes || '',
      scyle_iscmp !== undefined ? scyle_iscmp : false,
      suser_id,
      id,
    ];

    await dbRun(sql, params, `Update salary cycle for ${scyle_cname}`);
    res.json({
      success: true,
      message: "Salary cycle updated successfully",
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
    const { id, scyle_cname, muser_id, suser_id } = req.body;

    // Validate input
    if (!id) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmhb_scyle
    SET scyle_actve = NOT scyle_actve,
    scyle_upusr = $1,
    scyle_updat = CURRENT_TIMESTAMP,
    scyle_rvnmr = scyle_rvnmr + 1
    WHERE id = $2`;
    const params = [suser_id, id];

    await dbRun(sql, params, `Delete salary cycle for ${scyle_cname}`);
    res.json({
      success: true,
      message: "Salary cycle deleted successfully",
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

// get all active
router.post("/get-all-active", async (req, res) => {
  try {
    const { scyle_users, scyle_bsins } = req.body;

    // Validate input
    if (!scyle_users || !scyle_bsins) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT scyle.*, 0 as edit_stop
      FROM tmhb_scyle scyle
      WHERE scyle.scyle_users = $1
      AND scyle.scyle_bsins = $2
      AND scyle.scyle_actve = TRUE
      ORDER BY scyle.scyle_cname`;
    const params = [scyle_users, scyle_bsins];

    const rows = await dbGetAll(
      sql,
      params,
      `Get salary cycle for ${scyle_users}`,
    );
    res.json({
      success: true,
      message: "Salary Cycle fetched successfully",
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
