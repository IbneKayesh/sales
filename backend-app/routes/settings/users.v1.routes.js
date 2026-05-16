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
        data: [],
      });
    }

    //database action
    const sql = `SELECT usrs.id, usrs.users_email, usrs.users_uname, usrs.users_cntct, usrs.users_stats,
    usrs.users_regno, usrs.users_regdt, usrs.users_ltokn, usrs.users_lstgn, usrs.users_lstpd,
    usrs.users_notes, usrs.users_nofcr, usrs.users_isprm, usrs.users_apink, usrs.users_apusr,
    usrs.users_urole, usrs.users_bsins, usrs.users_emply, usrs.users_actve, usrs.users_crusr,
    usrs.users_crdat, usrs.users_upusr, usrs.users_updat, usrs.users_rvnmr,
    bns.bsins_bname, csr.users_uname AS crusr_cname, usr.users_uname AS upusr_cname, 0 as edit_stop
    FROM tmnb_users usrs
    LEFT JOIN tmnb_bsins bns ON usrs.users_bsins = bns.id
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
      data: [],
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
        data: {},
      });
    }

    //database action
    const row_apusr = await GetMasterUserId(users_regno);
    if (!row_apusr) {
      return res.json({
        success: false,
        message: "Registration No is not valid",
        data: {},
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
      "users_emply",
      user_s,
      user_s,
    ];

    await dbRun(sql, params, `create user- ${user_c}`);
    res.json({
      success: true,
      message: `${users_uname} - Created successfully.`,
      data: {},
    });
  } catch (error) {
    console.error("database action error:", error);
    return res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: {},
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
        data: {},
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
        data: {},
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
      data: {},
    });
  } catch (error) {
    console.error("database action error:", error);
    return res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: {},
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
        data: {},
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
      data: {},
    });
  } catch (error) {
    console.error("database action error:", error);
    return res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: {},
    });
  }
});

const GetMasterUserId = async (users_regno) => {
  const sql = `SELECT id FROM tmnb_apusr WHERE apusr_ucode = $1 LIMIT 1`;
  const result = await dbGet(sql, [users_regno]);
  //if (!result) throw new Error("Registration No is not found");
  return result;
};

// change-password
router.post("/change-password", async (req, res) => {
  try {
    const {
      id,
      users_email,
      users_pswrd,
      users_pswrd_new,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (!id || !users_email || !users_pswrd || !users_pswrd_new || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql_user = `SELECT usr.*
    FROM tmnb_users usr
    WHERE usr.users_email = $1
    AND usr.users_pswrd = $2
    AND usr.id = $3
    AND usr.users_actve = TRUE`;
    const params_user = [users_email, users_pswrd, id];

    const row_user = await dbGet(
      sql_user,
      params_user,
      `Get login credential- ${users_email}`,
    );
    if (!row_user) {
      return res.json({
        success: false,
        message: "Current Email or Password is not valid",
        data: {},
      });
    }

    const sql = `UPDATE tmnb_users 
    SET users_pswrd = $1,
    users_lstpd = CURRENT_TIMESTAMP,
    users_upusr = $2,
    users_updat = CURRENT_TIMESTAMP,
    users_rvnmr = users_rvnmr + 1
    WHERE id = $3
    AND users_email = $4`;
    const params = [users_pswrd_new, user_s, id, users_email];

    await dbRun(sql, params, `Change user password for ${users_email}`);
    res.json({
      success: true,
      message: "Password changed successfully",
      data: {},
    });
  } catch (error) {
    console.error("database action error:", error);
    return res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: {},
    });
  }
});

module.exports = router;
