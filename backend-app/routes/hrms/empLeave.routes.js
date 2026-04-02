const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
  try {
    const { lvemp_users, lvemp_bsins, lvemp_emply, lvemp_yerid } = req.body;

    // Validate input
    if (!lvemp_users || !lvemp_bsins || !lvemp_emply || !lvemp_yerid) {
      return res.json({
        success: false,
        message: "Required fields are missing",
        data: null,
      });
    }

    //database action
    const sql = `SELECT tbl.*, 0 as edit_stop, nst.atnst_sname, emp.emply_ename
      FROM tmhb_lvemp tbl
      JOIN tmhb_atnst nst ON tbl.lvemp_atnst = nst.id
      JOIN tmhb_emply emp ON tbl.lvemp_emply = emp.id
      WHERE tbl.lvemp_users = $1
      AND tbl.lvemp_bsins = $2
      AND emp.emply_ecode = $3
      AND tbl.lvemp_yerid =$4
      ORDER BY tbl.lvemp_yerid`;
    const params = [ lvemp_users, lvemp_bsins, lvemp_emply, lvemp_yerid];

    const rows = await dbGetAll(
      sql,
      params,
      `Get employee leave for ${lvemp_users}`,
    );
    res.json({
      success: true,
      message: "Employee leave fetched successfully",
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
      lvntl_users,
      lvntl_bsins,
      lvntl_yerid,
      lvntl_atnst,
      lvntl_nmbol,
      suser_id,
    } = req.body;

    // Validate input
    if (
      !id ||
      !lvntl_users ||
      !lvntl_bsins ||
      !lvntl_yerid ||
      !lvntl_atnst ||
      lvntl_nmbol === undefined
    ) {
      return res.json({
        success: false,
        message: "Required fields are missing",
        data: null,
      });
    }

    //database action
    const sql = `INSERT INTO tmhb_lvntl
    (id, lvntl_users, lvntl_bsins, lvntl_yerid, lvntl_atnst, lvntl_nmbol, lvntl_crusr, lvntl_upusr)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
    const params = [
      id,
      lvntl_users,
      lvntl_bsins,
      lvntl_yerid,
      lvntl_atnst,
      lvntl_nmbol,
      suser_id,
      suser_id,
    ];

    await dbRun(sql, params, `Create leave entitlement for ${lvntl_atnst}`);
    res.json({
      success: true,
      message: "Leave entitlement created successfully",
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
      lvntl_users,
      lvntl_bsins,
      lvntl_yerid,
      lvntl_atnst,
      lvntl_nmbol,
      suser_id,
    } = req.body;

    // Validate input
    if (
      !id ||
      !lvntl_users ||
      !lvntl_bsins ||
      !lvntl_yerid ||
      !lvntl_atnst ||
      lvntl_nmbol === undefined
    ) {
      return res.json({
        success: false,
        message: "Required fields are missing",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmhb_lvntl
    SET lvntl_yerid = $1,
    lvntl_atnst = $2,
    lvntl_nmbol = $3,
    lvntl_upusr = $4,
    lvntl_updat = CURRENT_TIMESTAMP,
    lvntl_rvnmr = lvntl_rvnmr + 1
    WHERE id = $5`;
    const params = [lvntl_yerid, lvntl_atnst, lvntl_nmbol, suser_id, id];

    await dbRun(sql, params, `Update leave entitlement for ${lvntl_atnst}`);
    res.json({
      success: true,
      message: "Leave entitlement updated successfully",
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
    const { id, lvntl_atnst, suser_id } = req.body;

    // Validate input
    if (!id) {
      return res.json({
        success: false,
        message: "ID is required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmhb_lvntl
    SET lvntl_actve = NOT lvntl_actve,
    lvntl_upusr = $1,
    lvntl_updat = CURRENT_TIMESTAMP,
    lvntl_rvnmr = lvntl_rvnmr + 1
    WHERE id = $2`;
    const params = [suser_id, id];

    await dbRun(sql, params, `Delete leave entitlement for ${lvntl_atnst}`);
    res.json({
      success: true,
      message: "Leave entitlement deleted successfully",
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
    const { lvntl_users, lvntl_bsins } = req.body;

    // Validate input
    if (!lvntl_users || !lvntl_bsins) {
      return res.json({
        success: false,
        message: "User ID and Business ID are required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT tbl.*, 0 as edit_stop
      FROM tmhb_lvntl tbl
      WHERE tbl.lvntl_users = $1
      AND tbl.lvntl_bsins = $2
      AND tbl.lvntl_actve = TRUE
      ORDER BY tbl.lvntl_yerid DESC, tbl.lvntl_atnst ASC`;
    const params = [lvntl_users, lvntl_bsins];

    const rows = await dbGetAll(
      sql,
      params,
      `Get active leave entitlement for ${lvntl_users}`,
    );
    res.json({
      success: true,
      message: "Active leave entitlement fetched successfully",
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
