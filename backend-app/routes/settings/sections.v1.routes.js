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
    const sql = `SELECT sectn.*,
    csr.users_uname AS crusr_cname, usr.users_uname AS upusr_cname, 0 as edit_stop,
    dpart.dpart_dname AS dpart_name
    FROM tmnb_sectn sectn
    LEFT JOIN tmnb_users csr ON sectn.sectn_crusr = csr.id
    LEFT JOIN tmnb_users usr ON sectn.sectn_upusr = usr.id
    LEFT JOIN tmnb_dpart dpart ON sectn.sectn_dpart = dpart.id
    WHERE sectn.sectn_apusr = $1
    ORDER BY sectn.sectn_sname ASC`;

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
    const sql = `SELECT sectn.*, 0 as edit_stop
    FROM tmnb_sectn sectn
    WHERE sectn.sectn_apusr = $1
    AND sectn.sectn_actve = TRUE
    ORDER BY sectn.sectn_sname ASC`;

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
      sectn_apusr,
      sectn_bsins,
      sectn_dpart,
      sectn_scode,
      sectn_sname,
      sectn_ofadr,
      sectn_emcap,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (!sectn_sname || !sectn_dpart || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const newCode = await GenNewCode(user_c, "tmnb_sectn");

    const sql = `INSERT INTO tmnb_sectn(id, sectn_apusr, sectn_bsins, sectn_dpart, sectn_scode, sectn_sname, sectn_ofadr, sectn_emcap, sectn_crusr, sectn_upusr)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
    const params = [
      uuidv4(),
      user_c,
      user_b,
      sectn_dpart,
      newCode,
      sectn_sname,
      sectn_ofadr || "",
      sectn_emcap || 1,
      user_s,
      user_s,
    ];

    await dbRun(sql, params, `create section- ${user_c}`);
    res.json({
      success: true,
      message: `${sectn_sname} - Created successfully.`,
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
      sectn_apusr,
      sectn_bsins,
      sectn_dpart,
      sectn_scode,
      sectn_sname,
      sectn_ofadr,
      sectn_emcap,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (!id || !sectn_sname || !sectn_dpart || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql = `UPDATE tmnb_sectn
    SET sectn_sname = $1,
    sectn_dpart = $2,
    sectn_ofadr = $3,
    sectn_emcap = $4,
    sectn_upusr = $5,
    sectn_updat = CURRENT_TIMESTAMP,
    sectn_rvnmr = sectn_rvnmr + 1
    WHERE id = $6`;
    const params = [sectn_sname, sectn_dpart, sectn_ofadr, sectn_emcap, user_s, id];

    await dbRun(sql, params, `update section- ${user_c}`);
    res.json({
      success: true,
      message: `${sectn_sname} - Updated successfully.`,
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
    const { id, sectn_sname, sectn_actve, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!id || !sectn_sname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql = `UPDATE tmnb_sectn
    SET sectn_actve = NOT sectn_actve,
    sectn_upusr = $1,
    sectn_updat = CURRENT_TIMESTAMP,
    sectn_rvnmr = sectn_rvnmr + 1
    WHERE id = $2`;
    const params = [user_s, id];

    await dbRun(sql, params, `delete section- ${user_c}`);
    res.json({
      success: true,
      message: `${sectn_sname} - ${sectn_actve ? "Deactivate" : "Activate"} successfully.`,
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
