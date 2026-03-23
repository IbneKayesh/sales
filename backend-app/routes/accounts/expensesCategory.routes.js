const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
  try {
    const { exctg_users, exctg_bsins } = req.body;

    // Validate input
    if (!exctg_users || !exctg_bsins) {
      return res.json({
        success: false,
        message: "User ID is required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT ctg.*, 0 as edit_stop, trd.trhed_hednm
      FROM tmtb_exctg ctg
      JOIN tmtb_trhed trd ON trd.id = ctg.exctg_trhed
      WHERE ctg.exctg_users = $1
      AND ctg.exctg_bsins = $2
      ORDER BY trd.trhed_hednm, ctg.exctg_cname`;
    const params = [exctg_users, exctg_bsins];

    const rows = await dbGetAll(sql, params, `Get category for ${exctg_bsins}`);
    res.json({
      success: true,
      message: "Category fetched successfully",
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
      exctg_users,
      exctg_bsins,
      exctg_trhed,
      exctg_cname,
      muser_id,
      suser_id,
    } = req.body;

    // Validate input
    if (!id || !exctg_trhed || !exctg_cname) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `INSERT INTO tmtb_exctg
    (id,exctg_users,exctg_bsins,exctg_trhed,exctg_cname,
    exctg_crusr,exctg_upusr)
    VALUES ($1,$2,$3,$4,
    $5,$6,$7)`;
    const params = [
      id,
      exctg_users,
      exctg_bsins,
      exctg_trhed,
      exctg_cname,
      suser_id,
      suser_id,
    ];

    await dbRun(sql, params, `Create category for ${exctg_bsins}`);
    res.json({
      success: true,
      message: "Category created successfully",
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
    const { id, exctg_users, exctg_bsins, exctg_cname, muser_id, suser_id } =
      req.body;

    // Validate input
    if (!id || !exctg_cname) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmtb_exctg
    SET exctg_cname = $1,
    exctg_upusr = $2,
    exctg_updat = CURRENT_TIMESTAMP,
    exctg_rvnmr = exctg_rvnmr + 1
    WHERE id = $3`;
    const params = [exctg_cname, suser_id, id];

    await dbRun(sql, params, `Update category for ${exctg_bsins}`);
    res.json({
      success: true,
      message: "Category updated successfully",
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
    const { id, muser_id, suser_id } = req.body;

    // Validate input
    if (!id) {
      return res.json({
        success: false,
        message: "Category ID is required",
        data: null,
      });
    }

    //database action

    const sql = `UPDATE tmtb_exctg
    SET exctg_actve = NOT exctg_actve,
    exctg_upusr = $1,
    exctg_updat = CURRENT_TIMESTAMP,
    exctg_rvnmr = exctg_rvnmr + 1
    WHERE id = $2`;
    const params = [suser_id, id];

    await dbRun(sql, params, `Delete category for ${muser_id}`);
    res.json({
      success: true,
      message: "Category deleted successfully",
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
    const { exctg_users, exctg_bsins } = req.body;

    // Validate input
    if (!exctg_users || !exctg_bsins) {
      return res.json({
        success: false,
        message: "User ID is required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT ctg.*, 0 as edit_stop
      FROM tmtb_exctg ctg
      WHERE ctg.exctg_users = $1
      AND ctg.exctg_bsins = $2
      AND ctg.exctg_actve = TRUE
      ORDER BY ctg.exctg_cname`;
    const params = [exctg_users, exctg_bsins];

    const rows = await dbGetAll(sql, params, `Get category for ${exctg_bsins}`);
    res.json({
      success: true,
      message: "Category fetched successfully",
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
