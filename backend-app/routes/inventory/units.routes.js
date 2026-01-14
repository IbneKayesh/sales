const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManager");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
  try {
    const { iuofm_users } = req.body;

    // Validate input
    if (!iuofm_users) {
      return res.json({
        success: false,
        message: "User ID is required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT tbl.*, 0 as edit_stop
      FROM tmib_iuofm tbl
      WHERE tbl.iuofm_users = ?
      ORDER BY tbl.iuofm_untnm`;
    const params = [iuofm_users];

    const rows = await dbGetAll(sql, params, `Get units for ${iuofm_users}`);
    res.json({
      success: true,
      message: "Units fetched successfully",
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
      iuofm_users,
      iuofm_untnm,
      iuofm_untgr,
      user_id,
    } = req.body;

    // Validate input
    if (
      !id ||
      !iuofm_users ||
      !iuofm_untnm
    ) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      }); 
    }

    //database action
    const sql = `INSERT INTO tmib_iuofm
    (id,iuofm_users,iuofm_untnm,iuofm_untgr,iuofm_crusr,iuofm_upusr)
    VALUES (?,?,?,?,?,?)`;
    const params = [
      id,
      iuofm_users,
      iuofm_untnm,
      iuofm_untgr,
      user_id,
      user_id,
    ];

    await dbRun(sql, params, `Create unit for ${iuofm_untnm}`);
    res.json({
      success: true,
      message: "Unit created successfully",
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
      iuofm_users,
      iuofm_untnm,
      iuofm_untgr,
      user_id,
    } = req.body;

    // Validate input
    if (
      !id ||
      !iuofm_users ||
      !iuofm_untnm
    ) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      }); 
    }

    //database action
    const sql = `UPDATE tmib_iuofm
    SET iuofm_users = ?,
    iuofm_untnm = ?,
    iuofm_untgr = ?,
    iuofm_upusr = ?
    WHERE id = ?`;
    const params = [
      iuofm_users,
      iuofm_untnm,
      iuofm_untgr,
      user_id,
      id,
    ];

    await dbRun(sql, params, `Update unit for ${iuofm_untnm}`);
    res.json({
      success: true,
      message: "Unit updated successfully",
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
    const { id, iuofm_untnm} = req.body;

    // Validate input
    if (!id) {
      return res.json({
        success: false,
        message: "Unit ID is required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmib_iuofm
    SET iuofm_actve = 1 - iuofm_actve
    WHERE id = ?`;
    const params = [id];

    await dbRun(sql, params, `Delete unit for ${iuofm_untnm}`);
    res.json({
      success: true,
      message: "Unit deleted successfully",
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
