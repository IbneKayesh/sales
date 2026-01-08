const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManager");
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
      FROM tmab_bsins bsn
      WHERE bsn.bsins_users = ?
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
      bsins_stdat,
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
    const sql = `INSERT INTO tmab_bsins
    (id,bsins_users,bsins_bname,bsins_addrs,bsins_email,bsins_cntct,
    bsins_binno,bsins_btags,bsins_cntry,bsins_stdat,bsins_crusr,bsins_upusr)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`;
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
      bsins_stdat,
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
      bsins_stdat,
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
    const sql = `UPDATE tmab_bsins
    SET bsins_bname = ?,
    bsins_addrs = ?,
    bsins_email = ?,
    bsins_cntct = ?,
    bsins_binno = ?,
    bsins_btags = ?,
    bsins_cntry = ?,
    bsins_stdat = ?,
    bsins_upusr = ?,
    bsins_rvnmr = bsins_rvnmr + 1
    WHERE id = ?`;
    const params = [
      bsins_bname,
      bsins_addrs,
      bsins_email,
      bsins_cntct,
      bsins_binno,
      bsins_btags,
      bsins_cntry,
      bsins_stdat,
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
    const { id, bsins_bname } = req.body;

    // Validate input
    if (!id) {
      return res.json({
        success: false,
        message: "User ID is required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmab_bsins
    SET bsins_actve = 1 - bsins_actve
    WHERE id = ?`;
    const params = [id];

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

module.exports = router;
