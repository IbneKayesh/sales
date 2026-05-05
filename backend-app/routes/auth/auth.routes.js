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
    WHERE users_email = $1
    AND users_recky = $2
    AND users_actve = TRUE`;
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
    const sql_rec = `SELECT *
    FROM tmsb_users
    WHERE users_recky = $1    
    AND id = $2
    AND users_email = $3
    AND users_actve = TRUE`;
    const params_rec = [users_recky, id, users_email];
    const rec = await dbGet(sql_rec, params_rec);
    //console.log("rec", rec);
    if (rec) {
      return res.json({
        success: false,
        message: "Enter a new recovery key",
        data: null,
      });
    }

    const sql = `UPDATE tmsb_users 
    SET users_recky = $1,
    users_pswrd = $2,
    users_lstpd = current_timestamp,
    users_upusr = $3,
    users_rvnmr = users_rvnmr + 1
    WHERE id = $4
    AND users_email = $5    
    AND users_actve = TRUE`;
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
    WHERE mdule_actve = TRUE
    AND mdule_pname = 'basic'
    AND mdule_mview = 'web'
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
    WHERE menus_actve = TRUE
    AND menus_mdule = $1
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
