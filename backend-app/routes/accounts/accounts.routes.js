const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
  try {
    const { bacts_users,bacts_bsins } = req.body;

    // Validate input
    if (!bacts_users || !bacts_bsins) {
      return res.json({
        success: false,
        message: "User ID is required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT acts.*, 0 as edit_stop
      FROM tmtb_bacts acts
      WHERE acts.bacts_users = $1
      AND acts.bacts_bsins = $2
      ORDER BY acts.bacts_bankn`;
    const params = [bacts_users, bacts_bsins];

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
      bacts_bsins,
      bacts_bankn,
      bacts_brnch,
      bacts_acnam,
      bacts_acnum,
      bacts_routn,
      bacts_notes,
      bacts_opdat,
      suser_id,
    } = req.body;

    // Validate input
    if (!id || !bacts_users || !bacts_bsins || !bacts_bankn) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `INSERT INTO tmtb_bacts
    (id,bacts_users,bacts_bsins,bacts_bankn,bacts_brnch,bacts_acnam,bacts_acnum,bacts_routn,
    bacts_notes,bacts_opdat,bacts_crusr,bacts_upusr)
    VALUES ($1,$2,$3,$4,$5,$6,$7,
    $8,$9,$10,$11,$12)`;
    const params = [
      id,
      bacts_users,
      bacts_bsins,
      bacts_bankn,
      bacts_brnch,
      bacts_acnam,
      bacts_acnum,
      bacts_routn,
      bacts_notes,
      bacts_opdat,
      suser_id,
      suser_id,
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
      bacts_bsins,
      bacts_bankn,
      bacts_brnch,
      bacts_acnam,
      bacts_acnum,
      bacts_routn,
      bacts_notes,
      bacts_opdat,
      suser_id,
    } = req.body;

    // Validate input
    if (!id || !bacts_users || !bacts_bsins || !bacts_bankn) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmtb_bacts
    SET bacts_bankn = $1,
    bacts_brnch = $2,
    bacts_acnam = $3,
    bacts_acnum = $4,
    bacts_routn = $5,
    bacts_notes = $6,
    bacts_opdat = $7,
    bacts_upusr = $8,
    bacts_updat = CURRENT_TIMESTAMP,
    bacts_rvnmr = bacts_rvnmr + 1
    WHERE id = $9`;
    const params = [
      bacts_bankn,
      bacts_brnch,
      bacts_acnam,
      bacts_acnum,
      bacts_routn,
      bacts_notes,
      bacts_opdat,
      suser_id,
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
    const { id, bacts_bankn, suser_id } = req.body;

    // Validate input
    if (!id) {
      return res.json({
        success: false,
        message: "Account ID is required",
        data: null,
      });
    }

    //database action

    const sql = `UPDATE tmtb_bacts
    SET bacts_actve = NOT bacts_actve,
    bacts_upusr = $1,
    bacts_updat = CURRENT_TIMESTAMP,
    bacts_rvnmr = bacts_rvnmr + 1
    WHERE id = $2`;
    const params = [suser_id, id];

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

// set default
router.post("/set-default", async (req, res) => {
  try {
    const { id, bacts_bankn, suser_id } = req.body;

    // Validate input
    if (!id) {
      return res.json({
        success: false,
        message: "Account ID is required",
        data: null,
      });
    }

    //database action

    const sql = `UPDATE tmtb_bacts
    SET bacts_isdef = NOT bacts_isdef,
    bacts_upusr = $1,
    bacts_updat = CURRENT_TIMESTAMP,
    bacts_rvnmr = bacts_rvnmr + 1
    WHERE id = $2`;
    const params = [suser_id, id];

    await dbRun(sql, params, `Set default account for ${bacts_bankn}`);
    res.json({
      success: true,
      message: "Account set default successfully",
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

// get all active
router.post("/get-all-active", async (req, res) => {
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
      FROM tmtb_bacts acts
      WHERE acts.bacts_users = $1
      AND acts.bacts_actve = TRUE
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

module.exports = router;
