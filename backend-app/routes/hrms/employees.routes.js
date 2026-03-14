const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
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
      WHERE emply.emply_users = $1
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
    VALUES ($1, $2, $3, $4, $5,
    $6, $7, $8, $9, $10, $11,
    $12, $13, $14, $15, $16, $17,
    $18, $19, $20, $21, $22, $23,
    $24, $25, $26, $27, $28, $29,
    $30, $31, $32, $33, $34, $35, $36)`;
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
    SET emply_ecode=$1,
    emply_crdno=$2,
    emply_ename=$3,
    emply_econt=$4,
    emply_email=$5,
    emply_natid=$6,
    emply_bdate=$7,
    emply_prnam=$8,
    emply_gendr=$9,
    emply_mstas=$10,
    emply_bgrup=$11,
    emply_rlgon=$12,
    emply_edgrd=$13,
    emply_psadr=$14,
    emply_pradr=$15,
    emply_desig=$16,
    emply_jndat=$17,
    emply_cndat=$18,
    emply_rgdat=$19,
    emply_gssal=$20,
    emply_otrat=$21,
    emply_etype=$22,
    emply_pyacc=$23,
    emply_slcyl=$24,
    emply_wksft=$25,
    emply_supid=$26,
    emply_notes=$27,
    emply_login=$28,
    emply_pswrd=$29,
    emply_pictr=$30,
    emply_stats=$31,
    emply_upusr=$32,
    emply_updat = CURRENT_TIMESTAMP,
    emply_rvnmr= emply_rvnmr + 1
    WHERE id=$33`;
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
    WHERE id = $1`;
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
