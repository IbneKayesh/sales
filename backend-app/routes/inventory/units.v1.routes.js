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
    const sql = `SELECT unts.*,
    csr.users_uname AS crusr_cname, usr.users_uname AS upusr_cname, 0 as edit_stop
    FROM tmib_units unts
    LEFT JOIN tmnb_users csr ON unts.units_crusr = csr.id
    LEFT JOIN tmnb_users usr ON unts.units_upusr = usr.id
    WHERE unts.units_apusr = $1
    ORDER BY unts.units_untgr, unts.units_uname ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get units- ${user_c}`);
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
    const sql = `SELECT unts.*, 0 as edit_stop
    FROM tmib_units unts
    WHERE unts.units_apusr = $1
    AND unts.units_actve = TRUE
    ORDER BY unts.units_untgr, unts.units_uname ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get units- ${user_c}`);
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
      units_apusr,
      units_bsins,
      units_ucode,
      units_uname,
      units_untgr,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (!units_uname || !units_untgr || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const newCode = await GenNewCode(user_c, "tmib_units");

    const sql = `INSERT INTO tmib_units(id, units_apusr, units_bsins, units_ucode, units_uname, units_untgr, units_crusr, units_upusr)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
    const params = [
      uuidv4(),
      user_c,
      user_b,
      newCode,
      units_uname,
      units_untgr,
      user_s,
      user_s,
    ];

    await dbRun(sql, params, `create units- ${user_c}`);
    res.json({
      success: true,
      message: `${units_uname} - Created successfully.`,
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
      units_apusr,
      units_bsins,
      units_ucode,
      units_uname,
      units_untgr,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (!id || !units_uname || !units_untgr || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql = `UPDATE tmib_units
    SET units_uname = $1,
    units_untgr = $2,
    units_upusr = $3,
    units_updat = CURRENT_TIMESTAMP,
    units_rvnmr = units_rvnmr + 1
    WHERE id = $4`;
    const params = [units_uname, units_untgr, user_s, id];

    await dbRun(sql, params, `update units- ${user_c}`);
    res.json({
      success: true,
      message: `${units_uname} - Updated successfully.`,
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
    const { id, units_uname, units_actve, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!id || !units_uname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql = `UPDATE tmib_units
    SET units_actve = NOT units_actve,
    units_upusr = $1,
    units_updat = CURRENT_TIMESTAMP,
    units_rvnmr = units_rvnmr + 1
    WHERE id = $2`;
    const params = [user_s, id];

    await dbRun(sql, params, `delete units- ${user_c}`);
    res.json({
      success: true,
      message: `${units_uname} - ${units_actve ? "Deactivate" : "Activate"} successfully.`,
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
