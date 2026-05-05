const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");
const { GenNewCode } = require("../../db/genTableCode");

// get all
router.post("/", async (req, res) => {
  try {
    const { user_s, user_c, user_b } = req.body;

    // Validate input
    if (!user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT cnt.*,
    try.trtry_wname, tar.tarea_tname, dzn.dzone_dname, ctr.shtbl_dtext AS cntry_cname, 0 as edit_stop
    FROM tmcb_cntct cnt
    JOIN tmcb_trtry try ON cnt.cntct_trtry = try.id
    JOIN tmcb_tarea tar ON cnt.cntct_tarea = tar.id
    JOIN tmcb_dzone dzn ON cnt.cntct_dzone = dzn.id
    JOIN tmnb_shtbl ctr ON cnt.cntct_cntry = ctr.shtbl_value AND ctr.shtbl_gname = 'Country'
    JOIN tmnb_shtbl crn ON cnt.cntct_crncy = crn.shtbl_value AND ctr.shtbl_gname = 'Currency'
    WHERE cnt.cntct_apusr = $1
    ORDER BY cnt.cntct_cntnm ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get contact- ${user_c}`);
    res.json({
      success: true,
      message: "Query executed successfully.",
      data: rows,
    });
  } catch (error) {
    console.error("database action error:", error);
    return res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: [],
    });
  }
});

// get-all-active
router.post("/get-all-active", async (req, res) => {
  try {
    const { user_s, user_c, user_b } = req.body;

    // Validate input
    if (!user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT cnt.*, 0 as edit_stop
    FROM tmcb_cntct cnt
    WHERE cnt.cntct_apusr = $1
    AND cnt.cntct_actve = TRUE
    ORDER BY cnt.cntct_cntnm ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get contact- ${user_c}`);
    res.json({
      success: true,
      message: "Query executed successfully.",
      data: rows,
    });
  } catch (error) {
    console.error("database action error:", error);
    return res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: [],
    });
  }
});


const create = async (req, res) => {
  try {
    const {
      id,
      dzone_apusr,
      dzone_bsins,
      dzone_cntry,
      dzone_dcode,
      dzone_dname,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (!dzone_cntry || !dzone_dname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const newCode = await GenNewCode(user_c, "tmcb_dzone");

    const sql = `INSERT INTO tmcb_dzone(id, dzone_apusr, dzone_bsins, dzone_cntry, dzone_dcode, dzone_dname, dzone_crusr, dzone_upusr)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
    const params = [
      uuidv4(),
      user_c,
      user_b,
      dzone_cntry,
      newCode,
      dzone_dname,
      user_s,
      user_s,
    ];

    await dbRun(sql, params, `create dzone- ${user_c}`);
    res.json({
      success: true,
      message: `${dzone_dname} - Created successfully.`,
    data: {},
    });
  } catch (error) {
    console.error("database action error:", error);
    return res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: {},
    });
  }
};

const update = async (req, res) => {
  try {
    const {
      id,
      dzone_apusr,
      dzone_bsins,
      dzone_cntry,
      dzone_dcode,
      dzone_dname,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (!id || !dzone_cntry || !dzone_dname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql = `UPDATE tmcb_dzone
    SET dzone_cntry = $1,
    dzone_dname = $2,
    dzone_upusr = $3,
    dzone_updat = CURRENT_TIMESTAMP,
    dzone_rvnmr = dzone_rvnmr + 1
    WHERE id = $4`;
    const params = [dzone_cntry, dzone_dname, user_s, id];

    await dbRun(sql, params, `update dzone- ${user_c}`);
    res.json({
      success: true,
      message: `${dzone_dname} - Updated successfully.`,
      data: {},
    });
  } catch (error) {
    console.error("database action error:", error);
    return res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: {},
    });
  }
};

// upsert — dispatches to create or update based on presence of id
router.post("/upsert", async (req, res) => {
  const { id } = req.body;
  if (id) {
    return update(req, res);
  } else {
    return create(req, res);
  }
});

// create
router.post("/create", create);

// update
router.post("/update", update);

// delete
router.post("/delete", async (req, res) => {
  try {
    const { id, cntct_cntnm, dzone_actve, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!id || !cntct_cntnm || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql = `UPDATE tmcb_cntct
    SET cntct_actve = NOT cntct_actve,
    cntct_upusr = $1,
    cntct_updat = CURRENT_TIMESTAMP,
    cntct_rvnmr = cntct_rvnmr + 1
    WHERE id = $2`;
    const params = [user_s, id];

    await dbRun(sql, params, `delete contact- ${user_c}`);
    res.json({
      success: true,
      message: `${cntct_cntnm} - ${dzone_actve ? "Deactivate" : "Activate"} successfully.`,
      data: {},
    });
  } catch (error) {
    console.error("database action error:", error);
    return res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: {},
    });
  }
});



module.exports = router;
