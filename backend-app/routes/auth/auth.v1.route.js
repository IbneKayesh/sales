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
    //validate user
    const sql_user = `SELECT id, users_email, users_oname, users_cntct, users_bsins, users_drole,
    users_users, users_stats, users_regno, users_regdt, users_ltokn, users_lstgn,
    users_lstpd, users_wctxt, users_notes, users_nofcr, users_isrgs, users_cmpid,
    users_actve, users_crusr, users_crdat, users_upusr, users_updat
	FROM tmsb_users`;

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

module.exports = router;
