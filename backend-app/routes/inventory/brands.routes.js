const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManager");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
  try {
    const { brand_users } = req.body;

    // Validate input
    if (!brand_users) {
      return res.json({
        success: false,
        message: "User ID is required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT tbl.*, 0 as edit_stop
      FROM tmib_brand tbl
      WHERE tbl.brand_users = ?
      ORDER BY tbl.brand_brnam`;
    const params = [brand_users];

    const rows = await dbGetAll(sql, params, `Get brand for ${brand_users}`);
    res.json({
      success: true,
      message: "Brand fetched successfully",
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
      brand_users,
      brand_brnam,
      user_id,
    } = req.body;

    // Validate input
    if (
      !id ||
      !brand_users ||
      !brand_brnam
    ) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      }); 
    }

    //database action
    const sql = `INSERT INTO tmib_brand
    (id,brand_users,brand_brnam,iuofm_crusr,iuofm_upusr)
    VALUES (?,?,?,?,?)`;
    const params = [
      id,
      brand_users,
      brand_brnam,
      user_id,
      user_id,
    ];

    await dbRun(sql, params, `Create brand for ${brand_brnam}`);
    res.json({
      success: true,
      message: "Brand created successfully",
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
      brand_users,
      brand_brnam,
      user_id,
    } = req.body;

    // Validate input
    if (
      !id ||
      !brand_users ||
      !brand_brnam
    ) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      }); 
    }

    //database action
    const sql = `UPDATE tmib_brand
    SET brand_brnam = ?,
    iuofm_upusr = ?
    WHERE id = ?`;
    const params = [
      brand_brnam,
      user_id,
      id,
    ];

    await dbRun(sql, params, `Update brand for ${brand_brnam}`);
    res.json({
      success: true,
      message: "Brand updated successfully",
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
    const { id, brand_brnam} = req.body;

    // Validate input
    if (!id) {
      return res.json({
        success: false,
        message: "Brand ID is required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmib_brand
    SET brand_actve = 1 - brand_actve
    WHERE id = ?`;
    const params = [id];

    await dbRun(sql, params, `Delete brand for ${brand_brnam}`);
    res.json({
      success: true,
      message: "Brand deleted successfully",
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
