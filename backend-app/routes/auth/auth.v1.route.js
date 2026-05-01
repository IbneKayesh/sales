const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const { createSession } = require("../../sessionManager");

// login
router.post("/login", async (req, res) => {
  try {
    const { users_email, users_pswrd } = req.body;

    // Validate input
    if (!users_email || !users_pswrd) {
      return res.json({
        success: false,
        message: "Email and password are required.",
        data: null,
      });
    }

    //database action
    //validate user, users_apink,
    const sql_user = `SELECT id, users_email, users_oname, users_cntct, users_bsins, users_drole,
    users_users, users_stats, users_regno, users_regdt, users_ltokn, users_lstgn,
    users_lstpd, users_wctxt, users_notes, users_nofcr, users_isrgs,
    users_actve, users_crusr, users_crdat, users_upusr, users_updat
    FROM tmsb_users usr
    WHERE usr.users_actve = TRUE
    AND usr.users_email = $1
    AND usr.users_pswrd = $2`;
    const params_user = [users_email, users_pswrd];
    const row_user = await dbGet(
      sql_user,
      params_user,
      "Get User Login Credential",
    );
    if (!row_user) {
      return res.json({
        success: false,
        message: "Email or Password is not valid",
        data: null,
      });
    }

    const bsins_id = row_user.users_bsins;
    const sql_bsn = `SELECT bsn.*
    FROM tmsb_bsins bsn
    WHERE bsn.bsins_actve = TRUE
    AND bsn.id = $1`;
    const params_bsn = [bsins_id];
    const row_bsn = await dbGet(sql_bsn, params_bsn, `Get user login business`);
    if (!row_bsn) {
      return res.json({
        success: false,
        message: "User or Business is not valid",
        data: null,
      });
    }

    // inside login route, after validating user
    const session = createSession(row_user);

    // Generate JWT
    const token = jwt.sign(
      {
        id: row_user.id,
        email: row_user.users_email,
        role: row_user.users_drole,
        sessionId: session.sessionId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    //console.log("data", data);

    res.json({
      success: true,
      message: "User logged in successfully",
      data: {
        users: row_user,
        bsins: row_bsn,
        token,
      },
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

//modules
router.post("/modules", async (req, res) => {
  try {
    //console.log("req.body", req.body);
    const { user_s } = req.body;

    // Validate input
    if (!user_s) {
      return res.json({
        success: false,
        message: "User Id is required",
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

    const rows = await dbGetAll(sql, params, `Get modules for ${user_s}`);
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


//menus
router.post("/menus", async (req, res) => {
  try {
    const { user_s, menus_mdule } = req.body;

    // Validate input
    if (!user_s || !menus_mdule) {
      return res.json({
        success: false,
        message: "Module Id is required",
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
