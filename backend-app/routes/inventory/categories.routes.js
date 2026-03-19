const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
  try {
    const { muser_id } = req.body;

    // Validate input
    if (!muser_id) {
      return res.json({
        success: false,
        message: "User ID is required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT tbl.*, 0 as edit_stop
      FROM tmib_ctgry tbl
      WHERE tbl.ctgry_users = $1
      ORDER BY tbl.ctgry_ctgnm`;
    const params = [muser_id];

    const rows = await dbGetAll(sql, params, `Get categories for ${muser_id}`);
    res.json({
      success: true,
      message: "Categories fetched successfully",
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
      muser_id,
      ctgry_ctgnm,
      suser_id,
    } = req.body;

    // Validate input
    if (
      !id ||
      !muser_id ||
      !ctgry_ctgnm
    ) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      }); 
    }

    //database action
    const sql = `INSERT INTO tmib_ctgry
    (id,ctgry_users,ctgry_ctgnm,ctgry_crusr,ctgry_upusr)
    VALUES ($1,$2,$3,$4,$5)`;
    const params = [
      id,
      muser_id,
      ctgry_ctgnm,
      suser_id,
      suser_id,
    ];

    await dbRun(sql, params, `Create category for ${ctgry_ctgnm}`);
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
    const {
      id,
      muser_id,
      ctgry_ctgnm,
      suser_id,
    } = req.body;

    // Validate input
    if (
      !id ||
      !muser_id ||
      !ctgry_ctgnm
    ) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      }); 
    }

    //database action
    const sql = `UPDATE tmib_ctgry
    SET ctgry_ctgnm = $1,
    ctgry_upusr = $2,
    ctgry_updat = CURRENT_TIMESTAMP,
    ctgry_rvnmr = ctgry_rvnmr + 1
    WHERE id = $3`;
    const params = [
      ctgry_ctgnm,
      suser_id,
      id,
    ];

    await dbRun(sql, params, `Update category for ${ctgry_ctgnm}`);
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
    const { id, muser_id, ctgry_ctgnm, suser_id} = req.body;

    // Validate input
    if (!id) {
      return res.json({
        success: false,
        message: "Unit ID is required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmib_ctgry
    SET ctgry_actve = NOT ctgry_actve,
    ctgry_upusr = $1,
    ctgry_updat = CURRENT_TIMESTAMP,
    ctgry_rvnmr = ctgry_rvnmr + 1
    WHERE id = $2`;
    const params = [suser_id, id];

    await dbRun(sql, params, `Delete category for ${ctgry_ctgnm}`);
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
    const { muser_id } = req.body;

    // Validate input
    if (!muser_id) {
      return res.json({
        success: false,
        message: "User ID is required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT tbl.*, 0 as edit_stop
    FROM tmib_ctgry tbl
    WHERE tbl.ctgry_users = $1
    AND tbl.ctgry_actve = TRUE
    ORDER BY tbl.ctgry_ctgnm`;
    const params = [muser_id];

    const rows = await dbGetAll(sql, params, `Get categories for ${muser_id}`);
    res.json({
      success: true,
      message: "Categories fetched successfully",
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
