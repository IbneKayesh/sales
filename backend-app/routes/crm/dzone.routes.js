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
    const sql = `SELECT zn.id, zn.dzone_users, zn.dzone_bsins, zn.dzone_cntry, zn.dzone_dname, zn.dzone_actve, 0 as edit_stop
    FROM tmcb_dzone zn
    WHERE zn.dzone_users = $1 AND zn.dzone_bsins = $2
    ORDER BY zn.dzone_dname ASC`;
    const params = [muser_id, bsins_id];

    const rows = await dbGetAll(sql, params, `Get dzone for ${muser_id}`);
    res.json({
      success: true,
      message: "Dzone fetched successfully",
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
      dzone_users,
      dzone_bsins,
      dzone_cntry,
      dzone_dname,
      muser_id,
      bsins_id,
      suser_id,
    } = req.body;

    // Validate input
    if (!id || !dzone_cntry || !dzone_dname || !suser_id) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `INSERT INTO tmcb_dzone(id, dzone_users, dzone_bsins, dzone_cntry, dzone_dname, dzone_crusr, dzone_upusr)
    VALUES ($1, $2, $3, $4, $5, $6, $7)`;
    const params = [
      id,
      muser_id,
      bsins_id,
      dzone_cntry,
      dzone_dname,
      suser_id,
      suser_id,
    ];

    await dbRun(sql, params, `Create dzone for ${dzone_dname}`);
    res.json({
      success: true,
      message: "Dzone created successfully",
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
      dzone_users,
      dzone_bsins,
      dzone_cntry,
      dzone_dname,
      muser_id,
      bsins_id,
      suser_id,
    } = req.body;

    // Validate input
    if (!id || !dzone_cntry || !dzone_dname || !suser_id) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmcb_dzone
    SET dzone_cntry = $1,
    dzone_dname = $2,
    dzone_upusr = $3,
    dzone_updat = CURRENT_TIMESTAMP,
    dzone_rvnmr = dzone_rvnmr + 1
    WHERE id = $4`;
    const params = [dzone_cntry, dzone_dname, suser_id, id];

    await dbRun(sql, params, `Update dzone for ${dzone_dname}`);
    res.json({
      success: true,
      message: "Dzone updated successfully",
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
    const { id, muser_id, dzone_dname, suser_id } = req.body;

    // Validate input
    if (!id) {
      return res.json({
        success: false,
        message: "Zone ID is required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmcb_dzone
    SET dzone_actve = NOT dzone_actve,
    dzone_upusr = $1,
    dzone_updat = CURRENT_TIMESTAMP,
    dzone_rvnmr = dzone_rvnmr + 1
    WHERE id = $2`;
    const params = [suser_id, id];

    await dbRun(sql, params, `Delete dzone for ${dzone_dname}`);
    res.json({
      success: true,
      message: "DZone deleted successfully",
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

// get by country
router.post("/get-by-country", async (req, res) => {
  try {
    const { muser_id, dzone_cntry } = req.body;

    // Validate input
    if (!muser_id || !dzone_cntry) {
      return res.json({
        success: false,
        message: "User ID and Country ID are required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT dzn.*, 0 as edit_stop
    FROM tmcb_dzone dzn
    WHERE dzn.dzone_cntry = $1
    AND dzn.dzone_actve = TRUE
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
