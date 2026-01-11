const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManager");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
  try {
    const { ctgry_users } = req.body;

    // Validate input
    if (!ctgry_users) {
      return res.json({
        success: false,
        message: "User ID is required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT tbl.*, 0 as edit_stop
      FROM tmib_ctgry tbl
      WHERE tbl.ctgry_users = ?
      ORDER BY tbl.ctgry_ctgnm`;
    const params = [ctgry_users];

    const rows = await dbGetAll(sql, params, `Get categories for ${ctgry_users}`);
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
      ctgry_users,
      ctgry_ctgnm,
      user_id,
    } = req.body;

    // Validate input
    if (
      !id ||
      !ctgry_users ||
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
    VALUES (?,?,?,?,?)`;
    const params = [
      id,
      ctgry_users,
      ctgry_ctgnm,
      user_id,
      user_id,
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
      ctgry_users,
      ctgry_ctgnm,
      user_id,
    } = req.body;

    // Validate input
    if (
      !id ||
      !ctgry_users ||
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
    SET ctgry_users = ?,
    ctgry_ctgnm = ?,
    ctgry_upusr = ?
    WHERE id = ?`;
    const params = [
      ctgry_users,
      ctgry_ctgnm,
      user_id,
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
    const { id, ctgry_ctgnm} = req.body;

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
    SET ctgry_actve = 1 - ctgry_actve
    WHERE id = ?`;
    const params = [id];

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

module.exports = router;
