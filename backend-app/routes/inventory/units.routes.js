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
      FROM tmib_iuofm tbl
      WHERE tbl.iuofm_users = $1
      ORDER BY tbl.iuofm_untnm`;
    const params = [muser_id];

    const rows = await dbGetAll(sql, params, `Get units for ${muser_id}`);
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
      muser_id,
      iuofm_untnm,
      iuofm_untgr,
      suser_id,
    } = req.body;

    // Validate input
    if (
      !id ||
      !muser_id ||
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
    VALUES ($1,$2,$3,$4,$5,$6)`;
    const params = [
      id,
      muser_id,
      iuofm_untnm,
      iuofm_untgr,
      suser_id,
      suser_id,
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
      muser_id,
      iuofm_untnm,
      iuofm_untgr,
      suser_id,
    } = req.body;

    // Validate input
    if (
      !id ||
      !muser_id ||
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
    SET iuofm_users = $1,
    iuofm_untnm = $2,
    iuofm_untgr = $3,
    iuofm_upusr = $4,
    iuofm_updat = CURRENT_TIMESTAMP,
    iuofm_rvnmr = iuofm_rvnmr + 1
    WHERE id = $5`;
    const params = [
      muser_id,
      iuofm_untnm,
      iuofm_untgr,
      suser_id,
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
    const { id, muser_id, iuofm_untnm, suser_id} = req.body;

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
    SET iuofm_actve = NOT iuofm_actve,
    iuofm_upusr = $1,
    iuofm_updat = CURRENT_TIMESTAMP,
    iuofm_rvnmr = iuofm_rvnmr + 1
    WHERE id = $2`;
    const params = [suser_id, id];

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
      FROM tmib_iuofm tbl
      WHERE tbl.iuofm_users = $1
      AND tbl.iuofm_actve = TRUE
      ORDER BY tbl.iuofm_untnm`;
    const params = [muser_id];

    const rows = await dbGetAll(sql, params, `Get units for ${muser_id}`);
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


module.exports = router;
