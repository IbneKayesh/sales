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
    const sql = `SELECT try.*, ta.tarea_tname, dzn.dzone_dname, 
    csr.users_uname AS crusr_cname, usr.users_uname AS upusr_cname, 0 as edit_stop
    FROM tmcb_trtry try
    LEFT JOIN tmcb_tarea ta ON try.trtry_tarea = ta.id
    LEFT JOIN tmcb_dzone dzn ON ta.tarea_dzone = dzn.id
    LEFT JOIN tmnb_users csr ON try.trtry_crusr = csr.id
    LEFT JOIN tmnb_users usr ON try.trtry_upusr = usr.id
    WHERE try.trtry_apusr = $1
    ORDER BY try.trtry_wname ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get territory- ${user_c}`);
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
    const sql = `SELECT ta.*, 0 as edit_stop
    FROM tmcb_tarea ta
    WHERE ta.tarea_apusr = $1
    AND ta.tarea_actve = TRUE
    ORDER BY ta.tarea_tname ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get tarea- ${user_c}`);
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
      trtry_apusr,
      trtry_bsins,
      trtry_tarea,
      trtry_wcode,
      trtry_wname,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (!trtry_tarea || !trtry_wname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const newCode = await GenNewCode(user_c, "tmcb_trtry");

    const sql = `INSERT INTO tmcb_trtry(id, trtry_apusr, trtry_bsins, trtry_tarea, trtry_wcode, trtry_wname, trtry_crusr, trtry_upusr)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
    const params = [
      uuidv4(),
      user_c,
      user_b,
      trtry_tarea,
      newCode,
      trtry_wname,
      user_s,
      user_s,
    ];

    await dbRun(sql, params, `create territory- ${user_c}`);
    res.json({
      success: true,
      message: `${trtry_wname} - Created successfully.`,
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
      trtry_apusr,
      trtry_bsins,
      trtry_tarea,
      trtry_wcode,
      trtry_wname,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (!trtry_tarea || !trtry_wname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql = `UPDATE tmcb_trtry
    SET trtry_tarea = $1,
    trtry_wname = $2,
    trtry_upusr = $3,
    trtry_updat = CURRENT_TIMESTAMP,
    trtry_rvnmr = trtry_rvnmr + 1
    WHERE id = $4`;
    const params = [trtry_tarea, trtry_wname, user_s, id];

    await dbRun(sql, params, `update territory- ${user_c}`);
    res.json({
      success: true,
      message: `${trtry_wname} - Updated successfully.`,
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
    const { id, tarea_tname, tarea_actve, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!id || !tarea_tname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql = `UPDATE tmcb_trtry
    SET trtry_actve = NOT trtry_actve,
    trtry_upusr = $1,
    trtry_updat = CURRENT_TIMESTAMP,
    trtry_rvnmr = trtry_rvnmr + 1
    WHERE id = $2`;
    const params = [user_s, id];

    await dbRun(sql, params, `delete territory- ${user_c}`);
    res.json({
      success: true,
      message: `${tarea_tname} - ${tarea_actve ? "Deactivate" : "Activate"} successfully.`,
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

// get by tarea
router.post("/get-by-tarea", async (req, res) => {
  try {
    const { trtry_tarea, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT ta.*, 0 as edit_stop
    FROM tmcb_trtry ta
    WHERE ta.trtry_apusr = $1
    AND ta.trtry_tarea = $2
    AND ta.trtry_actve = TRUE
    ORDER BY ta.trtry_wname ASC`;

    const params = [user_c, trtry_tarea];
    const rows = await dbGetAll(sql, params, `get territory- ${user_c}`);
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

module.exports = router;
