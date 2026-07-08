const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const { createSession } = require("../../sessionManager");
const { GenNewCode, getDefaultCOAforPartyId } = require("../../db/genHelper");

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

// vmart/login
router.post("/vmart/login", async (req, res) => {
  try {
    const { users_id } = req.body;

    // Validate input
    if (!users_id) {
      return res.json({
        success: false,
        message: "Login Id is required.",
        data: {
          users: {},
          token: "",
        },
      });
    }

    //database action
    const sql_user = `SELECT cnt.cntct_ccode
FROM tmcb_cntct cnt
WHERE cnt.cntct_islgn = TRUE
AND cnt.cntct_actve = TRUE
AND cnt.cntct_cntno = $1
UNION ALL
SELECT emp.emply_ccode
FROM tmhb_emply emp
WHERE emp.emply_actve = TRUE
AND emp.emply_cntno = $1`;
    const params_user = [users_id];
    const row_user = await dbGet(sql_user, params_user, "Get login credential");
    if (!row_user) {
      return res.json({
        success: true, //not found but signup required
        message: "Login Id is not valid",
        data: {
          users: {},
          token: "",
        },
      });
    }
    //console.log("data", data);

    res.json({
      success: true,
      message: "User checked successfully",
      data: {
        users: row_user,
        token: "",
      },
    });
  } catch (error) {
    console.error("database action error:", error);
    return res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: {
        users: {},
        token: "",
      },
    });
  }
});

// vmart/login-with-password
router.post("/vmart/login-with-password", async (req, res) => {
  try {
    const { users_id, users_pswrd } = req.body;

    // Validate input
    if (!users_id || !users_pswrd) {
      return res.json({
        success: false,
        message: "Login Id and Password are required.",
        data: {
          users: {},
          token: "",
        },
      });
    }

    //database action
    const sql_user = `SELECT cnt.id, cnt.cntct_users AS users_id,cnt.cntct_bsins AS bsins_id, cnt.cntct_cname AS users_cname,
      cnt.cntct_cntps AS users_pname, cnt.cntct_email AS users_email, cnt.cntct_cntno AS users_cntno,
      cnt.cntct_ofadr AS users_addrs, 'CUSTOMER' users_crole, 'N' users_aplnk
      FROM tmcb_cntct cnt
      WHERE cnt.cntct_email = $1
      AND cnt.cntct_pswrd = $2
      AND cnt.cntct_islgn = TRUE
      AND cnt.cntct_actve = TRUE
      UNION ALL
      SELECT emp.id, emp.emply_users, emp.emply_bsins, emp.emply_cname,
      usr.users_cname, emp.emply_email, emp.emply_cntno,
	    '', 'SHOP', 'N' users_aplnk
      FROM tmhb_emply emp
      JOIN tmsb_users usr ON emp.emply_users = usr.id
      WHERE emp.emply_email  = $1
      AND emp.emply_pswrd = $2
      AND emp.emply_actve = TRUE`;
    const params_user = [users_id, users_pswrd];
    const row_user = await dbGet(sql_user, params_user, "Get login credential");
    if (!row_user) {
      return res.json({
        success: false,
        message: "Login Id or Password is not valid",
        data: {
          users: {},
          token: "",
        },
      });
    }
    //console.log("data", data);

    // inside login route, after validating user
    const session = createSession(row_user);

    // Generate JWT
    const token = jwt.sign(
      {
        id: row_user.id,
        email: row_user.users_cntno,
        role: row_user.users_crole,
        sessionId: session.sessionId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.json({
      success: true,
      message: "User logged in successfully",
      data: {
        users: row_user,
        token: token,
      },
    });
  } catch (error) {
    console.error("database action error:", error);
    return res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: {
        users: {},
        token: "",
      },
    });
  }
});

// vmart/register
router.post("/vmart/register", async (req, res) => {
  try {
    const { id, email, password, name, address, role, shopId } = req.body;

    // Validate input
    if (!id || !email || !password || !name || !address || !role || !shopId) {
      return res.json({
        success: false,
        message: "Login Id, Password, Name, Address and Shop are required.",
        data: {
          users: {},
          token: "",
        },
      });
    }

    //database action
    const sql_bsn = `SELECT *
        FROM tmsb_bsins bsn
        WHERE bsn.bsins_ccode = $1`;
    const params_bsn = [shopId];
    const row_bsn = await dbGet(sql_bsn, params_bsn, "Get shop informations");
    if (!row_bsn) {
      return res.json({
        success: false,
        message: "Shop is not valid, Scan QR code again",
        data: {},
      });
    }

    const bsnis_id = row_bsn.id;
    const users_id = row_bsn.bsins_users;
    const contactDefaultCOA = await getDefaultCOAforPartyId(
      users_id,
      bsnis_id,
      "SYS_PARTY_COA_CNF_CUSTOMER",
    );
    const masterId = uuidv4();
    const scripts = [];
    const newCode = await GenNewCode(users_id, "tmcb_cntct");
    const newCode_party = await GenNewCode(users_id, "tmtb_party");

    scripts.push({
      sql: `INSERT INTO tmcb_cntct(id, cntct_users, cntct_bsins, cntct_ctype, cntct_sorce, cntct_ccode,
        cntct_cname, cntct_cntps, cntct_cntno, cntct_email, cntct_tinno, cntct_trade,
        cntct_ofadr, cntct_fcadr, cntct_trtry, cntct_tarea, cntct_dzone, cntct_cntry,
        cntct_cntad, cntct_crncy, cntct_dspct, cntct_crlmt, cntct_crbal, cntct_pswrd,
        cntct_recky, cntct_islgn, cntct_crusr, cntct_upusr)
        VALUES ($1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12,
        $13, $14, $15, $16, $17, $18,
        $19, $20, $21, $22, $23, $24,
        $25, $26, $27, $28)`,
      params: [
        masterId,
        users_id,
        bsnis_id,
        "Customer",
        "Local",
        newCode,
        name,
        name,
        email,
        email,
        "",
        "",
        address,
        address,
        "",
        "",
        "",
        "Bangladesh",
        "",
        "BDT",
        0,
        0,
        0, //cntct_crbal
        password,
        password,
        true,
        masterId,
        masterId,
      ],
      label: `create contact- ${masterId}`,
    });

    scripts.push({
      sql: `INSERT INTO tmtb_party(id, party_users, party_bsins, party_ccode, party_ptype, party_chtac,
      party_vndor, party_cname, party_opbal, party_crusr, party_upusr)
      VALUES ($1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11)`,
      params: [
        uuidv4(),
        users_id,
        bsnis_id,
        newCode_party,
        "Customer",
        contactDefaultCOA,
        masterId,
        name,
        0,
        masterId,
        masterId,
      ],
      label: `create party accounts- ${users_id}`,
    });

    await dbRunAll(scripts);
    const row_user = {
      id: masterId,
      users_id: users_id,
      bsins_id: bsnis_id,
      users_cname: name,
      users_pname: name,
      users_email: email,
      users_cntno: email,
      users_addrs: address,
      users_crole: "CUSTOMER",
      users_aplnk: 'N'
    };
    //console.log("data", data);

    // inside login route, after validating user
    const session = createSession(row_user);

    // Generate JWT
    const token = jwt.sign(
      {
        id: row_user.id,
        email: row_user.users_cntno,
        role: row_user.users_crole,
        sessionId: session.sessionId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.json({
      success: true,
      message: "User logged in successfully",
      data: {
        users: row_user,
        token: token,
      },
    });
  } catch (error) {
    console.error("database action error:", error);
    return res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: {
        users: {},
        token: "",
      },
    });
  }
});

module.exports = router;
