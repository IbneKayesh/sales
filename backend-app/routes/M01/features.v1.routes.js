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
    const sql = `SELECT sct.*, dpt.dpart_cname,
    csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 as edit_stop
    FROM tmsb_sectn sct
    LEFT JOIN tmsb_dpart dpt ON sct.sectn_dpart = dpt.id
    LEFT JOIN tmhb_emply csr ON sct.sectn_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON sct.sectn_upusr = usr.id
    WHERE sct.sectn_users = $1
    ORDER BY sct.sectn_cname ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get section- ${user_c}`);
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
    const sql = `SELECT sct.*, 0 as edit_stop
    FROM tmsb_sectn sct
    WHERE sct.sectn_users = $1
    AND sct.sectn_actve = TRUE
    ORDER BY sct.sectn_cname ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get section- ${user_c}`);
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
      sectn_users,
      sectn_bsins,
      sectn_ccode,
      sectn_dpart,
      sectn_cname,
      sectn_ofadr,
      sectn_emcap,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (!sectn_dpart || !sectn_cname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const newCode = await GenNewCode(user_c, "tmsb_sectn");

    const sql = `INSERT INTO tmsb_sectn(id, sectn_users, sectn_bsins, sectn_ccode, sectn_dpart, sectn_cname, sectn_ofadr, sectn_emcap, sectn_crusr, sectn_upusr)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
    const params = [
      uuidv4(),
      user_c,
      user_b,
      newCode,
      sectn_dpart,
      sectn_cname,
      sectn_ofadr || "",
      sectn_emcap || 1,
      user_s,
      user_s,
    ];

    await dbRun(sql, params, `create section- ${user_c}`);
    res.json({
      success: true,
      message: `${sectn_cname} - Created successfully.`,
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
      sectn_users,
      sectn_bsins,
      sectn_ccode,
      sectn_dpart,
      sectn_cname,
      sectn_ofadr,
      sectn_emcap,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (!sectn_dpart || !sectn_cname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql = `UPDATE tmsb_sectn
    SET sectn_cname = $1,
    sectn_ofadr = $2,
    sectn_emcap = $3,
    sectn_upusr = $4,
    sectn_updat = CURRENT_TIMESTAMP,
    sectn_rvnmr = sectn_rvnmr + 1
    WHERE id = $5`;
    const params = [
      sectn_cname,
      sectn_ofadr,
      sectn_emcap,
      user_s,
      id,
    ];

    await dbRun(sql, params, `update section- ${user_c}`);
    res.json({
      success: true,
      message: `${sectn_cname} - Updated successfully.`,
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
    const { id, sectn_cname, sectn_actve, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!id || !sectn_cname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql = `UPDATE tmsb_sectn
    SET sectn_actve = NOT sectn_actve,
    sectn_upusr = $1,
    sectn_updat = CURRENT_TIMESTAMP,
    sectn_rvnmr = sectn_rvnmr + 1
    WHERE id = $2`;
    const params = [user_s, id];

    await dbRun(sql, params, `delete section- ${user_c}`);
    res.json({
      success: true,
      message: `${sectn_cname} - ${sectn_actve ? "Deactivate" : "Activate"} successfully.`,
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
