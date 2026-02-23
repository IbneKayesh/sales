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
      FROM tmhb_emply emply
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
      emply_crdno,
      emply_ename,
      emply_econt,
      emply_email,
      emply_natid,
      emply_bdate,
      emply_prnam,
      emply_gendr,
      emply_mstas,
      emply_bgrup,
      emply_rlgon,
      emply_edgrd,
      emply_psadr,
      emply_pradr,
      emply_desig,
      emply_jndat,
      emply_cndat,
      emply_rgdat,
      emply_gssal,
      emply_otrat,
      emply_etype,
      emply_pyacc,
      emply_slcyl,
      emply_wksft,
      emply_supid,
      emply_notes,
      emply_login,
      emply_pswrd,
      emply_pictr,
      emply_stats,
      user_id,
    } = req.body;

    //console.log("req.body", req.body);

    // Validate input
    if (
      !id ||
      !emply_users ||
      !emply_bsins ||
      !emply_ename ||
      !emply_econt ||
      !emply_psadr ||
      !emply_desig ||
      !emply_jndat ||
      !emply_stats
    ) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `INSERT INTO tmhb_emply(id, emply_users, emply_bsins, emply_ecode, emply_crdno,
    emply_ename, emply_econt, emply_email, emply_natid, emply_bdate, emply_prnam,
    emply_gendr, emply_mstas, emply_bgrup, emply_rlgon, emply_edgrd, emply_psadr,
    emply_pradr, emply_desig, emply_jndat, emply_cndat, emply_rgdat, emply_gssal,
    emply_otrat, emply_etype, emply_pyacc, emply_slcyl, emply_wksft, emply_supid,
    emply_notes, emply_login, emply_pswrd, emply_pictr, emply_stats, emply_crusr, emply_upusr)
    VALUES (?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?, ?, ?)`;
    const params = [
      id,
      emply_users,
      emply_bsins,
      emply_ecode,
      emply_crdno,
      emply_ename,
      emply_econt,
      emply_email,
      emply_natid,
      emply_bdate,
      emply_prnam,
      emply_gendr,
      emply_mstas,
      emply_bgrup,
      emply_rlgon,
      emply_edgrd,
      emply_psadr,
      emply_pradr,
      emply_desig,
      emply_jndat,
      emply_cndat,
      emply_rgdat,
      emply_gssal,
      emply_otrat,
      emply_etype,
      emply_pyacc,
      emply_slcyl,
      emply_wksft,
      emply_supid,
      emply_notes,
      emply_login,
      emply_pswrd,
      emply_pictr,
      emply_stats,
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
      emply_crdno,
      emply_ename,
      emply_econt,
      emply_email,
      emply_natid,
      emply_bdate,
      emply_prnam,
      emply_gendr,
      emply_mstas,
      emply_bgrup,
      emply_rlgon,
      emply_edgrd,
      emply_psadr,
      emply_pradr,
      emply_desig,
      emply_jndat,
      emply_cndat,
      emply_rgdat,
      emply_gssal,
      emply_otrat,
      emply_etype,
      emply_pyacc,
      emply_slcyl,
      emply_wksft,
      emply_supid,
      emply_notes,
      emply_login,
      emply_pswrd,
      emply_pictr,
      emply_stats,
      user_id,
    } = req.body;

    // Validate input
    if (
      !id ||
      !emply_users ||
      !emply_bsins ||
      !emply_ename ||
      !emply_econt ||
      !emply_psadr ||
      !emply_desig ||
      !emply_jndat ||
      !emply_stats
    ) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmhb_emply
    SET emply_ecode=?,
    emply_crdno=?,
    emply_ename=?,
    emply_econt=?,
    emply_email=?,
    emply_natid=?,
    emply_bdate=?,
    emply_prnam=?,
    emply_gendr=?,
    emply_mstas=?,
    emply_bgrup=?,
    emply_rlgon=?,
    emply_edgrd=?,
    emply_psadr=?,
    emply_pradr=?,
    emply_desig=?,
    emply_jndat=?,
    emply_cndat=?,
    emply_rgdat=?,
    emply_gssal=?,
    emply_otrat=?,
    emply_etype=?,
    emply_pyacc=?,
    emply_slcyl=?,
    emply_wksft=?,
    emply_supid=?,
    emply_notes=?,
    emply_login=?,
    emply_pswrd=?,
    emply_pictr=?,
    emply_stats=?,
    emply_upusr=?,
    emply_rvnmr= emply_rvnmr + 1
    WHERE id=?`;
    const params = [
      emply_ecode,
      emply_crdno,
      emply_ename,
      emply_econt,
      emply_email,
      emply_natid,
      emply_bdate,
      emply_prnam,
      emply_gendr,
      emply_mstas,
      emply_bgrup,
      emply_rlgon,
      emply_edgrd,
      emply_psadr,
      emply_pradr,
      emply_desig,
      emply_jndat,
      emply_cndat,
      emply_rgdat,
      emply_gssal,
      emply_otrat,
      emply_etype,
      emply_pyacc,
      emply_slcyl,
      emply_wksft,
      emply_supid,
      emply_notes,
      emply_login,
      emply_pswrd,
      emply_pictr,
      emply_stats,
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
    const sql = `UPDATE tmhb_emply
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

//available-route-employees
router.post("/available-route-employees", async (req, res) => {
  try {
    const { emply_users, emply_bsins } = req.body;

    // Validate input
    if (!emply_users || !emply_bsins) {
      return res.json({
        success: false,
        message: "User ID and Business ID are required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT id, emply_users, emply_bsins, emply_ecode, emply_crdno, emply_ename, emply_econt, emply_email, emply_natid, emply_bdate, emply_prnam, emply_gendr, emply_mstas, emply_bgrup, emply_rlgon, emply_edgrd, emply_psadr, emply_pradr, emply_desig, 
    emply_pictr
    FROM tmhb_emply emp
    WHERE emp.emply_users = ?
    AND emp.emply_bsins = ?
    AND emp.emply_email IS NOT NULL
    AND emp.emply_email <> ''
    AND emp.emply_pswrd IS NOT NULL
    AND emp.emply_pswrd <> ''
    AND emp.emply_login = 1
    AND emp.emply_stats = 'Active'
    AND emp.emply_actve = 1
    ORDER BY emp.emply_ename
    `;
    const params = [emply_users, emply_bsins];

    const rows = await dbGetAll(
      sql,
      params,
      `Get available employees for ${emply_users}`,
    );
    res.json({
      success: true,
      message: "Available Employees fetched successfully",
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
