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
    const sql_user = `SELECT usr.id, usr.users_email, usr.users_uname, usr.users_cntct, usr.users_ltokn, usr.users_lstgn,
    usr.users_lstpd, usr.users_notes, usr.users_nofcr, usr.users_isprm, usr.users_apink,
    usr.users_apusr, usr.users_urole, usr.users_bsins, usr.users_emply, 'Admin' AS urole_rname
    FROM tmcb_users usr
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
    FROM tmcb_bsins bsn
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

    const sql_menus = `SELECT id, menus_pname, menus_aname, menus_mname, menus_color, menus_micon, menus_odrby, menus_notes, menus_mlink, menus_menus
  FROM tmab_menus mnu
  WHERE mnu.menus_actve = TRUE
  ORDER BY mnu.menus_odrby`;
    const row_menus = await dbGetAll(sql_menus, [], `Get user login menus`);
    if (!row_menus) {
      return res.json({
        success: false,
        message: "Menus not defined",
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
        menus: row_menus,
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

module.exports = router;
