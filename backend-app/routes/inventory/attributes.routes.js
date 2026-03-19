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
    const sql = `SELECT atb.*, 0 as edit_stop
      FROM tmib_attrb atb
      WHERE atb.attrb_users = $1
      ORDER BY atb.attrb_aname`;
    const params = [muser_id];

    const rows = await dbGetAll(sql, params, `Get attributes for ${muser_id}`);
    res.json({
      success: true,
      message: "Attributes fetched successfully",
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

// get product
router.post("/product", async (req, res) => {
  try {
    const { muser_id, items_id } = req.body;

    // Validate input
    if (!muser_id || !items_id) {
      return res.json({
        success: false,
        message: "User ID and Items ID are required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT atb.*, 0 as edit_stop
      FROM tmib_attrb atb
      JOIN tmib_items itm ON atb.attrb_ctgry = itm.items_ctgry
      WHERE atb.attrb_users = $1
      AND itm.id = $2
      ORDER BY atb.attrb_aname`;
    //AND atb.attrb_actve = TRUE
    const params = [muser_id, items_id];

    const rows = await dbGetAll(sql, params, `Get attributes for ${muser_id}`);
    res.json({
      success: true,
      message: "Attributes fetched successfully",
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


// get category
router.post("/category", async (req, res) => {
  try {
    const { muser_id, attrb_ctgry } = req.body;

    // Validate input
    if (!muser_id || !attrb_ctgry) {
      return res.json({
        success: false,
        message: "User ID and Category ID are required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT atb.*, 0 as edit_stop
      FROM tmib_attrb atb
      WHERE atb.attrb_users = $1
      AND atb.attrb_ctgry = $2
      ORDER BY atb.attrb_aname`;
    //AND atb.attrb_actve = TRUE
    const params = [muser_id, attrb_ctgry];

    const rows = await dbGetAll(sql, params, `Get attributes for ${muser_id}`);
    res.json({
      success: true,
      message: "Attributes fetched successfully",
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
    const { id, attrb_ctgry, attrb_aname, attrb_dtype, muser_id, suser_id } =
      req.body;

    // Validate input
    if (!id || !attrb_ctgry || !attrb_aname || !attrb_dtype || !muser_id) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `INSERT INTO tmib_attrb
    (id,attrb_users,attrb_ctgry,attrb_aname,attrb_dtype,attrb_crusr,attrb_upusr)
    VALUES ($1,$2,$3,$4,$5,$6,$7)`;
    const params = [
      id,
      muser_id,
      attrb_ctgry,
      attrb_aname,
      attrb_dtype,
      suser_id,
      suser_id,
    ];

    await dbRun(sql, params, `Create attribute for ${attrb_aname}`);
    res.json({
      success: true,
      message: "Attribute created successfully",
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
    const { id, attrb_ctgry, attrb_aname, attrb_dtype, muser_id, suser_id } =
      req.body;

    // Validate input
    if (!id || !attrb_ctgry || !attrb_aname || !attrb_dtype || !muser_id) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmib_attrb
    SET attrb_aname = $1,
    attrb_dtype = $2,
    attrb_upusr = $3,
    attrb_updat = CURRENT_TIMESTAMP,
    attrb_rvnmr = attrb_rvnmr + 1
    WHERE id = $4`;
    const params = [attrb_aname, attrb_dtype, suser_id, id];

    await dbRun(sql, params, `Update attribute for ${attrb_aname}`);
    res.json({
      success: true,
      message: "Attribute updated successfully",
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
    const { id, muser_id, ctgry_ctgnm, suser_id } = req.body;

    // Validate input
    if (!id) {
      return res.json({
        success: false,
        message: "ID is required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmib_attrb
    SET attrb_actve = NOT attrb_actve,
    attrb_upusr = $1,
    attrb_updat = CURRENT_TIMESTAMP,
    attrb_rvnmr = attrb_rvnmr + 1
    WHERE id = $2`;
    const params = [suser_id, id];

    await dbRun(sql, params, `Delete attribute for ${ctgry_ctgnm}`);
    res.json({
      success: true,
      message: "Attribute deleted successfully",
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
