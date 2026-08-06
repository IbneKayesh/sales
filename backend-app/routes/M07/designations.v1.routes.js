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
    const sql = `SELECT dsg.*,
    dsp.desig_cname as desig_pname, 
    csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 as edit_stop
    FROM tmhb_desig dsg
    LEFT JOIN tmhb_desig dsp ON dsg.desig_desig = dsp.id
    LEFT JOIN tmhb_emply csr ON dsg.desig_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON dsg.desig_upusr = usr.id
    WHERE dsg.desig_users = $1
    ORDER BY dsg.desig_level ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get Designations- ${user_c}`);
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
    const sql = `SELECT dsg.*, 0 as edit_stop
    FROM tmhb_desig dsg
    WHERE dsg.desig_users = $1
    AND dsg.desig_actve = TRUE
    ORDER BY dsg.desig_level ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get Designations- ${user_c}`);
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
      desig_users,
      desig_bsins,
      desig_ccode,
      desig_cname,
      desig_level,
      desig_sname,
      desig_desig,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !desig_cname ||
      !desig_level ||
      !desig_sname ||
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
    const newCode = await GenNewCode(user_c, "tmhb_desig");

    const sql = `INSERT INTO tmhb_desig(id, desig_users, desig_bsins, desig_ccode, desig_cname, desig_level,
      desig_sname, desig_desig, desig_crusr, desig_upusr)
    VALUES ($1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10)`;
    const params = [
      uuidv4(),
      user_c,
      user_b,
      newCode,
      desig_cname,
      desig_level,
      desig_sname,
      desig_desig,
      user_s,
      user_s,
    ];

    await dbRun(sql, params, `create Designations- ${user_c}`);
    res.json({
      success: true,
      message: `${desig_cname} - Created successfully.`,
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
      desig_users,
      desig_bsins,
      desig_ccode,
      desig_cname,
      desig_level,
      desig_sname,
      desig_desig,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !desig_cname ||
      !desig_level ||
      !desig_sname ||
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
    const sql = `UPDATE tmhb_desig
    SET desig_cname = $1,
    desig_level = $2,
    desig_sname = $3,
    desig_desig = $4,
    desig_upusr = $5,
    desig_updat = CURRENT_TIMESTAMP,
    desig_rvnmr = desig_rvnmr + 1
    WHERE id = $6`;
    const params = [
      desig_cname,
      desig_level,
      desig_sname,
      desig_desig,
      user_s,
      id,
    ];

    await dbRun(sql, params, `update Designations- ${user_c}`);
    res.json({
      success: true,
      message: `${desig_cname} - Updated successfully.`,
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
    const { id, desig_cname, desig_actve, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!id || !desig_cname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql = `UPDATE tmhb_desig
    SET desig_actve = NOT desig_actve,
    desig_upusr = $1,
    desig_updat = CURRENT_TIMESTAMP,
    desig_rvnmr = desig_rvnmr + 1
    WHERE id = $2`;
    const params = [user_s, id];

    await dbRun(sql, params, `delete Designations- ${user_c}`);
    res.json({
      success: true,
      message: `${desig_cname} - ${desig_actve ? "Deactivate" : "Activate"} successfully.`,
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
