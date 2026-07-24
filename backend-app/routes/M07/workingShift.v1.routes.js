const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");
const { GenNewCode } = require("../../db/genHelper");

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
    const sql = `SELECT wksf.*,
    csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 as edit_stop
    FROM tmhb_wkshf wksf
    LEFT JOIN tmhb_emply csr ON wksf.wkshf_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON wksf.wkshf_upusr = usr.id
    WHERE wksf.wkshf_users = $1
    ORDER BY wksf.wkshf_cname ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get Working Shift- ${user_c}`);
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
    const sql = `SELECT wksf.*, 0 as edit_stop
    FROM tmhb_wkshf wksf
    WHERE wksf.wkshf_users = $1
    AND wksf.wkshf_actve = TRUE
    ORDER BY wksf.wkshf_cname ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get Working Shift- ${user_c}`);
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
      wkshf_users,
      wkshf_bsins,
      wkshf_ccode,
      wkshf_cname,
      wkshf_bbstr,
      wkshf_satim,
      wkshf_gsmin,
      wkshf_gemin,
      wkshf_entim,
      wkshf_baend,
      wkshf_wkhrs,
      wkshf_mnhrs,
      wkshf_crday,
      wkshf_sgpnc,
      wkshf_ovrtm,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !wkshf_cname ||
      !wkshf_bbstr ||
      !wkshf_satim ||
      !wkshf_entim ||
      !wkshf_baend ||
      !wkshf_wkhrs ||
      !wkshf_mnhrs ||
      !user_s ||
      !user_c ||
      !user_b
    ) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const newCode = await GenNewCode(user_c, "tmhb_wkshf");

    const sql = `INSERT INTO tmhb_wkshf(id, wkshf_users, wkshf_bsins, wkshf_ccode, wkshf_cname, wkshf_bbstr,
      wkshf_satim, wkshf_gsmin, wkshf_gemin, wkshf_entim, wkshf_baend, wkshf_wkhrs,
      wkshf_mnhrs,  wkshf_crday,  wkshf_sgpnc, wkshf_ovrtm, wkshf_crusr, wkshf_upusr)
    VALUES ($1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12,
        $13, $14, $15, $16, $17, $18)`;
    const params = [
      uuidv4(),
      user_c,
      user_b,
      newCode,
      wkshf_cname,
      wkshf_bbstr,
      wkshf_satim,
      wkshf_gsmin,
      wkshf_gemin,
      wkshf_entim,
      wkshf_baend,
      wkshf_wkhrs,
      wkshf_mnhrs,
      wkshf_crday,
      wkshf_sgpnc,
      wkshf_ovrtm,
      user_s,
      user_s,
    ];

    await dbRun(sql, params, `create Working Shift- ${user_c}`);
    res.json({
      success: true,
      message: `${wkshf_cname} - Created successfully.`,
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
      wkshf_users,
      wkshf_bsins,
      wkshf_ccode,
      wkshf_cname,
      wkshf_bbstr,
      wkshf_satim,
      wkshf_gsmin,
      wkshf_gemin,
      wkshf_entim,
      wkshf_baend,
      wkshf_wkhrs,
      wkshf_mnhrs,
      wkshf_crday,
      wkshf_sgpnc,
      wkshf_ovrtm,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !wkshf_cname ||
      !wkshf_bbstr ||
      !wkshf_satim ||
      !wkshf_entim ||
      !wkshf_baend ||
      !wkshf_wkhrs ||
      !wkshf_mnhrs ||
      !user_s ||
      !user_c ||
      !user_b
    ) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql = `UPDATE tmhb_wkshf
    SET wkshf_cname = $1,
    wkshf_bbstr = $2,
    wkshf_satim = $3,
    wkshf_gsmin = $4,
    wkshf_gemin = $5,
    wkshf_entim = $6,
    wkshf_baend = $7,
    wkshf_wkhrs = $8,
    wkshf_mnhrs = $9,
    wkshf_crday = $10,
    wkshf_sgpnc = $11,
    wkshf_ovrtm = $12,
    wkshf_upusr = $13,
    wkshf_updat = CURRENT_TIMESTAMP,
    wkshf_rvnmr = wkshf_rvnmr + 1
    WHERE id = $14`;
    const params = [
      wkshf_cname,
      wkshf_bbstr,
      wkshf_satim,
      wkshf_gsmin,
      wkshf_gemin,
      wkshf_entim,
      wkshf_baend,
      wkshf_wkhrs,
      wkshf_mnhrs,
      wkshf_crday,
      wkshf_sgpnc,
      wkshf_ovrtm,
      user_s,
      id,
    ];

    await dbRun(sql, params, `update Working Shift- ${user_c}`);
    res.json({
      success: true,
      message: `${wkshf_cname} - Updated successfully.`,
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
    const { id, wkshf_cname, wkshf_actve, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!id || !wkshf_cname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql = `UPDATE tmhb_wkshf
    SET wkshf_actve = NOT wkshf_actve,
    wkshf_upusr = $1,
    wkshf_updat = CURRENT_TIMESTAMP,
    wkshf_rvnmr = wkshf_rvnmr + 1
    WHERE id = $2`;
    const params = [user_s, id];

    await dbRun(sql, params, `delete Working Shift- ${user_c}`);
    res.json({
      success: true,
      message: `${wkshf_cname} - ${wkshf_actve ? "Deactivate" : "Activate"} successfully.`,
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
