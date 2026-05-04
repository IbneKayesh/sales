const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");

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
    FROM tmnb_users usrs
    LEFT JOIN tmnb_users csr ON usrs.users_crusr = csr.id
    LEFT JOIN tmnb_users usr ON usrs.users_upusr = usr.id
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

const create = async (req, res) => {
  try {
    const {
      id,
      users_email,
      users_pswrd,
      users_recky,
      users_uname,
      users_cntct,
      users_regno,
      users_notes,
      users_apink,
      users_urole,
      users_bsins,
      //users_emply,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      //!id ||
      !users_email ||
      !users_pswrd ||
      !users_recky ||
      !users_uname ||
      !users_cntct ||
      !users_regno ||
      //!users_notes ||
      !users_apink ||
      !users_urole ||
      !users_bsins ||
      //!users_emply ||
      !user_s ||
      !user_c ||
      !user_b
    ) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: null,
      });
    }

    //database action
    const row_apusr = await GetMasterUserId(users_regno);
    if (!row_apusr) {
      return res.json({
        success: false,
        message: "Registration No is not valid",
        data: null,
      });
    }

    const users_apusr = row_apusr.id;

    const sql = `INSERT INTO tmnb_users(id, users_email, users_pswrd, users_recky, users_uname, users_cntct,
    users_regno, users_notes, users_apink, users_apusr, users_urole, users_bsins,
    users_emply, users_crusr, users_upusr)
      VALUES ($1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11, $12,
      $13, $14, $15)`;
    const params = [
      uuidv4(),
      users_email,
      users_pswrd,
      users_recky,
      users_uname,
      users_cntct,
      users_regno,
      users_notes,
      users_apink,
      users_apusr,
      users_urole,
      users_bsins,
      'users_emply',
      user_s,
      user_s,
    ];

    await dbRun(sql, params, `create user- ${user_c}`);
    res.json({
      success: true,
      message: `${users_uname} - Created successfully.`,
      data: null,
    });
  } catch (error) {
    console.error("database action error:", error);
    return res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: null,
    });
  }
};

const update = async (req, res) => {
  try {
    const {
      id,
      users_email,
      users_pswrd,
      users_recky,
      users_uname,
      users_cntct,
      users_regno,
      users_notes,
      users_apink,
      users_urole,
      users_bsins,
      //users_emply,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !id ||
      !users_email ||
      !users_pswrd ||
      !users_recky ||
      !users_uname ||
      !users_cntct ||
      !users_regno ||
      //!users_notes ||
      !users_apink ||
      !users_urole ||
      !users_bsins ||
      //!users_emply ||
      !user_s ||
      !user_c ||
      !user_b
    ) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: null,
      });
    }

    //database action
    // const sql_apusr = `SELECT id FROM tmnb_apusr WHERE apusr_ucode = $1`;
    // const params_apusr = [users_regno];
    // const row_apusr = await dbGet(sql_apusr, params_apusr, "Get master user");
    const row_apusr = await GetMasterUserId(users_regno);
    if (!row_apusr) {
      return res.json({
        success: false,
        message: "Registration No is not valid",
        data: null,
      });
    }

    const users_apusr = row_apusr.id;

    const sql = `UPDATE tmnb_users
    SET users_email = $1,
    users_pswrd = $2,
    users_recky = $3,
    users_uname = $4,
    users_cntct = $5,
    users_regno = $6,
    users_notes = $7,
    users_apink = $8,
    users_apusr = $9,
    users_urole = $10,
    users_bsins = $11,
    users_emply = $12,
    users_upusr = $13,
    users_updat = CURRENT_TIMESTAMP,
    users_rvnmr = users_rvnmr + 1
    WHERE id = $14`;
    const params = [
      users_email,
      users_pswrd,
      users_recky,
      users_uname,
      users_cntct,
      users_regno,
      users_notes,
      users_apink,
      users_apusr,
      users_urole,
      users_bsins,
      "users_emply",
      user_s,
      id,
    ];

    await dbRun(sql, params, `update user- ${user_c}`);
    res.json({
      success: true,
      message: `${users_uname} - Updated successfully.`,
      data: null,
    });
  } catch (error) {
    console.error("database action error:", error);
    return res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: null,
    });
  }
};

