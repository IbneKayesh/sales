const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManager");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
  try {
    const { rutes_users } = req.body;

    // Validate input
    if (!rutes_users) {
      return res.json({
        success: false,
        message: "User ID is required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT rts.*
    FROM tmcb_rutes rts
    WHERE rts.rutes_users = ?
    ORDER BY rts.rutes_rname`;
    const params = [rutes_users];

    const rows = await dbGetAll(sql, params, `Get routes for ${rutes_users}`);
    res.json({
      success: true,
      message: "Routes fetched successfully",
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
      rutes_users,
      rutes_bsins,
      rutes_rname,
      rutes_dname,
      rutes_lvdat,
      rutes_ttcnt,
      rutes_odval,
      rutes_dlval,
      rutes_clval,
      rutes_duval,
      user_id,
    } = req.body;

    // Validate input
    if (!id || !rutes_users || !rutes_bsins || !rutes_rname || !rutes_dname) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `INSERT INTO tmcb_rutes(id, rutes_users, rutes_bsins, rutes_rname, rutes_dname, rutes_lvdat,
    rutes_ttcnt, rutes_odval, rutes_dlval, rutes_clval, rutes_duval,
    rutes_crusr, rutes_upusr)
    VALUES (?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?,
    ?, ?)`;
    const params = [
      id,
      rutes_users,
      rutes_bsins,
      rutes_rname,
      rutes_dname,
      rutes_lvdat,
      rutes_ttcnt,
      rutes_odval,
      rutes_dlval,
      rutes_clval,
      rutes_duval,
      user_id,
      user_id,
    ];

    await dbRun(sql, params, `Create route for ${rutes_rname}`);
    res.json({
      success: true,
      message: "Route created successfully",
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
      rutes_users,
      rutes_bsins,
      rutes_rname,
      rutes_dname,
      rutes_lvdat,
      rutes_ttcnt,
      rutes_odval,
      rutes_dlval,
      rutes_clval,
      rutes_duval,
      user_id,
    } = req.body;

    // Validate input
    if (!id || !rutes_users || !rutes_bsins || !rutes_rname || !rutes_dname) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmcb_rutes
    SET rutes_rname = ?,
    rutes_dname = ?,
    rutes_upusr = ?,
    rutes_rvnmr = rutes_rvnmr + 1
    WHERE id = ?`;
    const params = [
      rutes_rname,
      rutes_dname,
      user_id,
      id,
    ];

    await dbRun(sql, params, `Update route for ${rutes_rname}`);
    res.json({
      success: true,
      message: "Route updated successfully",
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
    const { id, rutes_rname } = req.body;

    // Validate input
    if (!id) {
      return res.json({
        success: false,
        message: "Contact ID is required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmcb_rutes
    SET rutes_actve = 1 - rutes_actve
    WHERE id = ?`;
    const params = [id];

    await dbRun(sql, params, `Delete route for ${rutes_rname}`);
    res.json({
      success: true,
      message: "Route deleted successfully",
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

//suppliers
router.post("/suppliers", async (req, res) => {
  try {
    const { cntct_users } = req.body;

    // Validate input
    if (!cntct_users) {
      return res.json({
        success: false,
        message: "User ID is required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT cnt.*, 0 as edit_stop
    FROM tmcb_cntct cnt
    WHERE cnt.cntct_users = ?
    AND cnt.cntct_ctype IN ('Supplier','Both')
    ORDER BY cnt.cntct_cntnm`;
    const params = [cntct_users];

    const rows = await dbGetAll(
      sql,
      params,
      `Get suppliers for ${cntct_users}`,
    );
    res.json({
      success: true,
      message: "Suppliers fetched successfully",
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
