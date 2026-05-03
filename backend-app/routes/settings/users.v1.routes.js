const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");

// get
router.post("/", async (req, res) => {
  try {
    const { user_s, user_c, user_b } = req.body;

    // Validate input
    if (!user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: null,
      });
    }

    //database action
    const sql = `SELECT usrs.id, usrs.users_email, usrs.users_uname, usrs.users_cntct, usrs.users_stats,
    usrs.users_regno, usrs.users_regdt, usrs.users_ltokn, usrs.users_lstgn, usrs.users_lstpd,
    usrs.users_notes, usrs.users_nofcr, usrs.users_isprm, usrs.users_apink, usrs.users_apusr,
    usrs.users_urole, usrs.users_bsins, usrs.users_emply, usrs.users_actve, usrs.users_crusr,
    usrs.users_crdat, usrs.users_upusr, usrs.users_updat, usrs.users_rvnmr,
    csr.users_uname AS crusr_cname, usr.users_uname AS upusr_cname, 0 as edit_stop
    FROM tmcb_users usrs
    LEFT JOIN tmcb_users csr ON usrs.users_crusr = csr.id
    LEFT JOIN tmcb_users usr ON usrs.users_upusr = usr.id
    WHERE usrs.users_apusr = $1`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get users- ${user_c}`);
    res.json({
      success: true,
      message: "Query executed successfully.",
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

router.post("/menus", async (req, res) => {
  try {
    const { users_id, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!users_id || !user_s || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: null,
      });
    }

    //database action
    const sql = `select mnu.id AS menus_id, mnu.menus_mname, mnu.menus_color, mnu.menus_micon,
mnu.menus_odrby, mnu.menus_notes, mnu.menus_mlink, mnu.menus_menus,
usrs.*,
csr.users_uname AS crusr_cname, usr.users_uname AS upusr_cname, 0 as edit_stop
from tmab_menus mnu
LEFT JOIN tmcb_mnusr usrs ON mnu.id = usrs.mnusr_menus
AND usrs.mnusr_users = $1
LEFT JOIN tmcb_users csr ON usrs.mnusr_crusr = csr.id
LEFT JOIN tmcb_users usr ON usrs.mnusr_upusr = usr.id
WHERE mnu.menus_actve = TRUE
ORDER BY mnu.menus_odrby, mnu.id`;

    const params = [users_id];
    const rows = await dbGetAll(sql, params, `get menus- ${users_id}`);
    res.json({
      success: true,
      message: "Query executed successfully.",
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
