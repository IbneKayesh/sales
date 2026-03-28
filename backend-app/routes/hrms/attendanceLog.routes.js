const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
  try {
    const { atnlg_users, atnlg_bsins } = req.body;

    // Validate input
    if (!atnlg_users || !atnlg_bsins) {
      return res.json({
        success: false,
        message: "User ID is required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT tbl.*, 0 as edit_stop, emp.emply_ename
      FROM tmhb_atnlg tbl
      JOIN tmhb_emply emp ON tbl.atnlg_ecode = emp.emply_ecode
      WHERE tbl.atnlg_users = $1
      AND tbl.atnlg_bsins = $2
      AND emp.emply_ecode IS NOT NULL
      AND TRIM(emp.emply_ecode) <> ''
      UNION ALL
      SELECT tbl.*, 0 as edit_stop, emp.emply_ename
      FROM tmhb_atnlg tbl
      JOIN tmhb_emply emp ON tbl.atnlg_crdno = emp.emply_crdno
      WHERE tbl.atnlg_users = $1
      AND tbl.atnlg_bsins = $2
      AND emp.emply_crdno IS NOT NULL
      AND TRIM(emp.emply_crdno) <> ''
      ORDER BY atnlg_lgtim DESC`;
    const params = [atnlg_users, atnlg_bsins];

    const rows = await dbGetAll(
      sql,
      params,
      `Get attendance log for ${atnlg_users}`,
    );
    res.json({
      success: true,
      message: "Attendance log fetched successfully",
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
      atnlg_bsins,
      atnlg_ecode,
      atnlg_crdno,
      atnlg_lgtim,
      atnlg_trmnl,
      suser_id,
      bsins_id,
    } = req.body;

    // Validate input - at least one of ecode or crdno is required
    if (!id || !muser_id || !bsins_id || (!atnlg_ecode && !atnlg_crdno)) {
      return res.json({
        success: false,
        message:
          "User ID and at least one of Employee Code or Card Number is required",
        data: null,
      });
    }

    //database action
    //build scripts
    const scripts = [];
    scripts.push({
      sql: `INSERT INTO tmhb_atnlg
    (id, atnlg_users, atnlg_bsins, atnlg_ecode, atnlg_crdno, atnlg_lgtim, atnlg_trmnl, atnlg_crusr, atnlg_upusr)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      params: [
        id,
        muser_id,
        bsins_id,
        atnlg_ecode || "",
        atnlg_crdno || "",
        atnlg_lgtim || new Date(),
        atnlg_trmnl || "",
        suser_id,
        suser_id,
      ],
      label: `Create attendance log for ${atnlg_ecode || atnlg_crdno}`,
    });

    scripts.push({
      sql: `DELETE FROM tmhb_atnlg tbl
            WHERE NOT EXISTS (
                SELECT 1
                FROM tmhb_emply emp
                WHERE (
                    tbl.atnlg_ecode = emp.emply_ecode
                    AND emp.emply_ecode IS NOT NULL
                    AND TRIM(emp.emply_ecode) <> ''
                )
                OR (
                    tbl.atnlg_crdno = emp.emply_crdno
                    AND emp.emply_crdno IS NOT NULL
                    AND TRIM(emp.emply_crdno) <> ''
                )
            )
            AND tbl.atnlg_users = $1
            AND tbl.atnlg_bsins = $2`,
      params: [muser_id, bsins_id],
      label: `Delete attendance log Garbage`,
    });

    await dbRunAll(scripts);

    res.json({
      success: true,
      message: "Attendance log created successfully",
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

// delete (toggle active)
router.post("/delete", async (req, res) => {
  try {
    const { id, atnlg_ecode, atnlg_crdno, suser_id } = req.body;

    // Validate input
    if (!id) {
      return res.json({
        success: false,
        message: "Attendance Log ID is required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmhb_atnlg
    SET atnlg_actve = NOT atnlg_actve,
    atnlg_upusr = $1,
    atnlg_updat = CURRENT_TIMESTAMP,
    atnlg_rvnmr = atnlg_rvnmr + 1
    WHERE id = $2`;
    const params = [suser_id, id];

    await dbRun(
      sql,
      params,
      `Delete attendance log for ${atnlg_ecode || atnlg_crdno}`,
    );
    res.json({
      success: true,
      message: "Attendance log deleted successfully",
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
