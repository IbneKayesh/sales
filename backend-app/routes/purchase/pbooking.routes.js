const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManager");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
  try {
    const { pmstr_users, pmstr_bsins } = req.body;

    // Validate input
    if (!pmstr_users || !pmstr_bsins) {
      return res.json({
        success: false,
        message: "User ID and Business ID are required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT tbl.*, 0 as edit_stop
      FROM tmpb_pmstr tbl
      WHERE tbl.pmstr_users = ?
      AND tbl.pmstr_bsins = ?
      ORDER BY tbl.pmstr_trdat`;
    const params = [pmstr_users, pmstr_bsins];

    const rows = await dbGetAll(sql, params, `Get purchase bookings for ${pmstr_users}`);
    res.json({
      success: true,
      message: "Purchase bookings fetched successfully",
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
    const sql = `INSERT INTO tmab_users
    (id,users_email,users_pswrd,users_recky,users_oname,users_cntct,
    users_bsins,users_drole,users_users,users_stats,users_regno,
    users_wctxt,users_notes,users_nofcr,users_isrgs,users_crusr,users_upusr)
    VALUES (?,?,?,?,?,?,
    ?,?,?,0,'Standard',
    ?,?,0,0,?,?)`;
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
    const sql = `UPDATE tmab_users
    SET users_email = ?,
    users_pswrd = ?,
    users_recky = ?,
    users_oname = ?,
    users_cntct = ?,
    users_bsins = ?,
    users_drole = ?,
    users_wctxt = ?,
    users_notes = ?,
    users_upusr = ?,
    users_updat = current_timestamp(),
    users_rvnmr = users_rvnmr + 1
    WHERE id = ?`;
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
    const { id, users_oname} = req.body;

    // Validate input
    if (!id) {
      return res.json({
        success: false,
        message: "User ID is required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmab_users
    SET users_actve = 1 - users_actve
    WHERE id = ?`;
    const params = [id];

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

module.exports = router;
