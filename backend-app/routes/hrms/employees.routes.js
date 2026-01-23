const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManager");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
  try {
    const { emply_users } = req.body;

    // Validate input
    if (!emply_users) {
      return res.json({
        success: false,
        message: "User ID is required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT emply.*, 0 as edit_stop
      FROM tmrb_emply emply
      WHERE emply.emply_users = ?
      ORDER BY emply.emply_ecode`;
    const params = [emply_users];

    const rows = await dbGetAll(sql, params, `Get employee for ${emply_users}`);
    res.json({
      success: true,
      message: "Employee fetched successfully",
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
      emply_users,
      emply_bsins,
      emply_ecode,
      emply_pswrd,
      emply_ename,
      emply_econt,
      emply_addrs,
      emply_desig,
      emply_jndat,
      emply_rgdat,
      emply_crsal,
      emply_supid,
      emply_login,
      user_id,
    } = req.body;

    // Validate input
    if (
      !id ||
      !emply_users ||
      !emply_bsins ||
      !emply_ecode ||
      !emply_pswrd ||
      !emply_ename ||
      !emply_econt ||
      !emply_addrs ||
      !emply_desig ||
      !emply_jndat
    ) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `INSERT INTO tmrb_emply(id, emply_users, emply_bsins, emply_ecode, emply_pswrd, emply_ename,
    emply_econt, emply_addrs, emply_desig, emply_jndat, emply_rgdat, emply_crsal,
    emply_supid, emply_login, emply_crusr, emply_upusr)
    VALUES (?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?)`;
    const params = [
      id,
      emply_users,
      emply_bsins,
      emply_ecode,
      emply_pswrd,
      emply_ename,
      emply_econt,
      emply_addrs,
      emply_desig,
      emply_jndat,
      emply_rgdat,
      emply_crsal,
      emply_supid,
      emply_login,
      user_id,
      user_id,
    ];

    await dbRun(sql, params, `Create employee for ${emply_ename}`);
    res.json({
      success: true,
      message: "Employee created successfully",
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
      emply_users,
      emply_bsins,
      emply_ecode,
      emply_pswrd,
      emply_ename,
      emply_econt,
      emply_addrs,
      emply_desig,
      emply_jndat,
      emply_rgdat,
      emply_crsal,
      emply_supid,
      emply_login,
      user_id,
    } = req.body;

    // Validate input
    if (
      !id ||
      !emply_users ||
      !emply_bsins ||
      !emply_ecode ||
      !emply_pswrd ||
      !emply_ename ||
      !emply_econt ||
      !emply_addrs ||
      !emply_desig ||
      !emply_jndat
    ) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmab_bsins
    SET emply_ecode = ?,
    emply_pswrd = ?,
    emply_ename = ?,
    emply_econt = ?,
    emply_addrs = ?,
    emply_desig = ?,
    emply_jndat = ?,
    emply_rgdat = ?,
    emply_crsal = ?,
    emply_supid = ?,
    emply_login = ?,
    emply_upusr = ?,
    emply_rvnmr = emply_rvnmr + 1
    WHERE id = ?`;
    const params = [
      emply_ecode,
      emply_pswrd,
      emply_ename,
      emply_econt,
      emply_addrs,
      emply_desig,
      emply_jndat,
      emply_rgdat,
      emply_crsal,
      emply_supid,
      emply_login,
      user_id,
      id,
    ];

    await dbRun(sql, params, `Update employee for ${emply_ename}`);
    res.json({
      success: true,
      message: "Employee updated successfully",
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
    const { id, emply_ename } = req.body;

    // Validate input
    if (!id) {
      return res.json({
        success: false,
        message: "User ID is required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmrb_emply
    SET emply_actve = 1 - emply_actve
    WHERE id = ?`;
    const params = [id];

    await dbRun(sql, params, `Delete employee for ${emply_ename}`);
    res.json({
      success: true,
      message: "Employee deleted successfully",
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
