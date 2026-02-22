const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../../db/sqlManager");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const { createSession } = require("../../../sessionManager");


// login
router.post("/login", async (req, res) => {
  try {
    const { users_email, users_pswrd } = req.body;

    // Validate input
    if (!users_email || !users_pswrd) {
      return res.json({
        success: false,
        message: "Email and password are required",
        data: null,
      });
    }

    //database action
    const sql1 = `SELECT usr.id,usr.users_email,usr.users_oname,usr.users_cntct,usr.users_bsins,
    usr.users_drole,usr.users_users,usr.users_stats,usr.users_regno,
    usr.users_wctxt,usr.users_notes,usr.users_nofcr,usr.users_isrgs,
    bsn.bsins_bname, bsn.bsins_addrs, bsn.bsins_email, bsn.bsins_cntct, bsn.bsins_image, bsn.bsins_binno, bsn.bsins_btags, bsn.bsins_cntry, 
    bsn.bsins_bstyp, bsn.bsins_tstrn, bsn.bsins_prtrn, bsn.bsins_sltrn, bsn.bsins_stdat, bsn.bsins_pbviw, 'web' as users_sview
    FROM tmsb_users usr
    LEFT JOIN tmsb_bsins bsn ON usr.users_bsins = bsn.id
    WHERE usr.users_email = ?
    AND usr.users_pswrd = ?
    AND usr.users_actve = 1`;

    const sql = `SELECT emp.id, emp.emply_users, emp.emply_bsins, emp.emply_ecode, emp.emply_crdno, emp.emply_ename, emp.emply_econt, emp.emply_email
    FROM tmhb_emply emp
    WHERE emp.emply_actve = 1
    AND emp.emply_stats = 'Active'
    AND emp.emply_email = ?
    AND emp.emply_pswrd = ?
    AND emp.emply_login = 1`;

    const params = [users_email, users_pswrd];

    const row = await dbGet(
      sql,
      params,
      `Get user login credential for ${users_email}`,
    );
    if (!row) {
      return res.json({
        success: false,
        message: "Email or Password is not valid",
        data: null,
      });
    }

    // inside login route, after validating user
    const session = createSession(row);

    // Generate JWT
    const token = jwt.sign(
      {
        id: row.id,
        email: row.users_email,
        role: row.users_drole,
        sessionId: session.sessionId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.json({
      success: true,
      message: "User logged in successfully",
      data: row,
      token: token,
    });
  } catch (error) {
    console.error("database action error:", error);
    return res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: null,
      token: null,
    });
  }
});

// Logout endpoint (for consistency, though not much needed with stateless auth)
router.post("/logout", (req, res) => {
  return res.json({
    success: true,
    message: "User logged out successfully",
    data: null,
  });
});

// recover-password
router.post("/recover-password", async (req, res) => {
  try {
    const { users_email, users_recky } = req.body;

    // Validate input
    if (!users_email || !users_recky) {
      return res.json({
        success: false,
        message: "Email and recovery key are required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT * FROM tmsb_users
    WHERE users_email = ?
    AND users_recky = ?
    AND  users_actve = 1`;
    const params = [users_email, users_recky];

    const row = await dbGet(
      sql,
      params,
      `Get user password recovery for ${users_email}`,
    );
    if (!row) {
      return res.json({
        success: false,
        message: "Email or Recovery key is not valid",
        data: null,
      });
    }
    res.json({
      success: true,
      message: "User recovery key is valid",
      data: row,
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

// reset-password
router.post("/reset-password", async (req, res) => {
  try {
    const { id, users_email, users_pswrd, users_recky } = req.body;

    // Validate input
    if (!id || !users_email || !users_pswrd || !users_recky) {
      return res.json({
        success: false,
        message: "Id, Email, Password, Key are required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmsb_users 
    SET users_recky = ?,
    users_pswrd = ?,
    users_lstpd = current_timestamp(),
    users_upusr = ?,
    users_rvnmr = users_rvnmr + 1
    WHERE id = ?
    AND users_email = ?`;
    const params = [users_recky, users_pswrd, id, id, users_email];

    await dbRun(sql, params, `Recover user password for ${users_email}`);

    res.json({
      success: true,
      message: "User password is updated successfully",
      data: req.body,
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


// permissions/modules
router.post("/permissions/modules", async (req, res) => {
  try {
    const { id } = req.body;

    // Validate input
    if (!id) {
      return res.json({
        success: false,
        message: "Id is required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT *
    FROM tmsb_mdule
    WHERE mdule_actve = 1
    AND mdule_pname = 'basic'
    ORDER BY mdule_odrby`;
    const params = [];

    const rows = await dbGetAll(sql, params, `Get modules for ${id}`);

    res.json({
      success: true,
      message: "Modules is fetched successfully",
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


// permissions/menus
router.post("/permissions/menus", async (req, res) => {
  try {
    const { id, menus_mdule } = req.body;

    // Validate input
    if (!id || !menus_mdule) {
      return res.json({
        success: false,
        message: "Id is required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT *
    FROM tmsb_menus
    WHERE menus_actve = 1
    AND menus_mdule = ?
    ORDER BY menus_odrby`;
    const params = [menus_mdule];

    const rows = await dbGetAll(sql, params, `Get menus for ${menus_mdule}`);

    res.json({
      success: true,
      message: "Menus is fetched successfully",
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
