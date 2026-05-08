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
        data: [],
      });
    }

    //database action
    const sql = `SELECT achd.*,
    csr.users_uname AS crusr_cname, usr.users_uname AS upusr_cname, 0 as edit_stop
    FROM tmtb_ached achd
    LEFT JOIN tmnb_users csr ON achd.ached_crusr = csr.id
    LEFT JOIN tmnb_users usr ON achd.ached_upusr = usr.id
    WHERE achd.ached_apusr = $1
    ORDER BY achd.ached_hedno ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get account heads- ${user_c}`);
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
    const sql = `SELECT achd.*, 0 as edit_stop
    FROM tmtb_ached achd
    WHERE achd.ached_apusr = $1
    AND achd.ached_actve = TRUE
    ORDER BY achd.ached_hname ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get account heads- ${user_c}`);
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
      ached_apusr,
      ached_bsins,
      ached_ached,
      ached_hcode,
      ached_hname,
      ached_htype,
      ached_hedno,
      ached_child,
      ached_alpst,
      ached_level,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !ached_ached ||
      !ached_hname ||
      !ached_htype ||
      !ached_hedno ||
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
    const ached_child_new = ached_ached === "-" ? false : true;
    const ached_level_new = ached_ached === "-" ? 0 : 1;
    const newCode = await GenNewCode(user_c, "tmtb_ached");

    const sql_sequence = `SELECT shtbl_value FROM tmnb_shtbl WHERE shtbl_gname = $1 AND shtbl_dvalu = $2`;
    const row_sequence = await dbGet(
      sql_sequence,
      [ached_htype, ached_htype],
      `get account heads- ${user_c}`,
    );

    if (!row_sequence) {
      return res.json({
        success: false,
        message: "No range setup for this account type.",
        data: {},
      });
    }

    const sql_sl = `SELECT COUNT(id) AS last_no FROM tmtb_ached WHERE ached_htype = $1`;
    const row_sl = await dbGet(
      sql_sl,
      [ached_htype],
      `get account heads- ${user_c}`,
    );

    //console.log(row_sequence, row_sl);

    const ached_hedno_new =
      Number(row_sequence.shtbl_value) + Number(row_sl?.last_no || 0);

    const sql = `INSERT INTO tmtb_ached(id, ached_apusr, ached_bsins, ached_ached, ached_hcode, ached_hname,
    ached_htype, ached_hedno, ached_child, ached_alpst, ached_level, ached_crusr, ached_upusr)
    VALUES ($1, $2, $3, $4, $5, $6,
    $7, $8, $9, $10, $11, $12, $13)`;
    const params = [
      uuidv4(),
      user_c,
      user_b,
      ached_ached,
      newCode,
      ached_hname,
      ached_htype,
      ached_hedno_new,
      ached_child_new,
      ached_alpst,
      ached_level_new,
      user_s,
      user_s,
    ];

    //console.log("params", params);

    await dbRun(sql, params, `create account heads- ${user_c}`);
    res.json({
      success: true,
      message: `${ached_hname} - Created successfully.`,
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
      ached_apusr,
      ached_bsins,
      ached_ached,
      ached_hcode,
      ached_hname,
      ached_htype,
      ached_hedno,
      ached_child,
      ached_alpst,
      ached_level,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !ached_ached ||
      !ached_hname ||
      !ached_htype ||
      !ached_hedno ||
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
    const sql = `UPDATE tmtb_ached
    SET ached_ached = $1,
    ached_hname = $2,
    ached_htype = $3,
    ached_alpst = $4,
    ached_upusr = $5,
    ached_updat = CURRENT_TIMESTAMP,
    ached_rvnmr = ached_rvnmr + 1
    WHERE id = $6`;
    const params = [
      ached_ached,
      ached_hname,
      ached_htype,
      ached_alpst,
      user_s,
      id,
    ];

    await dbRun(sql, params, `update account heads- ${user_c}`);
    res.json({
      success: true,
      message: `${ached_hname} - Updated successfully.`,
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
    const { id, ached_hname, ached_actve, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!id || !ached_hname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql = `UPDATE tmtb_ached
    SET ached_actve = NOT ached_actve,
    ached_upusr = $1,
    dzone_updat = CURRENT_TIMESTAMP,
    ached_rvnmr = ached_rvnmr + 1
    WHERE id = $2`;
    const params = [user_s, id];

    await dbRun(sql, params, `delete account heads- ${user_c}`);
    res.json({
      success: true,
      message: `${ached_hname} - ${ached_actve ? "Deactivate" : "Activate"} successfully.`,
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
