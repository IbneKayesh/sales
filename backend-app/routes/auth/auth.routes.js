const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManager");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

// registration, with auto login
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

    const sql_valid_email = `SELECT * FROM tmab_users WHERE users_email = ?`;
    const params_valid_email = [users_email];
    const row_valid_email = await dbGet(
      sql_valid_email,
      params_valid_email,
      `Get user email for ${users_email}`
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
    const noOfGrains = process.env.TRUST_GRAINS || 100;

    scripts.push({
      sql: `INSERT INTO tmab_users (id, users_email, users_pswrd, users_recky, users_oname, users_bsins,
      users_drole, users_users, users_stats, users_regno, users_nofcr, users_crusr, users_upusr) 
    VALUES (?, ?, ?, ?, ?, ?,
    'Admin', ?, 0, 'Standard', ?, ?, ?)`,
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
      sql: `INSERT INTO tmab_bsins (id, bsins_users, bsins_bname, bsins_email, bsins_crusr, bsins_upusr) 
    VALUES (?, ?, ?, ?, ?, ?)`,
      params: [users_bsins_id, id, bsins_bname, users_email, id, id],
      label: `Created business ${bsins_bname}`,
    });

    scripts.push({
      sql: `INSERT INTO tmsb_crgrn (id, crgrn_users, crgrn_bsins, crgrn_tblnm, crgrn_tbltx, crgrn_refno, crgrn_dbgrn, crgrn_crgrn,
       crgrn_crusr, crgrn_upusr) 
    VALUES (?, ?, ?, 'tmsb_crgrn', 'Registration', ?, 0, ?,
      ?, ?)`,
      params: [id, id, users_bsins_id, bsins_bname, noOfGrains, id, id],
      label: `Credited grain for ${users_oname}`,
    });

    await dbRunAll(scripts);
    // res.json({
    //   success: true,
    //   message: "User registered successfully",
    //   data: req.body,
    // });

    //login when register
    const sql = `SELECT usr.id,usr.users_email,usr.users_oname,usr.users_cntct,usr.users_bsins,
    usr.users_drole,usr.users_users,usr.users_stats,usr.users_regno,
    usr.users_wctxt,usr.users_notes,usr.users_nofcr,usr.users_isrgs,bsn.bsins_bname
    FROM tmab_users usr
    LEFT JOIN tmab_bsins bsn ON usr.users_bsins = bsn.id
        WHERE usr.users_email = ?
        AND usr.users_pswrd = ?
        AND usr.users_actve = 1`;
    const params = [users_email, users_pswrd];

    const row = await dbGet(
      sql,
      params,
      `Get user login credential for ${users_email}`
    );

    res.json({
      success: true,
      message: "User registered successfully",
      data: row || req.body,
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
    usr.users_wctxt,usr.users_notes,usr.users_nofcr,usr.users_isrgs,bsn.bsins_bname
FROM tmab_users usr
LEFT JOIN tmab_bsins bsn ON usr.users_bsins = bsn.id
    WHERE usr.users_email = ?
    AND usr.users_pswrd = ?
    AND usr.users_actve = 1`;
    const params = [users_email, users_pswrd];

    const row = await dbGet(
      sql,
      params,
      `Get user login credential for ${users_email}`
    );
    if (!row) {
      return res.json({
        success: false,
        message: "Email or Password is not valid",
        data: null,
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: row.id, email: row.users_email, role: row.users_drole },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
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
    const sql = `SELECT * FROM tmab_users
    WHERE users_email = ?
    AND users_recky = ?
    AND  users_actve = 1`;
    const params = [users_email, users_recky];

    const row = await dbGet(
      sql,
      params,
      `Get user password recovery for ${users_email}`
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

// set-password
router.post("/set-password", async (req, res) => {
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
    const sql = `UPDATE tmab_users 
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

// change-password
router.post("/change-password", async (req, res) => {
  try {
    const { id, users_email, pswrd_current, pswrd_new } = req.body;

    // Validate input
    if (!id || !users_email || !pswrd_current || !pswrd_new) {
      return res.json({
        success: false,
        message: "Id, Email, Password Current, Password New are required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT usr.*
    FROM tmab_users usr
    WHERE usr.users_email = ?
    AND usr.users_pswrd = ?
    AND usr.id = ?
    AND usr.users_actve = 1`;
    const params = [users_email, pswrd_current, id];

    const row = await dbGet(
      sql,
      params,
      `Get user login credential for ${users_email}`
    );
    if (!row) {
      return res.json({
        success: false,
        message: "Email or Password is not valid",
        data: null,
      });
    }

    const sql_Updt = `UPDATE tmab_users 
    SET users_pswrd = ?,
    users_lstpd = current_timestamp(),
    users_upusr = ?,
    users_rvnmr = users_rvnmr + 1
    WHERE id = ?
    AND users_email = ?`;
    const params_Updt = [pswrd_new, id, id, users_email];

    await dbRun(
      sql_Updt,
      params_Updt,
      `Change user password for ${users_email}`
    );

    res.json({
      success: true,
      message: "User password is changed successfully",
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

module.exports = router;
