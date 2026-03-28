const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
  try {
    const { hlday_users, hlday_bsins } = req.body;

    // Validate input
    if (!hlday_users || !hlday_bsins) {
      return res.json({
        success: false,
        message: "User ID and Business ID are required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT tbl.*, 0 as edit_stop
      FROM tmhb_hlday tbl
      WHERE tbl.hlday_users = $1
      AND tbl.hlday_bsins = $2
      ORDER BY tbl.hlday_hldat DESC`;
    const params = [hlday_users, hlday_bsins];

    const rows = await dbGetAll(sql, params, `Get holidays for ${hlday_users}`);
    res.json({
      success: true,
      message: "Holidays fetched successfully",
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
    let {
      id,
      hlday_users,
      hlday_bsins,
      hlday_yerid,
      hlday_hldat,
      hlday_hldnm,
      hlday_notes,
      suser_id,
    } = req.body;

    // Handle date formatting
    if (hlday_hldat) {
      hlday_hldat = new Date(hlday_hldat);
    }

    // Validate input
    if (
      !id ||
      !hlday_users ||
      !hlday_bsins ||
      !hlday_yerid ||
      !hlday_hldat ||
      !hlday_hldnm
    ) {
      return res.json({
        success: false,
        message: "Required fields are missing",
        data: null,
      });
    }

    //database action
    const sql = `INSERT INTO tmhb_hlday
    (id, hlday_users, hlday_bsins, hlday_yerid, hlday_hldat, hlday_hldnm, hlday_notes, hlday_crusr, hlday_upusr)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
    const params = [
      id,
      hlday_users,
      hlday_bsins,
      hlday_yerid,
      hlday_hldat,
      hlday_hldnm,
      hlday_notes,
      suser_id,
      suser_id,
    ];

    await dbRun(sql, params, `Create holiday for ${hlday_hldnm}`);
    res.json({
      success: true,
      message: "Holiday created successfully",
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
    let {
      id,
      hlday_users,
      hlday_bsins,
      hlday_yerid,
      hlday_hldat,
      hlday_hldnm,
      hlday_notes,
      suser_id,
    } = req.body;

    if (hlday_hldat) {
      hlday_hldat = new Date(hlday_hldat);
    }

    // Validate input
    if (
      !id ||
      !hlday_users ||
      !hlday_bsins ||
      !hlday_yerid ||
      !hlday_hldat ||
      !hlday_hldnm
    ) {
      return res.json({
        success: false,
        message: "Required fields are missing",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmhb_hlday
    SET hlday_yerid = $1,
    hlday_hldat = $2,
    hlday_hldnm = $3,
    hlday_notes = $4,
    hlday_upusr = $5,
    hlday_updat = CURRENT_TIMESTAMP,
    hlday_rvnmr = hlday_rvnmr + 1
    WHERE id = $6`;
    const params = [
      hlday_yerid,
      hlday_hldat,
      hlday_hldnm,
      hlday_notes,
      suser_id,
      id,
    ];

    await dbRun(sql, params, `Update holiday for ${hlday_hldnm}`);
    res.json({
      success: true,
      message: "Holiday updated successfully",
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
    const { id, hlday_hldnm, suser_id } = req.body;

    // Validate input
    if (!id) {
      return res.json({
        success: false,
        message: "ID is required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmhb_hlday
    SET hlday_actve = NOT hlday_actve,
    hlday_upusr = $1,
    hlday_updat = CURRENT_TIMESTAMP,
    hlday_rvnmr = hlday_rvnmr + 1
    WHERE id = $2`;
    const params = [suser_id, id];

    await dbRun(sql, params, `Delete holiday for ${hlday_hldnm}`);
    res.json({
      success: true,
      message: "Holiday deleted successfully",
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
    const { hlday_users, hlday_bsins } = req.body;

    // Validate input
    if (!hlday_users || !hlday_bsins) {
      return res.json({
        success: false,
        message: "User ID and Business ID are required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT tbl.*, 0 as edit_stop
      FROM tmhb_hlday tbl
      WHERE tbl.hlday_users = $1
      AND tbl.hlday_bsins = $2
      AND tbl.hlday_actve = TRUE
      ORDER BY tbl.hlday_hldat DESC`;
    const params = [hlday_users, hlday_bsins];

    const rows = await dbGetAll(
      sql,
      params,
      `Get active holidays for ${hlday_users}`,
    );
    res.json({
      success: true,
      message: "Active holidays fetched successfully",
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
