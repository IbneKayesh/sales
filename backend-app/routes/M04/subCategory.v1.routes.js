const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");
const { GenNewCode } = require("../../db/genHelper");

// get all
router.post("/", async (req, res) => {
  try {
    const { scatg_mcatg, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!scatg_mcatg || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT sctg.*,
    csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 as edit_stop
    FROM tmib_scatg sctg
    LEFT JOIN tmhb_emply csr ON sctg.scatg_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON sctg.scatg_upusr = usr.id
    WHERE sctg.scatg_users = $1
    AND sctg.scatg_mcatg = $2
    ORDER BY sctg.scatg_cname ASC`;

    const params = [user_c, scatg_mcatg];
    const rows = await dbGetAll(sql, params, `get sub catgeory- ${user_c}`);
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
    const sql = `SELECT sctg.*, 0 as edit_stop
    FROM tmib_scatg sctg
    WHERE sctg.scatg_users = $1
    AND sctg.scatg_actve = TRUE
    ORDER BY sctg.scatg_cname ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get sub catgeory- ${user_c}`);
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
      scatg_users,
      scatg_bsins,
      scatg_ccode,
      scatg_mcatg,
      scatg_cname,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (!scatg_mcatg || !scatg_cname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const newCode = await GenNewCode(user_c, "tmib_scatg");

    const sql = `INSERT INTO tmib_scatg(id, scatg_users, scatg_bsins, scatg_ccode, scatg_mcatg, scatg_cname, scatg_crusr, scatg_upusr)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
    const params = [
      uuidv4(),
      user_c,
      user_b,
      newCode,
      scatg_mcatg,
      scatg_cname,
      user_s,
      user_s,
    ];

    await dbRun(sql, params, `create sub catgeory- ${user_c}`);
    res.json({
      success: true,
      message: `${scatg_cname} - Created successfully.`,
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
      scatg_users,
      scatg_bsins,
      scatg_ccode,
      scatg_mcatg,
      scatg_cname,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (!id || !scatg_mcatg || !scatg_cname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql = `UPDATE tmib_scatg
    SET scatg_cname = $1,
    scatg_upusr = $2,
    scatg_updat = CURRENT_TIMESTAMP,
    scatg_rvnmr = scatg_rvnmr + 1
    WHERE id = $3`;
    const params = [scatg_cname, user_s, id];

    await dbRun(sql, params, `update sub catgeory- ${user_c}`);
    res.json({
      success: true,
      message: `${scatg_cname} - Updated successfully.`,
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
    const { id, scatg_cname, scatg_actve, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!id || !scatg_cname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql = `UPDATE tmib_scatg
    SET scatg_actve = NOT scatg_actve,
    scatg_upusr = $1,
    scatg_updat = CURRENT_TIMESTAMP,
    scatg_rvnmr = scatg_rvnmr + 1
    WHERE id = $2`;
    const params = [user_s, id];

    await dbRun(sql, params, `delete sub catgeory- ${user_c}`);
    res.json({
      success: true,
      message: `${scatg_cname} - ${scatg_actve ? "Deactivate" : "Activate"} successfully.`,
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
