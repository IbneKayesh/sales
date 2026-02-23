const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManager");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
  try {
    const { rutes_users, rutes_bsins } = req.body;

    // Validate input
    if (!rutes_users || !rutes_bsins) {
      return res.json({
        success: false,
        message: "User ID and Business ID are required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT rts.*, trt.trtry_wname, ara.tarea_tname, dzn.dzone_dname,
    (
        SELECT COUNT(*)
        FROM tmcb_cntrt c
        WHERE c.cnrut_rutes = rts.id
        AND c.cnrut_actve = 1
    ) AS total_outlets
FROM tmcb_rutes rts
LEFT JOIN tmcb_trtry trt ON rts.rutes_trtry = trt.id
LEFT JOIN tmcb_tarea ara ON trt.trtry_tarea = ara.id
LEFT JOIN tmcb_dzone dzn ON ara.tarea_dzone = dzn.id
WHERE rts.rutes_users = ?
AND rts.rutes_bsins = ?
ORDER BY rts.rutes_rname`;
    const params = [rutes_users, rutes_bsins];

    const rows = await dbGetAll(sql, params, `Get routes for ${rutes_users}`);
    res.json({
      success: true,
      message: "Routes fetched successfully",
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
      rutes_users,
      rutes_bsins,
      rutes_rname,
      rutes_dname,
      rutes_trtry,
      user_id,
    } = req.body;

    // Validate input
    if (!id || !rutes_users || !rutes_bsins || !rutes_rname || !rutes_dname) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `INSERT INTO tmcb_rutes(id, rutes_users, rutes_bsins, rutes_rname, rutes_dname, rutes_trtry,
    rutes_crusr, rutes_upusr)
    VALUES (?, ?, ?, ?, ?, ?,
    ?, ?)`;
    const params = [
      id,
      rutes_users,
      rutes_bsins,
      rutes_rname,
      rutes_dname,
      rutes_trtry,
      user_id,
      user_id,
    ];

    await dbRun(sql, params, `Create route for ${rutes_rname}`);
    res.json({
      success: true,
      message: "Route created successfully",
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
      rutes_users,
      rutes_bsins,
      rutes_rname,
      rutes_dname,
      rutes_trtry,
      user_id,
    } = req.body;

    // Validate input
    if (!id || !rutes_users || !rutes_bsins || !rutes_rname || !rutes_dname) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmcb_rutes
    SET rutes_rname = ?,
    rutes_dname = ?,
    rutes_trtry = ?,
    rutes_upusr = ?,
    rutes_rvnmr = rutes_rvnmr + 1
    WHERE id = ?`;
    const params = [
      rutes_rname,
      rutes_dname,
      rutes_trtry,
      user_id,
      id,
    ];

    await dbRun(sql, params, `Update route for ${rutes_rname}`);
    res.json({
      success: true,
      message: "Route updated successfully",
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
    const { id, rutes_rname } = req.body;

    // Validate input
    if (!id) {
      return res.json({
        success: false,
        message: "Contact ID is required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmcb_rutes
    SET rutes_actve = 1 - rutes_actve
    WHERE id = ?`;
    const params = [id];

    await dbRun(sql, params, `Delete route for ${rutes_rname}`);
    res.json({
      success: true,
      message: "Route deleted successfully",
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



// get all
router.post("/outlets", async (req, res) => {
  try {
    const { cnrut_users, cnrut_bsins, cnrut_rutes } = req.body;

    // Validate input
    if (!cnrut_users || !cnrut_bsins || !cnrut_rutes) {
      return res.json({
        success: false,
        message: "User ID, Business ID and Route ID are required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT trt.id, trt.cnrut_users, trt.cnrut_bsins, trt.cnrut_cntct, trt.cnrut_rutes, trt.cnrut_empid, trt.cnrut_srlno, trt.cnrut_lvdat, trt.cnrut_actve,
    tct.cntct_cntnm, tct.cntct_cntps, tct.cntct_cntno, tct.cntct_ofadr, emp.emply_ecode, emp.emply_ename
    FROM tmcb_cntrt trt
    LEFT JOIN tmcb_cntct tct ON trt.cnrut_cntct = tct.id
    LEFT JOIN tmhb_emply emp ON trt.cnrut_empid = emp.id
    WHERE trt.cnrut_users = ?
    AND trt.cnrut_bsins = ?
    AND trt.cnrut_rutes = ?
    ORDER BY trt.cnrut_srlno`;
    const params = [cnrut_users, cnrut_bsins, cnrut_rutes];

    const rows = await dbGetAll(sql, params, `Get outlets for ${cnrut_users}`);
    res.json({
      success: true,
      message: "Outlets fetched successfully",
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

// delete-outlets
router.post("/delete-outlets", async (req, res) => {
  try {
    const { id, cnrut_users, cnrut_bsins, cntct_cntnm } = req.body;

    // Validate input
    if (!id) {
      return res.json({
        success: false,
        message: "Route ID is required",
        data: null,
      });
    }

    //database action
    const sql = `DELETE FROM tmcb_cntrt
    WHERE id = ?
    AND cnrut_users = ?
    AND cnrut_bsins = ?`;
    const params = [id, cnrut_users, cnrut_bsins];

    await dbRun(sql, params, `Delete route for ${cntct_cntnm}`);
    res.json({
      success: true,
      message: "Outlet deleted successfully",
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


// create-outlets
router.post("/create-outlets", async (req, res) => {
  try {
    const {
      id,
      cnrut_users,
      cnrut_bsins,
      cnrut_cntct,
      cnrut_rutes,
      cnrut_empid,
      cnrut_srlno,
      user_id,
    } = req.body;

    // Validate input
    if (!id || !cnrut_users || !cnrut_bsins || !cnrut_cntct || !cnrut_rutes || !cnrut_empid || !cnrut_srlno) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `INSERT INTO tmcb_cntrt(id, cnrut_users, cnrut_bsins, cnrut_cntct, cnrut_rutes, cnrut_empid, cnrut_srlno,
    cnrut_crusr, cnrut_upusr)
    VALUES (?, ?, ?, ?, ?, ?, ?,
    ?, ?)`;
    const params = [
      id,
      cnrut_users,
      cnrut_bsins,
      cnrut_cntct,
      cnrut_rutes,
      cnrut_empid,
      cnrut_srlno,
      user_id,
      user_id,
    ];

    await dbRun(sql, params, `Create outlet for ${cnrut_srlno}`);
    res.json({
      success: true,
      message: "Outlet created successfully",
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
