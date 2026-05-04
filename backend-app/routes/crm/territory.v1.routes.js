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
        data: null,
      });
    }

    //database action
    const sql = `SELECT ta.*, ta.tarea_tname, dzn.dzone_dname, 
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
      data: null,
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
        data: null,
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
      data: null,
    });
  }
});

const create = async (req, res) => {
  try {
    const {
      id,
      tarea_apusr,
      tarea_bsins,
      tarea_dzone,
      tarea_tcode,
      tarea_tname,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (!tarea_dzone || !tarea_tname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: null,
      });
    }

    //database action
    const newCode = await GenNewCode(user_c, "tmcb_tarea");

    const sql = `INSERT INTO tmcb_tarea(id, tarea_apusr, tarea_bsins, tarea_dzone, tarea_tcode, tarea_tname, tarea_crusr, tarea_upusr)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
    const params = [
      uuidv4(),
      user_c,
      user_b,
      tarea_dzone,
      newCode,
      tarea_tname,
      user_s,
      user_s,
    ];

    await dbRun(sql, params, `create tarea- ${user_c}`);
    res.json({
      success: true,
      message: `${tarea_tname} - Created successfully.`,
      data: null,
    });
  } catch (error) {
    console.error("database action error:", error);
    return res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: null,
    });
  }
};

const update = async (req, res) => {
  try {
    const {
      id,
      tarea_apusr,
      tarea_bsins,
      tarea_dzone,
      tarea_tcode,
      tarea_tname,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !id ||
      !tarea_dzone ||
      !tarea_tcode ||
      !tarea_tname ||
      !user_s ||
      !user_c ||
      !user_b
    ) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmcb_tarea
    SET tarea_dzone = $1,
    tarea_tname = $2,
    tarea_crusr = $3,
    tarea_updat = CURRENT_TIMESTAMP,
    tarea_rvnmr = tarea_rvnmr + 1
    WHERE id = $4`;
    const params = [tarea_dzone, tarea_tname, user_s, id];

    await dbRun(sql, params, `update tarea- ${user_c}`);
    res.json({
      success: true,
      message: `${tarea_tname} - Updated successfully.`,
      data: null,
    });
  } catch (error) {
    console.error("database action error:", error);
    return res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: null,
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
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmcb_tarea
    SET tarea_actve = NOT tarea_actve,
    tarea_upusr = $1,
    tarea_updat = CURRENT_TIMESTAMP,
    tarea_rvnmr = tarea_rvnmr + 1
    WHERE id = $2`;
    const params = [user_s, id];

    await dbRun(sql, params, `delete dzone- ${user_c}`);
    res.json({
      success: true,
      message: `${tarea_tname} - ${tarea_actve ? "Deactivate" : "Activate"} successfully.`,
      data: null,
    });
  } catch (error) {
    console.error("database action error:", error);
    return res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: null,
    });
  }
});

// get by dzone
router.post("/get-by-dzone", async (req, res) => {
  try {
    const { id, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!muser_id || !user_c) {
      return res.json({
        success: false,
        message: "User ID and Country ID are required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT dzn.*, 0 as edit_stop
    FROM tmcb_tarea dzn
    WHERE dzn.dzone_cntry = $1
    AND dzn.dzone_actve = TRUE
    ORDER BY dzn.tarea_tname`;
    const params = [dzone_cntry];

    const rows = await dbGetAll(sql, params, `Get zones for ${dzone_cntry}`);
    res.json({
      success: true,
      message: "Zones fetched successfully",
      data: rows,
    });
  } catch (error) {
    console.error("database action error:", error);
    return res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: null,
    });
  }
});

module.exports = router;
