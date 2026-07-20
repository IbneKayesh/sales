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
    const sql = `SELECT mctg.*,
    csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 as edit_stop
    FROM tmib_mcatg mctg
    LEFT JOIN tmhb_emply csr ON mctg.mcatg_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON mctg.mcatg_upusr = usr.id
    WHERE mctg.mcatg_users = $1
    ORDER BY mctg.mcatg_cname ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get catgeory- ${user_c}`);
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
    const sql = `SELECT mctg.*, 0 as edit_stop
    FROM tmib_mcatg mctg
    WHERE mctg.mcatg_users = $1
    AND mctg.mcatg_actve = TRUE
    ORDER BY mctg.mcatg_cname ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get catgeory- ${user_c}`);
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
      mcatg_users,
      mcatg_bsins,
      mcatg_ccode,
      mcatg_cname,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (!mcatg_cname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const newCode = await GenNewCode(user_c, "tmib_mcatg");

    const sql = `INSERT INTO tmib_mcatg(id, mcatg_users, mcatg_bsins, mcatg_ccode, mcatg_cname, mcatg_crusr, mcatg_upusr)
    VALUES ($1, $2, $3, $4, $5, $6, $7)`;
    const params = [
      uuidv4(),
      user_c,
      user_b,
      newCode,
      mcatg_cname,
      user_s,
      user_s,
    ];

    await dbRun(sql, params, `create catgeory- ${user_c}`);
    res.json({
      success: true,
      message: `${mcatg_cname} - Created successfully.`,
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
      mcatg_users,
      mcatg_bsins,
      mcatg_ccode,
      mcatg_cname,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (!id || !mcatg_cname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql = `UPDATE tmib_mcatg
    SET mcatg_cname = $1,
    mcatg_upusr = $2,
    mcatg_updat = CURRENT_TIMESTAMP,
    mcatg_rvnmr = mcatg_rvnmr + 1
    WHERE id = $3`;
    const params = [mcatg_cname, user_s, id];

    await dbRun(sql, params, `update catgeory- ${user_c}`);
    res.json({
      success: true,
      message: `${mcatg_cname} - Updated successfully.`,
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
    const { id, mcatg_cname, mcatg_actve, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!id || !mcatg_cname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql = `UPDATE tmib_mcatg
    SET mcatg_actve = NOT mcatg_actve,
    mcatg_upusr = $1,
    mcatg_updat = CURRENT_TIMESTAMP,
    mcatg_rvnmr = mcatg_rvnmr + 1
    WHERE id = $2`;
    const params = [user_s, id];

    await dbRun(sql, params, `delete catgeory- ${user_c}`);
    res.json({
      success: true,
      message: `${mcatg_cname} - ${mcatg_actve ? "Deactivate" : "Activate"} successfully.`,
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
