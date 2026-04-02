const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
  try {
    const { atnst_users, atnst_bsins } = req.body;

    // Validate input
    if (!atnst_users || !atnst_bsins) {
      return res.json({
        success: false,
        message: "User ID and Business ID are required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT tbl.*, 0 as edit_stop
      FROM tmhb_atnst tbl
      WHERE tbl.atnst_users = $1
      AND tbl.atnst_bsins = $2
      ORDER BY tbl.atnst_sname`;
    const params = [atnst_users, atnst_bsins];

    const rows = await dbGetAll(
      sql,
      params,
      `Get attendance status for ${atnst_users}`,
    );
    res.json({
      success: true,
      message: "Attendance status fetched successfully",
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
      atnst_users,
      atnst_bsins,
      atnst_sname,
      atnst_prsnt,
      atnst_paybl,
      atnst_nappl,
      atnst_color,
      suser_id,
    } = req.body;

    // Validate input
    if (!id || !atnst_users || !atnst_bsins || !atnst_sname) {
      return res.json({
        success: false,
        message: "Required fields are missing",
        data: null,
      });
    }

    //database action
    const sql = `INSERT INTO tmhb_atnst
    (id, atnst_users, atnst_bsins, atnst_sname, atnst_prsnt, atnst_paybl, atnst_nappl, atnst_color, atnst_crusr, atnst_upusr)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
    const params = [
      id,
      atnst_users,
      atnst_bsins,
      atnst_sname,
      atnst_prsnt,
      atnst_paybl,
      atnst_nappl,
      atnst_color,
      suser_id,
      suser_id,
    ];

    await dbRun(sql, params, `Create attendance status for ${atnst_sname}`);
    res.json({
      success: true,
      message: "Attendance status created successfully",
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
      atnst_users,
      atnst_bsins,
      atnst_sname,
      atnst_prsnt,
      atnst_paybl,
      atnst_nappl,
      atnst_color,
      suser_id,
    } = req.body;

    // Validate input
    if (!id || !atnst_users || !atnst_bsins || !atnst_sname) {
      return res.json({
        success: false,
        message: "Required fields are missing",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmhb_atnst
    SET atnst_sname = $1,
    atnst_prsnt = $2,
    atnst_paybl = $3,
    atnst_nappl = $4,
    atnst_color = $5,
    atnst_upusr = $6,
    atnst_updat = CURRENT_TIMESTAMP,
    atnst_rvnmr = atnst_rvnmr + 1
    WHERE id = $7`;
    const params = [
      atnst_sname,
      atnst_prsnt,
      atnst_paybl,
      atnst_nappl,
      atnst_color,
      suser_id,
      id,
    ];

    await dbRun(sql, params, `Update attendance status for ${atnst_sname}`);
    res.json({
      success: true,
      message: "Attendance status updated successfully",
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
    const { id, atnst_sname, suser_id } = req.body;

    // Validate input
    if (!id) {
      return res.json({
        success: false,
        message: "ID is required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmhb_atnst
    SET atnst_actve = NOT atnst_actve,
    atnst_upusr = $1,
    atnst_updat = CURRENT_TIMESTAMP,
    atnst_rvnmr = atnst_rvnmr + 1
    WHERE id = $2`;
    const params = [suser_id, id];

    await dbRun(sql, params, `Delete attendance status for ${atnst_sname}`);
    res.json({
      success: true,
      message: "Attendance status deleted successfully",
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
    const { atnst_users, atnst_bsins } = req.body;

    // Validate input
    if (!atnst_users || !atnst_bsins) {
      return res.json({
        success: false,
        message: "User ID and Business ID are required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT tbl.*, 0 as edit_stop
      FROM tmhb_atnst tbl
      WHERE tbl.atnst_users = $1
      AND tbl.atnst_bsins = $2
      AND tbl.atnst_actve = TRUE
      ORDER BY tbl.atnst_sname`;
    const params = [atnst_users, atnst_bsins];

    const rows = await dbGetAll(
      sql,
      params,
      `Get active attendance status for ${atnst_users}`,
    );
    res.json({
      success: true,
      message: "Active attendance status fetched successfully",
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

//create-emp-leave
router.post("/create-emp-leave", async (req, res) => {
  try {
    const {
      id,
      lvemp_users,
      lvemp_bsins,
      lvemp_atnst,
      lvemp_emply,
      lvemp_yerid,
      lvemp_nmbol,
      lvemp_cnsum,
      lvemp_blnce,
      suser_id,
    } = req.body;

    // Validate input
    if (!id || !lvemp_users || !lvemp_bsins || !lvemp_yerid) {
      return res.json({
        success: false,
        message: "Required fields are missing",
        data: null,
      });
    }

    //database action
    //build scripts
    const scripts = [];
    scripts.push({
      sql: `DELETE FROM tmhb_lvemp
          WHERE lvemp_users = $1
          AND lvemp_bsins = $2
          AND lvemp_yerid = $3`,
      params: [lvemp_users, lvemp_bsins, lvemp_yerid],
      label: `Delete employee ${lvemp_yerid}`,
    });

    scripts.push({
      sql: `INSERT INTO tmhb_lvemp (id, lvemp_users, lvemp_bsins,
    lvemp_atnst, lvemp_emply, lvemp_yerid, lvemp_nmbol,
    lvemp_cnsum, lvemp_blnce, lvemp_crusr, lvemp_upusr
)
SELECT gen_random_uuid(), nst.atnst_users, nst.atnst_bsins,
    nst.id, emp.id,  $1, nst.atnst_nappl,
    0, nst.atnst_nappl, $2, $3
FROM tmhb_atnst nst
CROSS JOIN tmhb_emply emp
WHERE nst.atnst_nappl > 0
AND nst.atnst_users = $4
AND nst.atnst_bsins = $5
ORDER BY emp.id, nst.id`,
      params: [lvemp_yerid, suser_id, suser_id, lvemp_users, lvemp_bsins],
      label: `Create employee leave ${lvemp_yerid}`,
    });

    await dbRunAll(scripts);

    res.json({
      success: true,
      message: "Employee created successfully",
      data: {
        ...req.body,
      },
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
