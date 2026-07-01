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
        data: {},
      });
    }

    //database action
    //validate user, users_apink,
    //emply_pswrd, emply_recky, emply_ltokn,
    const sql_emp = `SELECT id, emply_users, emply_bsins, emply_ccode, emply_cname, emply_cntct,
                    emply_email, emply_lstgn, emply_lstpd, emply_isprm, emply_urole, emply_crdno
                    FROM tmhb_emply emp
                    WHERE emp.emply_actve = TRUE
                    AND emp.emply_email = $1
                    AND emp.emply_pswrd = $2`;
    const params_emp = [users_email, users_pswrd];
    const row_emp = await dbGet(sql_emp, params_emp, "Get login credential");
    if (!row_emp) {
      return res.json({
        success: false,
        message: "Email or Password is not valid",
        data: {},
      });
    }

    const users_id = row_emp.emply_users;
    const bsins_id = row_emp.emply_bsins;
    const sql_bsn = `SELECT id, bsins_cntry, bsins_crncy, bsins_bstyp, bsins_ccode,
                    bsins_cname, bsins_addrs, bsins_email, bsins_cntct, bsins_image, bsins_binno,
                    bsins_stdat, bsins_notes, bsins_timzn
                    FROM tmsb_bsins bsn
                    WHERE bsn.bsins_actve = TRUE
                    AND bsn.bsins_users = $1
                    AND bsn.id = $2`;
    const params_bsn = [users_id, bsins_id];
    const row_bsn = await dbGet(sql_bsn, params_bsn, `Get login business`);
    if (!row_bsn) {
      return res.json({
        success: false,
        message: "Business is not defined",
        data: {},
      });
    }


    const sql_user = `SELECT id, users_email, users_cname, users_cntct, users_stats, users_regno,
                      users_regdt, users_expdt, users_notes, users_aplnk, users_agent, users_nofcr,
                      users_bsnno, users_usrno, users_pkgnm, users_cyldt, users_blval, users_pymdt
                      FROM tmsb_users usr
                      WHERE usr.users_actve = TRUE
                      AND usr.id = $1`;    
    const params_user = [users_id];
    const row_user = await dbGet(sql_user, params_user, `Get login user`);
    if (!row_user) {
      return res.json({
        success: false,
        message: "User is not defined",
        data: {},
      });
    }         


    const sql_menus = `SELECT mnu.id, menus_pname, menus_aname, menus_mname, menus_color, menus_micon,
    menus_odrby, menus_notes, menus_mlink, menus_menus, mnemp_extpr, mnemp_addpr,
    mnemp_edtpr, mnemp_delpr
  FROM tmsb_menus mnu
  JOIN tmsb_mnemp emp ON mnu.id = emp.mnemp_menus
  WHERE mnu.menus_actve = TRUE
  AND emp.mnemp_actve = TRUE
  AND emp.mnemp_emply = $1
  ORDER BY mnu.menus_odrby`;

    const row_menus = await dbGetAll(
      sql_menus,
      [row_emp.id],
      `Get login menus`,
    );
    if (!row_menus || row_menus.length === 0) {
      return res.json({
        success: false,
        message: "Menu is not defined",
        data: [],
      });
    }

    // inside login route, after validating user
    const session = createSession(row_user);

    // Generate JWT
    const token = jwt.sign(
      {
        id: row_emp.id,
        email: row_emp.emply_email,
        role: row_emp.emply_urole,
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
        emply: row_emp,
        bsins: row_bsn,
        users: row_user,
        menus: row_menus,
        token,
      },
    });
  } catch (error) {
    console.error("database action error:", error);
    return res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: {
        emply: {},
        users: {},
        bsins: {},
        menus: [],
        token: "",
      },
    });
  }
});

module.exports = router;
