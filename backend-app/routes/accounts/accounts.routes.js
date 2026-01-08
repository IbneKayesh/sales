const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManager");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
  try {
    const { bacts_users } = req.body;

    // Validate input
    if (!bacts_users) {
      return res.json({
        success: false,
        message: "User ID is required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT acts.*, 0 as edit_stop
      FROM tmtb_acnts acts
      WHERE acts.bacts_users = ?
      ORDER BY acts.bacts_bankn`;
    const params = [bacts_users];

    const rows = await dbGetAll(sql, params, `Get accounts for ${bacts_users}`);
    res.json({
      success: true,
      message: "Accounts fetched successfully",
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
      bacts_users,
      bacts_bankn,
      bacts_brnch,
      bacts_acnam,
      bacts_acnum,
      bacts_routn,
      bacts_notes,
      bacts_opdat,
      user_id,
    } = req.body;

    // Validate input
    if (!id || !bacts_users || !bacts_bankn) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `INSERT INTO tmtb_acnts
    (id,bacts_users,bacts_bankn,bacts_brnch,bacts_acnam,bacts_acnum,bacts_routn,
    bacts_notes,bacts_opdat,bacts_crusr,bacts_upusr)
    VALUES (?,?,?,?,?,?,?,
    ?,?,?,?)`;
    const params = [
      id,
      bacts_users,
      bacts_bankn,
      bacts_brnch,
      bacts_acnam,
      bacts_acnum,
      bacts_routn,
      bacts_notes,
      bacts_opdat,
      user_id,
      user_id,
    ];

    await dbRun(sql, params, `Create account for ${bacts_bankn}`);
    res.json({
      success: true,
      message: "Account created successfully",
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
      bacts_users,
      bacts_bankn,
      bacts_brnch,
      bacts_acnam,
      bacts_acnum,
      bacts_routn,
      bacts_notes,
      bacts_opdat,
      user_id,
    } = req.body;

    // Validate input
    if (!id || !bacts_users || !bacts_bankn) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmtb_acnts
    SET bacts_bankn = ?,
    bacts_brnch = ?,
    bacts_acnam = ?,
    bacts_acnum = ?,
    bacts_routn = ?,
    bacts_notes = ?,
    bacts_opdat = ?,
    bacts_upusr = ?,
    bacts_rvnmr = bacts_rvnmr + 1
    WHERE id = ?`;
    const params = [
      bacts_bankn,
      bacts_brnch,
      bacts_acnam,
      bacts_acnum,
      bacts_routn,
      bacts_notes,
      bacts_opdat,
      user_id,
      id,
    ];

    await dbRun(sql, params, `Update account for ${bacts_bankn}`);
    res.json({
      success: true,
      message: "Account updated successfully",
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
    const { id, bacts_bankn } = req.body;

    // Validate input
    if (!id) {
      return res.json({
        success: false,
        message: "Account ID is required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmtb_acnts
    SET bacts_actve = 1 - bacts_actve
    WHERE id = ?`;
    const params = [id];

    await dbRun(sql, params, `Delete account for ${bacts_bankn}`);
    res.json({
      success: true,
      message: "Account deleted successfully",
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
