const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
  try {
    const { attnd_users, attnd_bsins } = req.body;

    // Validate input
    if (!attnd_users || !attnd_bsins) {
      return res.json({
        success: false,
        message: "User ID and Business ID are required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT tbl.*, 0 as edit_stop
      FROM tmhb_attnd tbl
      WHERE tbl.attnd_users = $1
      AND tbl.attnd_bsins = $2
      ORDER BY tbl.attnd_atdat DESC, tbl.attnd_emply ASC`;
    const params = [attnd_users, attnd_bsins];

    const rows = await dbGetAll(
      sql,
      params,
      `Get attendance for ${attnd_users}`,
    );
    res.json({
      success: true,
      message: "Attendance fetched successfully",
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
      attnd_users,
      attnd_bsins,
      attnd_emply,
      attnd_wksft,
      attnd_atdat,
      attnd_dname,
      attnd_intim,
      attnd_stsin,
      attnd_trmni,
      attnd_outim,
      attnd_stsou,
      attnd_trmno,
      attnd_totwh,
      attnd_totoh,
      attnd_notes,
      attnd_sname,
      attnd_prsnt,
      attnd_paybl,
      suser_id,
    } = req.body;

    // Validate input
    if (!id || !attnd_users || !attnd_bsins || !attnd_emply || !attnd_wksft || !attnd_atdat || !attnd_dname) {
      return res.json({
        success: false,
        message: "Required fields are missing",
        data: null,
      });
    }

    //database action
    const sql = `INSERT INTO tmhb_attnd
    (id, attnd_users, attnd_bsins, attnd_emply, attnd_wksft, attnd_atdat, attnd_dname, attnd_intim, attnd_stsin, attnd_trmni, attnd_outim, attnd_stsou, attnd_trmno, attnd_totwh, attnd_totoh, attnd_notes, attnd_sname, attnd_prsnt, attnd_paybl, attnd_crusr, attnd_upusr)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)`;
    const params = [
      id,
      attnd_users,
      attnd_bsins,
      attnd_emply,
      attnd_wksft,
      new Date(attnd_atdat),
      attnd_dname,
      attnd_intim || null,
      attnd_stsin || "",
      attnd_trmni || "",
      attnd_outim || null,
      attnd_stsou || "",
      attnd_trmno || "",
      attnd_totwh || 0,
      attnd_totoh || 0,
      attnd_notes || "",
      attnd_sname || "",
      attnd_prsnt || false,
      attnd_paybl || false,
      suser_id,
      suser_id,
    ];

    await dbRun(sql, params, `Create attendance for ${attnd_emply}`);
    res.json({
      success: true,
      message: "Attendance created successfully",
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
      attnd_users,
      attnd_bsins,
      attnd_emply,
      attnd_wksft,
      attnd_atdat,
      attnd_dname,
      attnd_intim,
      attnd_stsin,
      attnd_trmni,
      attnd_outim,
      attnd_stsou,
      attnd_trmno,
      attnd_totwh,
      attnd_totoh,
      attnd_notes,
      attnd_sname,
      attnd_prsnt,
      attnd_paybl,
      suser_id,
    } = req.body;

    // Validate input
    if (!id || !attnd_users || !attnd_bsins || !attnd_emply || !attnd_wksft || !attnd_atdat || !attnd_dname) {
      return res.json({
        success: false,
        message: "Required fields are missing",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmhb_attnd
    SET attnd_emply = $1,
    attnd_wksft = $2,
    attnd_atdat = $3,
    attnd_dname = $4,
    attnd_intim = $5,
    attnd_stsin = $6,
    attnd_trmni = $7,
    attnd_outim = $8,
    attnd_stsou = $9,
    attnd_trmno = $10,
    attnd_totwh = $11,
    attnd_totoh = $12,
    attnd_notes = $13,
    attnd_sname = $14,
    attnd_prsnt = $15,
    attnd_paybl = $16,
    attnd_upusr = $17,
    attnd_updat = CURRENT_TIMESTAMP,
    attnd_rvnmr = attnd_rvnmr + 1
    WHERE id = $18`;
    const params = [
      attnd_emply,
      attnd_wksft,
      new Date(attnd_atdat),
      attnd_dname,
      attnd_intim || null,
      attnd_stsin || "",
      attnd_trmni || "",
      attnd_outim || null,
      attnd_stsou || "",
      attnd_trmno || "",
      attnd_totwh || 0,
      attnd_totoh || 0,
      attnd_notes || "",
      attnd_sname || "",
      attnd_prsnt || false,
      attnd_paybl || false,
      suser_id,
      id,
    ];

    await dbRun(sql, params, `Update attendance for ${attnd_emply}`);
    res.json({
      success: true,
      message: "Attendance updated successfully",
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
    const { id, attnd_emply, suser_id } = req.body;

    // Validate input
    if (!id) {
      return res.json({
        success: false,
        message: "ID is required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmhb_attnd
    SET attnd_actve = NOT attnd_actve,
    attnd_upusr = $1,
    attnd_updat = CURRENT_TIMESTAMP,
    attnd_rvnmr = attnd_rvnmr + 1
    WHERE id = $2`;
    const params = [suser_id, id];

    await dbRun(sql, params, `Delete attendance for ${attnd_emply}`);
    res.json({
      success: true,
      message: "Attendance deleted successfully",
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
    const { attnd_users, attnd_bsins } = req.body;

    // Validate input
    if (!attnd_users || !attnd_bsins) {
      return res.json({
        success: false,
        message: "User ID and Business ID are required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT tbl.*, 0 as edit_stop
      FROM tmhb_attnd tbl
      WHERE tbl.attnd_users = $1
      AND tbl.attnd_bsins = $2
      AND tbl.attnd_actve = TRUE
      ORDER BY tbl.attnd_atdat DESC, tbl.attnd_emply ASC`;
    const params = [attnd_users, attnd_bsins];

    const rows = await dbGetAll(
      sql,
      params,
      `Get active attendance for ${attnd_users}`,
    );
    res.json({
      success: true,
      message: "Active attendance fetched successfully",
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
