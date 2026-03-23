const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
  try {
    const { trhed_users } = req.body;

    // Validate input
    if (!trhed_users) {
      return res.json({
        success: false,
        message: "User ID is required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT hed.*, 0 as edit_stop
      FROM tmtb_trhed hed
      WHERE hed.trhed_users = $1
      ORDER BY hed.trhed_grpnm`;
    const params = [trhed_users];

    const rows = await dbGetAll(sql, params, `Get head for ${trhed_users}`);
    res.json({
      success: true,
      message: "Head fetched successfully",
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
      trhed_users,
      trhed_hednm,
      trhed_descr,
      trhed_grpnm,
      trhed_grtyp,
      trhed_cntyp,
      trhed_advic,
      muser_id,
      suser_id,
    } = req.body;

    // Validate input
    if (!id || !trhed_hednm || !trhed_grpnm || !trhed_grtyp || !trhed_cntyp) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `INSERT INTO tmtb_trhed
    (id,trhed_users,trhed_hednm,trhed_descr,trhed_grpnm,trhed_grtyp,trhed_cntyp,trhed_advic,
    trhed_crusr,trhed_upusr)
    VALUES ($1,$2,$3,$4,$5,$6,
    $7,$8,$9,$10)`;
    const params = [
      id,
      trhed_users,
      trhed_hednm,
      trhed_descr,
      trhed_grpnm,
      trhed_grtyp,
      trhed_cntyp,
      trhed_advic,
      suser_id,
      suser_id,
    ];

    await dbRun(sql, params, `Create head for ${trhed_hednm}`);
    res.json({
      success: true,
      message: "Head created successfully",
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
      trhed_users,
      trhed_hednm,
      trhed_descr,
      trhed_grpnm,
      trhed_grtyp,
      trhed_cntyp,
      trhed_advic,
      muser_id,
      suser_id,
    } = req.body;

    // Validate input
    if (!id || !trhed_hednm || !trhed_grpnm || !trhed_grtyp || !trhed_cntyp) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmtb_trhed
    SET trhed_hednm = $1,
    trhed_descr = $2,
    trhed_grpnm = $3,
    trhed_grtyp = $4,
    trhed_cntyp = $5,
    trhed_advic = $6,
    trhed_upusr = $7,
    trhed_updat = CURRENT_TIMESTAMP,
    trhed_rvnmr = trhed_rvnmr + 1
    WHERE id = $8`;
    const params = [
      trhed_hednm,
      trhed_descr,
      trhed_grpnm,
      trhed_grtyp,
      trhed_cntyp,
      trhed_advic,
      suser_id,
      id,
    ];

    await dbRun(sql, params, `Update head for ${trhed_hednm}`);
    res.json({
      success: true,
      message: "Head updated successfully",
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

    const sql = `DELETE FROM tmtb_trhed
    WHERE id = $1`;
    const params = [id];

    await dbRun(sql, params, `Delete head for ${muser_id}`);
    res.json({
      success: true,
      message: "Head deleted successfully",
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
    const { trhed_users } = req.body;

    // Validate input
    if (!trhed_users) {
      return res.json({
        success: false,
        message: "User ID is required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT hed.*, 0 as edit_stop
      FROM tmtb_trhed hed
      WHERE hed.trhed_users = $1
      AND hed.trhed_actve = TRUE
      ORDER BY hed.trhed_grpnm`;

    const params = [trhed_users];

    const rows = await dbGetAll(sql, params, `Get head for ${trhed_users}`);
    res.json({
      success: true,
      message: "Head fetched successfully",
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

// get all advice
router.post("/get-all-advice", async (req, res) => {
  try {
    const { trhed_users } = req.body;

    // Validate input
    if (!trhed_users) {
      return res.json({
        success: false,
        message: "User ID is required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT hed.*, 0 as edit_stop
      FROM tmtb_trhed hed
      WHERE hed.trhed_users = $1
      AND hed.trhed_actve = TRUE
      AND hed.trhed_advic = TRUE
      ORDER BY hed.trhed_grpnm`;

    const params = [trhed_users];

    const rows = await dbGetAll(sql, params, `Get head for ${trhed_users}`);
    res.json({
      success: true,
      message: "Head fetched successfully",
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
