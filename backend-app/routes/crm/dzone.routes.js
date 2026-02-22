const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManager");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
  try {
    const { dzone_users, dzone_bsins } = req.body;

    // Validate input
    if (!dzone_users || !dzone_bsins) {
      return res.json({
        success: false,
        message: "User ID and Business ID are required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT zn.id, zn.dzone_users, zn.dzone_bsins, zn.dzone_cntry, zn.dzone_dname, zn.dzone_actve, 0 as edit_stop
    FROM tmcb_dzone zn
    WHERE zn.dzone_users = ? AND zn.dzone_bsins = ?
    ORDER BY zn.dzone_dname ASC`;
    const params = [dzone_users, dzone_bsins];

    const rows = await dbGetAll(sql, params, `Get dzone for ${dzone_users}`);
    res.json({
      success: true,
      message: "Dzone fetched successfully",
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
    const { id, dzone_users, dzone_bsins, dzone_cntry, dzone_dname, user_id } =
      req.body;

    // Validate input
    if (
      !id ||
      !dzone_users ||
      !dzone_bsins ||
      !dzone_cntry ||
      !dzone_dname ||
      !user_id
    ) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `INSERT INTO tmcb_dzone(id, dzone_users, dzone_bsins, dzone_cntry, dzone_dname, dzone_crusr, dzone_upusr)
    VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const params = [
      id,
      dzone_users,
      dzone_bsins,
      dzone_cntry,
      dzone_dname,
      user_id,
      user_id,
    ];

    await dbRun(sql, params, `Create dzone for ${dzone_dname}`);
    res.json({
      success: true,
      message: "Dzone created successfully",
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
      dzone_users,
      dzone_bsins,
      dzone_cntry,
      dzone_dname,
      user_id,
    } = req.body;

    // Validate input
    if (
      !id ||
      !dzone_users ||
      !dzone_bsins ||
      !dzone_cntry ||
      !dzone_dname ||
      !user_id
    ) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmcb_dzone
    SET dzone_cntry = ?,
    dzone_dname = ?,
    dzone_upusr = ?,
    dzone_rvnmr = dzone_rvnmr + 1
    WHERE id = ?`;
    const params = [
      dzone_cntry,
      dzone_dname,
      user_id,
      id,
    ];

    await dbRun(sql, params, `Update dzone for ${dzone_dname}`);
    res.json({
      success: true,
      message: "Dzone updated successfully",
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
    const { id, dzone_dname } = req.body;

    // Validate input
    if (!id) {
      return res.json({
        success: false,
        message: "Contact ID is required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmcb_dzone
    SET dzone_actve = 1 - dzone_actve
    WHERE id = ?`;
    const params = [id];

    await dbRun(sql, params, `Delete dzone for ${dzone_dname}`);
    res.json({
      success: true,
      message: "Contact deleted successfully",
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

// get by country
router.post("/get-by-country", async (req, res) => {
  try {
    const { dzone_users, dzone_cntry } = req.body;

    // Validate input
    if (!dzone_users || !dzone_cntry) {
      return res.json({
        success: false,
        message: "User ID and Country ID are required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT dzn.*, 0 as edit_stop
    FROM tmcb_dzone dzn
    WHERE dzn.dzone_cntry = ?
    ORDER BY dzn.dzone_dname`;
    const params = [dzone_cntry];

    const rows = await dbGetAll(sql, params, `Get zones for ${dzone_cntry}`);
    res.json({
      success: true,
      message: "Zones fetched successfully",
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
