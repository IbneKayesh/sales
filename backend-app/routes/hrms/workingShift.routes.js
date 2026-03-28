const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
  try {
    const { wksft_users, wksft_bsins } = req.body;

    // Validate input
    if (!wksft_users || !wksft_bsins) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT wks.*, 0 as edit_stop
      FROM tmhb_wksft wks
      WHERE wks.wksft_users = $1
      AND wks.wksft_bsins = $2
      ORDER BY wks.wksft_sftnm`;
    const params = [wksft_users, wksft_bsins];

    const rows = await dbGetAll(
      sql,
      params,
      `Get working shift for ${wksft_users}`,
    );
    res.json({
      success: true,
      message: "Working Shift fetched successfully",
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
      wksft_users,
      wksft_bsins,
      wksft_sftnm,
      wksft_btbst,
      wksft_satim,
      wksft_gsmin,
      wksft_gemin,
      wksft_entim,
      wksft_btand,
      wksft_wrhrs,
      wksft_mnhrs,
      wksft_crday,
      wksft_sgpnc,
      wksft_ovrtm,
      muser_id,
      suser_id,
    } = req.body;

    //console.log("req.body", req.body);

    // Validate input
    if (
      !id ||
      !wksft_users ||
      !wksft_bsins ||
      !wksft_sftnm ||
      !wksft_btbst ||
      !wksft_satim ||
      !wksft_entim ||
      !wksft_btand ||
      !wksft_wrhrs ||
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
    const sql = `INSERT INTO tmhb_wksft(id, wksft_users, wksft_bsins, wksft_sftnm, wksft_btbst,
    wksft_satim, wksft_gsmin, wksft_gemin, wksft_entim, wksft_btand, wksft_wrhrs,
    wksft_mnhrs, wksft_crday, wksft_sgpnc, wksft_ovrtm, wksft_crusr, wksft_upusr)
    VALUES ($1, $2, $3, $4, $5,
    $6, $7, $8, $9, $10, $11,
    $12, $13, $14, $15, $16, $17)`;
    const params = [
      id,
      wksft_users,
      wksft_bsins,
      wksft_sftnm,
      wksft_btbst,
      wksft_satim,
      wksft_gsmin,
      wksft_gemin,
      wksft_entim,
      wksft_btand,
      wksft_wrhrs,
      wksft_mnhrs,
      wksft_crday,
      wksft_sgpnc,
      wksft_ovrtm,
      suser_id,
      suser_id,
    ];

    await dbRun(sql, params, `Create working shift for ${wksft_sftnm}`);
    res.json({
      success: true,
      message: "Working Shift created successfully",
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
      wksft_users,
      wksft_bsins,
      wksft_sftnm,
      wksft_btbst,
      wksft_satim,
      wksft_gsmin,
      wksft_gemin,
      wksft_entim,
      wksft_btand,
      wksft_wrhrs,
      wksft_mnhrs,
      wksft_crday,
      wksft_sgpnc,      
      wksft_ovrtm,
      muser_id,
      suser_id,
    } = req.body;

    //console.log("req.body", req.body);

    // Validate input
    if (
      !id ||
      !wksft_users ||
      !wksft_bsins ||
      !wksft_sftnm ||
      !wksft_btbst ||
      !wksft_satim ||
      !wksft_entim ||
      !wksft_btand ||
      !wksft_wrhrs ||
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
    const sql = `UPDATE tmhb_wksft
    SET wksft_sftnm = $1,
    wksft_btbst = $2,
    wksft_satim = $3,
    wksft_gsmin = $4,
    wksft_gemin = $5,
    wksft_entim = $6,
    wksft_btand = $7,
    wksft_wrhrs = $8,
    wksft_mnhrs = $9,
    wksft_crday = $10,
    wksft_sgpnc = $11,
    wksft_ovrtm = $12, 
    wksft_upusr = $13,
    wksft_updat = CURRENT_TIMESTAMP,
    wksft_rvnmr= wksft_rvnmr + 1
    WHERE id = $14`;
    const params = [
      wksft_sftnm,
      wksft_btbst,
      wksft_satim,
      wksft_gsmin,
      wksft_gemin,
      wksft_entim,
      wksft_btand,
      wksft_wrhrs,
      wksft_mnhrs,
      wksft_crday,
      wksft_sgpnc,
      wksft_ovrtm,
      suser_id,
      id,
    ];

    await dbRun(sql, params, `Update working shift for ${wksft_satim}`);
    res.json({
      success: true,
      message: "Working shift updated successfully",
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
    const { id, muser_id, wksft_sftnm, suser_id } = req.body;

    // Validate input
    if (!id) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmhb_wksft
    SET wksft_actve = NOT wksft_actve,
    wksft_upusr = $1,
    wksft_updat = CURRENT_TIMESTAMP,
    wksft_rvnmr = wksft_rvnmr + 1
    WHERE id = $2`;
    const params = [suser_id, id];

    await dbRun(sql, params, `Delete working shift for ${wksft_sftnm}`);
    res.json({
      success: true,
      message: "Working shift deleted successfully",
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
    const { wksft_users, wksft_bsins } = req.body;

    // Validate input
    if (!wksft_users || !wksft_bsins) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT wks.*, 0 as edit_stop
      FROM tmhb_wksft wks
      WHERE wks.wksft_users = $1
      AND wks.wksft_bsins = $2
      AND wks.wksft_actve = TRUE
      ORDER BY wks.wksft_sftnm`;
    const params = [wksft_users, wksft_bsins];

    const rows = await dbGetAll(
      sql,
      params,
      `Get working shift for ${wksft_users}`,
    );
    res.json({
      success: true,
      message: "Working Shift fetched successfully",
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