// upsert — dispatches to create or update based on presence of id
router.post("/upsert", async (req, res) => {
  const { id } = req.body;
  if (id) {
    return update(req, res);
  } else {
    return create(req, res);
  }
});

// create
router.post("/create", create);

// update
router.post("/update", update);

// delete
router.post("/delete", async (req, res) => {
  try {
    const { id, users_uname, users_actve, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!id || !users_uname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmnb_users
    SET users_actve = NOT users_actve,
    users_upusr = $1,
    users_updat = CURRENT_TIMESTAMP,
    users_rvnmr = users_rvnmr + 1
    WHERE id = $2`;
    const params = [user_s, id];

    await dbRun(sql, params, `delete user- ${user_c}`);
    res.json({
      success: true,
      message: `${users_uname} - ${users_actve ? "Deactivate" : "Activate"} successfully.`,
      data: null,
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
LEFT JOIN tmnb_mnusr usrs ON mnu.id = usrs.mnusr_menus
AND usrs.mnusr_users = $1
LEFT JOIN tmnb_users csr ON usrs.mnusr_crusr = csr.id
LEFT JOIN tmnb_users usr ON usrs.mnusr_upusr = usr.id
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

router.post("/menus/upsert", async (req, res) => {
  try {
    const {
      menus_id,
      mnusr_extpr,
      mnusr_addpr,
      mnusr_edtpr,
      mnusr_delpr,
      mnusr_actve,
      users_id,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (!users_id || !user_s || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: null,
      });
    }

    //database action
    const sql = `SELECT *
        FROM tmnb_mnusr mnu
        WHERE mnu.mnusr_users = $1
        AND mnu.mnusr_menus = $2`;

    const params = [users_id, menus_id];
    const row = await dbGet(sql, params, `get menus- ${users_id}`);

    if (!row) {
      //
      // INSERT
      //

      const sql_insert = `INSERT INTO tmnb_mnusr(
	id, mnusr_users, mnusr_menus, mnusr_extpr, mnusr_addpr, mnusr_edtpr, mnusr_delpr, mnusr_crusr, mnusr_upusr)
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);`;
      const params_insert = [
        uuidv4(),
        users_id,
        menus_id,
        mnusr_extpr || false,
        mnusr_addpr || false,
        mnusr_edtpr || false,
        mnusr_delpr || false,
        user_s,
        user_s,
      ];
      const row_insert = await dbRun(
        sql_insert,
        params_insert,
        `add menus- ${users_id}`,
      );
      res.json({
        success: true,
        message: `Menus Created successfully.`,
        data: row_insert,
      });
    } else {
      //
      // UPDATE
      //

      const sql_update = `UPDATE tmnb_mnusr
	SET mnusr_extpr = $1,
    mnusr_addpr = $2,
    mnusr_edtpr = $3,
    mnusr_delpr = $4,
    mnusr_actve = $5,
    mnusr_upusr = $6,
    mnusr_updat = CURRENT_TIMESTAMP,
    mnusr_rvnmr = mnusr_rvnmr + 1
	WHERE mnusr_users = $7
  AND mnusr_menus = $8`;
      const params_update = [
        mnusr_extpr || false,
        mnusr_addpr || false,
        mnusr_edtpr || false,
        mnusr_delpr || false,
        mnusr_actve || false,
        user_s,
        users_id,
        menus_id,
      ];
      const row_update = await dbRun(
        sql_update,
        params_update,
        `update menus- ${users_id}`,
      );
      res.json({
        success: true,
        message: `Menus Updated successfully.`,
        data: row_update,
      });
    }
  } catch (error) {
    console.error("database action error:", error);
    return res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: null,
    });
  }
});

const GetMasterUserId = async (users_regno) => {
  const sql = `SELECT id FROM tmnb_apusr WHERE apusr_ucode = $1 LIMIT 1`;
  const result = await dbGet(sql, [users_regno]);
  //if (!result) throw new Error("Registration No is not found");
  return result;
};

module.exports = router;
