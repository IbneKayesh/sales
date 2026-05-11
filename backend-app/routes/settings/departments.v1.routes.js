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
    const sql = `SELECT dpart.*,
    csr.users_uname AS crusr_cname, usr.users_uname AS upusr_cname, 0 as edit_stop
    FROM tmnb_dpart dpart
    LEFT JOIN tmnb_users csr ON dpart.dpart_crusr = csr.id
    LEFT JOIN tmnb_users usr ON dpart.dpart_upusr = usr.id
    WHERE dpart.dpart_apusr = $1
    ORDER BY dpart.dpart_dname ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get department- ${user_c}`);
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
    const sql = `SELECT dpart.*, 0 as edit_stop
    FROM tmnb_dpart dpart
    WHERE dpart.dpart_apusr = $1
    AND dpart.dpart_actve = TRUE
    ORDER BY dpart.dpart_dname ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get department- ${user_c}`);
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
      dpart_apusr,
      dpart_bsins,
      dpart_dcode,
      dpart_dname,
      dpart_ofadr,
      dpart_emcap,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (!dpart_dname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const newCode = await GenNewCode(user_c, "tmnb_dpart");

    const sql = `INSERT INTO tmnb_dpart(id, dpart_apusr, dpart_bsins, dpart_dcode, dpart_dname, dpart_ofadr, dpart_emcap, dpart_crusr, dpart_upusr)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
    const params = [
      uuidv4(),
      user_c,
      user_b,
      newCode,
      dpart_dname,
      dpart_ofadr || "",
      dpart_emcap || 1,
      user_s,
      user_s,
    ];

    await dbRun(sql, params, `create department- ${user_c}`);
    res.json({
      success: true,
      message: `${dpart_dname} - Created successfully.`,
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
      dpart_apusr,
      dpart_bsins,
      dpart_dcode,
      dpart_dname,
      dpart_ofadr,
      dpart_emcap,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (!id || !dpart_dname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql = `UPDATE tmnb_dpart
    SET dpart_dname = $1,
    dpart_ofadr = $2,
    dpart_emcap = $3,
    dpart_upusr = $4,
    dpart_updat = CURRENT_TIMESTAMP,
    dpart_rvnmr = dpart_rvnmr + 1
    WHERE id = $5`;
    const params = [dpart_dname, dpart_ofadr, dpart_emcap, user_s, id];

    await dbRun(sql, params, `update department- ${user_c}`);
    res.json({
      success: true,
      message: `${dpart_dname} - Updated successfully.`,
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
    const { id, dpart_dname, dpart_actve, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!id || !dpart_dname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql = `UPDATE tmnb_dpart
    SET dpart_actve = NOT dpart_actve,
    dpart_upusr = $1,
    dpart_updat = CURRENT_TIMESTAMP,
    dpart_rvnmr = dpart_rvnmr + 1
    WHERE id = $2`;
    const params = [user_s, id];

    await dbRun(sql, params, `delete department- ${user_c}`);
    res.json({
      success: true,
      message: `${dpart_dname} - ${dpart_actve ? "Deactivate" : "Activate"} successfully.`,
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
