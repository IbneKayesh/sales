const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const { createSession } = require("../../sessionManager");

// registration
router.post("/register", async (req, res) => {
  try {
    const {
      id,
      users_email,
      users_pswrd,
      users_recky,
      users_oname,
      bsins_bname,
    } = req.body;

    // Validate input
    if (
      !users_email ||
      !users_pswrd ||
      !users_recky ||
      !users_oname ||
      !bsins_bname
    ) {
      return res.json({
        success: false,
        message: "Email, Password, Key, Name and Business Name are required",
        data: null,
      });
    }

    const sql_valid_email = `SELECT * FROM tmsb_users WHERE users_email = $1`;
    const params_valid_email = [users_email];
    const row_valid_email = await dbGet(
      sql_valid_email,
      params_valid_email,
      `Get user email for ${users_email}`,
    );
    if (row_valid_email) {
      return res.json({
        success: false,
        message: "Email is already registered, try different email",
        data: null,
      });
    }

    const users_bsins_id = uuidv4();

    //database action
    const scripts = [];
    const noOfGrains = process.env.TRUST_GRAINS || 0;

    scripts.push({
      sql: `INSERT INTO tmsb_users (id, users_email, users_pswrd, users_recky, users_oname, users_bsins,
      users_drole, users_users, users_stats, users_regno, users_nofcr, users_crusr, users_upusr) 
    VALUES ($1, $2, $3, $4, $5, $6,
    'Admin', $7, 0, 'Standard', $8, $9, $10)`,
      params: [
        id,
        users_email,
        users_pswrd,
        users_recky,
        users_oname,
        users_bsins_id,
        id,
        noOfGrains,
        id,
        id,
      ],
      label: `Created user ${users_oname}`,
    });

    scripts.push({
      sql: `INSERT INTO tmsb_bsins (id, bsins_users, bsins_bname, bsins_email, bsins_crusr, bsins_upusr) 
    VALUES ($1, $2, $3, $4, $5, $6)`,
      params: [users_bsins_id, id, bsins_bname, users_email, id, id],
      label: `Created business ${bsins_bname}`,
    });

    scripts.push({
      sql: `INSERT INTO tmsb_crgrn (id, crgrn_users, crgrn_bsins, crgrn_tblnm, crgrn_tbltx, crgrn_refno, crgrn_dbgrn, crgrn_crgrn,
       crgrn_crusr, crgrn_upusr) 
    VALUES ($1, $2, $3, 'tmsb_crgrn', 'Registration', $4, 0, $5,
      $6, $7)`,
      params: [id, id, users_bsins_id, bsins_bname, noOfGrains, id, id],
      label: `Credited grain for ${users_oname}`,
    });

    await dbRunAll(scripts);
    res.json({
      success: true,
      message: "User registered successfully",
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
    const sql = `SELECT usr.id,usr.users_email,usr.users_oname,usr.users_cntct,usr.users_bsins,
    usr.users_drole,usr.users_users,usr.users_stats,usr.users_regno,
    usr.users_wctxt,usr.users_notes,usr.users_nofcr,usr.users_isrgs,
    bsn.bsins_bname, bsn.bsins_addrs, bsn.bsins_email, bsn.bsins_cntct, bsn.bsins_image, bsn.bsins_binno, bsn.bsins_btags, bsn.bsins_cntry, 
    bsn.bsins_bstyp, bsn.bsins_tstrn, bsn.bsins_prtrn, bsn.bsins_sltrn, bsn.bsins_stdat, bsn.bsins_pbviw
    FROM tmsb_users usr
    LEFT JOIN tmsb_bsins bsn ON usr.users_bsins = bsn.id
    WHERE usr.users_email = $1
    AND usr.users_pswrd = $2
    AND usr.users_actve = TRUE`;
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
