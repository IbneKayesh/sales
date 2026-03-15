const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
  try {
    const { bsins_users } = req.body;

    // Validate input
    if (!bsins_users) {
      return res.json({
        success: false,
        message: "User ID is required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT bsn.*, 0 as edit_stop
      FROM tmsb_bsins bsn
      WHERE bsn.bsins_users = $1
      ORDER BY bsn.bsins_bname`;
    const params = [bsins_users];

    const rows = await dbGetAll(sql, params, `Get business for ${bsins_users}`);
    res.json({
      success: true,
      message: "Business fetched successfully",
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
      bsins_users,
      bsins_bname,
      bsins_addrs,
      bsins_email,
      bsins_cntct,
      bsins_binno,
      bsins_btags,
      bsins_cntry,
      bsins_bstyp,
      bsins_tstrn,
      bsins_prtrn,
      bsins_sltrn,
      bsins_stdat,
      bsins_pbviw,
      user_id,
    } = req.body;

    // Validate input
    if (
      !id ||
      !bsins_users ||
      !bsins_bname ||
      !bsins_addrs ||
      !bsins_email ||
      !bsins_cntct ||
      !bsins_btags ||
      !bsins_cntry ||
      !bsins_stdat
    ) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `INSERT INTO tmsb_bsins
    (id,bsins_users,bsins_bname,bsins_addrs,bsins_email,bsins_cntct,
    bsins_binno,bsins_btags,bsins_cntry, bsins_bstyp, bsins_tstrn,bsins_prtrn, bsins_sltrn,
    bsins_stdat,bsins_pbviw,bsins_crusr,bsins_upusr)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`;
    const params = [
      id,
      bsins_users,
      bsins_bname,
      bsins_addrs,
      bsins_email,
      bsins_cntct,
      bsins_binno,
      bsins_btags,
      bsins_cntry,
      bsins_bstyp,
      bsins_tstrn,
      bsins_prtrn,
      bsins_sltrn,
      bsins_stdat,
      bsins_pbviw,
      user_id,
      user_id,
    ];

    await dbRun(sql, params, `Create business for ${bsins_bname}`);
    res.json({
      success: true,
      message: "Business created successfully",
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
      bsins_users,
      bsins_bname,
      bsins_addrs,
      bsins_email,
      bsins_cntct,
      bsins_binno,
      bsins_btags,
      bsins_cntry,
      bsins_bstyp,
      bsins_tstrn,
      bsins_prtrn,
      bsins_sltrn,
      bsins_stdat,
      bsins_pbviw,
      user_id,
    } = req.body;

    // Validate input
    if (
      !id ||
      !bsins_users ||
      !bsins_bname ||
      !bsins_addrs ||
      !bsins_email ||
      !bsins_cntct ||
      !bsins_btags ||
      !bsins_cntry ||
      !bsins_stdat
    ) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmsb_bsins
    SET bsins_bname = $1,
    bsins_addrs = $2,
    bsins_email = $3,
    bsins_cntct = $4,
    bsins_binno = $5,
    bsins_btags = $6,
    bsins_cntry = $7,
    bsins_bstyp = $8,
    bsins_tstrn = $9,
    bsins_prtrn = $10,
    bsins_sltrn = $11,
    bsins_stdat = $12,
    bsins_pbviw = $13,
    bsins_upusr = $14,
    bsins_rvnmr = bsins_rvnmr + 1
    WHERE id = $15`;
    const params = [
      bsins_bname,
      bsins_addrs,
      bsins_email,
      bsins_cntct,
      bsins_binno,
      bsins_btags,
      bsins_cntry,
      bsins_bstyp,
      bsins_tstrn,
      bsins_prtrn,
      bsins_sltrn,
      bsins_stdat,
      bsins_pbviw,
      user_id,
      id,
    ];

    await dbRun(sql, params, `Update business for ${bsins_bname}`);
    res.json({
      success: true,
      message: "Business updated successfully",
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
    const { id, bsins_bname, suser_id } = req.body;

    // Validate input
    if (!id) {
      return res.json({
        success: false,
        message: "User ID is required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmsb_bsins
    SET bsins_actve = NOT bsins_actve,
    bsins_upusr = $1,
    bsins_updat = CURRENT_TIMESTAMP,
    bsins_rvnmr = bsins_rvnmr + 1
    WHERE id = $2`;
    const params = [suser_id, id];

    await dbRun(sql, params, `Delete business for ${bsins_bname}`);
    res.json({
      success: true,
      message: "Business deleted successfully",
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
    const { muser_id } = req.body;

    // Validate input
    if (!muser_id) {
      return res.json({
        success: false,
        message: "User ID is required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT bsn.*, 0 as edit_stop
      FROM tmsb_bsins bsn
      WHERE bsn.bsins_users = $1
      AND bsn.bsins_actve = TRUE
      ORDER BY bsn.bsins_bname`;

    const params = [muser_id];

    const rows = await dbGetAll(sql, params, `Get business for ${muser_id}`);
    res.json({
      success: true,
      message: "Business fetched successfully",
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
