const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
  try {
    const { users_users } = req.body;

    // Validate input
    if (!users_users) {
      return res.json({
        success: false,
        message: "User ID is required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT usr.*, 0 as edit_stop, bs.bsins_bname
      FROM tmsb_users usr
      LEFT JOIN tmsb_bsins bs ON usr.users_bsins = bs.id
      WHERE usr.users_users = $1
      ORDER BY usr.users_oname`;
    const params = [users_users];

    const rows = await dbGetAll(sql, params, `Get users for ${users_users}`);
    res.json({
      success: true,
      message: "Users fetched successfully",
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

// create
router.post("/create", async (req, res) => {
  try {
    const {
      id,
      users_email,
      users_pswrd,
      users_recky,
      users_oname,
      users_cntct,
      users_bsins,
      users_drole,
      users_users,
      users_wctxt,
      users_notes,
      user_id,
    } = req.body;

    // Validate input
    if (
      !id ||
      !users_email ||
      !users_pswrd ||
      !users_recky ||
      !users_oname ||
      !users_cntct ||
      !users_bsins ||
      !users_drole ||
      !users_users
    ) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `INSERT INTO tmsb_users
    (id,users_email,users_pswrd,users_recky,users_oname,users_cntct,
    users_bsins,users_drole,users_users,users_stats,users_regno,
    users_wctxt,users_notes,users_nofcr,users_isrgs,users_crusr,users_upusr)
    VALUES ($1,$2,$3,$4,$5,$6,
    $7,$8,$9,0,'Standard',
    $10,$11,0,FALSE,$12,$13)`;
    const params = [
      id,
      users_email,
      users_pswrd,
      users_recky,
      users_oname,
      users_cntct,
      users_bsins,
      users_drole,
      users_users,
      users_wctxt,
      users_notes,
      user_id,
      user_id,
    ];

    await dbRun(sql, params, `Create user for ${users_oname}`);
    res.json({
      success: true,
      message: "User created successfully",
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

// update
router.post("/update", async (req, res) => {
  try {
    const {
      id,
      users_email,
      users_pswrd,
      users_recky,
      users_oname,
      users_cntct,
      users_bsins,
      users_drole,
      users_users,
      users_wctxt,
      users_notes,
      user_id
    } = req.body;

    // Validate input
    if (
      !id ||
      !users_email ||
      !users_pswrd ||
      !users_recky ||
      !users_oname ||
      !users_cntct ||
      !users_bsins ||
      !users_drole ||
      !users_users
    ) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmsb_users
    SET users_email = $1,
    users_pswrd = $2,
    users_recky = $3,
    users_oname = $4,
    users_cntct = $5,
    users_bsins = $6,
    users_drole = $7,
    users_wctxt = $8,
    users_notes = $9,
    users_upusr = $10,
    users_updat = CURRENT_TIMESTAMP,
    users_rvnmr = users_rvnmr + 1
    WHERE id = $11`;
    const params = [
      users_email,
      users_pswrd,
      users_recky,
      users_oname,
      users_cntct,
      users_bsins,
      users_drole,
      users_wctxt,
      users_notes,
      user_id,
      id,
    ];

    await dbRun(sql, params, `Update user for ${users_oname}`);
    res.json({
      success: true,
      message: "User updated successfully",
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

// delete
router.post("/delete", async (req, res) => {
  try {
    const { id, users_oname, suser_id} = req.body;

    // Validate input
    if (!id) {
      return res.json({
        success: false,
        message: "User ID is required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmsb_users
    SET users_actve = NOT users_actve,
    users_upusr = $1,
    users_updat = CURRENT_TIMESTAMP,
    users_rvnmr = users_rvnmr + 1
    WHERE id = $2`;
    const params = [suser_id, id];

    await dbRun(sql, params, `Delete user for ${users_oname}`);
    res.json({
      success: true,
      message: "User deleted successfully",
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
    FROM tmsb_users usr
    WHERE usr.users_email = ?
    AND usr.users_pswrd = ?
    AND usr.id = ?
    AND usr.users_actve = 1`;
    const params = [users_email, pswrd_current, id];

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

    const sql_Updt = `UPDATE tmsb_users 
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
      `Change user password for ${users_email}`,
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