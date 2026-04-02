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

    //console.log("req.body",  req.body);

    //database action
    const sql = `SELECT tbl.*, 0 as edit_stop, nst.atnst_sname, emp.emply_ename
      FROM tmhb_lvemp tbl
      JOIN tmhb_atnst nst ON tbl.lvemp_atnst = nst.id
      JOIN tmhb_emply emp ON tbl.lvemp_emply = emp.id
      WHERE tbl.lvemp_users = $1
      AND tbl.lvemp_bsins = $2
      AND emp.emply_ecode = $3
      AND tbl.lvemp_yerid =$4
      ORDER BY tbl.lvemp_yerid, nst.atnst_sname`;
    const params = [lvemp_users, lvemp_bsins, lvemp_emply, lvemp_yerid];

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
      lvapp_users,
      lvapp_bsins,
      lvapp_atnst,
      lvapp_emply,
      lvapp_yerid,
      lvapp_frdat,
      lvapp_todat,
      lvapp_today,
      lvapp_notes,
      lvapp_fsapp,
      lvapp_fsdat,
      suser_id,
    } = req.body;

    //console.log("req.body",  req.body)

    // Validate input
    if (
      !id ||
      !lvapp_users ||
      !lvapp_bsins ||
      !lvapp_atnst ||
      !lvapp_emply ||
      !lvapp_yerid ||
      !lvapp_frdat ||
      !lvapp_todat ||
      !lvapp_today
    ) {
      return res.json({
        success: false,
        message: "Required fields are missing",
        data: null,
      });
    }

    //database action
    const sql_val_1 = `SELECT id
    FROM tmhb_emply
    WHERE emply_ecode = $1`;
    const params_val_1 = [lvapp_emply];
    const val_1 = await dbGet(sql_val_1, params_val_1);

    if (!val_1) {
      return res.json({
        success: false,
        message: "Invalid Employee code",
        data: null,
      });
    }

    const sql_val_2 = `SELECT ap.*
    FROM tmhb_lvapp ap
    JOIN tmhb_emply emp ON ap.lvapp_emply = emp.id
    WHERE emp.emply_ecode = $1
    AND ap.lvapp_yerid = $2
    AND ap.lvapp_frdat <= $4
    AND ap.lvapp_todat >= $3`;
    const params_val_2 = [lvapp_emply, lvapp_yerid, lvapp_frdat, lvapp_todat];
    const val_2 = await dbGet(sql_val_2, params_val_2);

    //console.log("params_val_2",params_val_2)
    //console.log("val_2",val_2)

    if (val_2) {
      return res.json({
        success: false,
        message: "Already exists",
        data: null,
      });
    }

    const sql_val_3 = `SELECT (ap.lvemp_nmbol - ap.lvemp_cnsum) available_qty
    FROM tmhb_lvemp ap    
    WHERE ap.lvemp_users = $1
    AND ap.lvemp_bsins = $2
    AND ap.lvemp_atnst = $3
    AND ap.lvemp_emply = $4
    AND ap.lvemp_yerid = $5`;
    //AND (ap.lvemp_nmbol - ap.lvemp_cnsum) >= $6
    const params_val_3 = [
      lvapp_users,
      lvapp_bsins,
      lvapp_atnst,
      val_1.id,
      lvapp_yerid
    ];
    const val_3 = await dbGet(sql_val_3, params_val_3);
    //console.log("val_3",val_3);
    //console.log("lvapp_today",lvapp_today)

    if (!val_3 || Number(val_3.available_qty) < Number(lvapp_today)) {
      return res.json({
        success: false,
        message: "Leave is not available",
        data: null,
      });
    }

    const sql = `INSERT INTO tmhb_lvapp
    (id, lvapp_users, lvapp_bsins, lvapp_atnst, lvapp_emply, lvapp_yerid,
    lvapp_frdat, lvapp_todat, lvapp_today, lvapp_notes, lvapp_fsapp, lvapp_fsdat,
    lvapp_crusr, lvapp_upusr)
    VALUES ($1, $2, $3, $4, $5, $6, 
    $7, $8, $9, $10, $11, $12,    
    $13, $14)`;
    const params = [
      id,
      lvapp_users,
      lvapp_bsins,
      lvapp_atnst,
      val_1.id,
      lvapp_yerid,
      lvapp_frdat,
      lvapp_todat,
      lvapp_today,
      lvapp_notes,
      "Auto",
      lvapp_fsdat,
      suser_id,
      suser_id,
    ];

    await dbRun(sql, params, `Create leave  for ${lvapp_emply}`);

    //:: update leave
    updateEmpLeave(lvapp_users, lvapp_bsins, val_1.id, lvapp_yerid);

    res.json({
      success: true,
      message: "Leave created successfully",
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
      lvapp_users,
      lvapp_bsins,
      lvapp_atnst,
      lvapp_emply,
      lvapp_yerid,
      suser_id,
    } = req.body;

    // Validate input
    if (
      !id ||
      !lvapp_users ||
      !lvapp_bsins ||
      !lvapp_atnst ||
      !lvapp_emply ||
      lvapp_yerid === undefined
    ) {
      return res.json({
        success: false,
        message: "Required fields are missing",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmhb_lvapp
    SET lvapp_atnst = $1,
    lvapp_emply = $2,
    lvapp_yerid = $3,
    lvntl_upusr = $4,
    lvntl_updat = CURRENT_TIMESTAMP,
    lvntl_rvnmr = lvntl_rvnmr + 1
    WHERE id = $5`;
    const params = [lvapp_atnst, lvapp_emply, lvapp_yerid, suser_id, id];

    await dbRun(sql, params, `Update leave entitlement for ${lvapp_emply}`);
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
    const { id, lvapp_emply, suser_id } = req.body;

    // Validate input
    if (!id) {
      return res.json({
        success: false,
        message: "ID is required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmhb_lvapp
    SET lvntl_actve = NOT lvntl_actve,
    lvntl_upusr = $1,
    lvntl_updat = CURRENT_TIMESTAMP,
    lvntl_rvnmr = lvntl_rvnmr + 1
    WHERE id = $2`;
    const params = [suser_id, id];

    await dbRun(sql, params, `Delete leave entitlement for ${lvapp_emply}`);
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
    const { lvapp_users, lvapp_bsins } = req.body;

    // Validate input
    if (!lvapp_users || !lvapp_bsins) {
      return res.json({
        success: false,
        message: "User ID and Business ID are required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT tbl.*, 0 as edit_stop
      FROM tmhb_lvapp tbl
      WHERE tbl.lvapp_users = $1
      AND tbl.lvapp_bsins = $2
      AND tbl.lvntl_actve = TRUE
      ORDER BY tbl.lvapp_atnst DESC, tbl.lvapp_emply ASC`;
    const params = [lvapp_users, lvapp_bsins];

    const rows = await dbGetAll(
      sql,
      params,
      `Get active leave entitlement for ${lvapp_users}`,
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

//emp-leave-app
router.post("/emp-leave-app", async (req, res) => {
  try {
    const { lvapp_users, lvapp_bsins, lvapp_emply, lvapp_yerid } = req.body;

    // Validate input
    if (!lvapp_users || !lvapp_bsins || !lvapp_emply || !lvapp_yerid) {
      return res.json({
        success: false,
        message: "Required fields are missing",
        data: null,
      });
    }

    //database action
    const sql = `SELECT tbl.*, 0 as edit_stop, nst.atnst_sname, emp.emply_ename
      FROM tmhb_lvapp tbl
      JOIN tmhb_atnst nst ON tbl.lvapp_atnst = nst.id
      JOIN tmhb_emply emp ON tbl.lvapp_emply = emp.id
      WHERE tbl.lvapp_users = $1
      AND tbl.lvapp_bsins = $2
      AND emp.emply_ecode = $3
      AND tbl.lvapp_yerid =$4
      ORDER BY tbl.lvapp_yerid`;
    const params = [lvapp_users, lvapp_bsins, lvapp_emply, lvapp_yerid];

    const rows = await dbGetAll(
      sql,
      params,
      `Get employee leave for ${lvapp_users}`,
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

//update count of leave
const updateEmpLeave = async (users_id, bsins_id, emply_id, yerid_id) => {
  const sql = `UPDATE tmhb_lvemp e
  SET lvemp_cnsum = qry.lvapp_today
  FROM (
      SELECT 
          ap.lvapp_users,
          ap.lvapp_bsins,
          ap.lvapp_atnst,
          ap.lvapp_emply,
          ap.lvapp_yerid,
          SUM(ap.lvapp_today) AS lvapp_today
      FROM tmhb_lvapp ap
      WHERE ap.lvapp_users = $1
      AND ap.lvapp_bsins = $2
      AND ap.lvapp_emply = $3
      AND ap.lvapp_yerid = $4
      GROUP BY 
          ap.lvapp_users,
          ap.lvapp_bsins,
          ap.lvapp_atnst,
          ap.lvapp_emply,
          ap.lvapp_yerid
  ) AS qry
  WHERE e.lvemp_users = qry.lvapp_users
    AND e.lvemp_bsins = qry.lvapp_bsins
    AND e.lvemp_atnst = qry.lvapp_atnst
    AND e.lvemp_emply = qry.lvapp_emply
    AND e.lvemp_yerid = qry.lvapp_yerid`;
  const params = [users_id, bsins_id, emply_id, yerid_id];

  await dbRun(sql, params, `Update salary for ${users_id}`);
};

module.exports = router;
