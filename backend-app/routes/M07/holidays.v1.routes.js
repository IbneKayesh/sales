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
    const sql = `SELECT hdy.*,
    csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 as edit_stop
    FROM tmhb_hlday hdy
    LEFT JOIN tmhb_emply csr ON hdy.hlday_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON hdy.hlday_upusr = usr.id
    WHERE hdy.hlday_users = $1
    ORDER BY hdy.hlday_cname ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get Holiday- ${user_c}`);
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
    const sql = `SELECT hdy.*, 0 as edit_stop
    FROM tmhb_hlday hdy
    WHERE hdy.hlday_users = $1
    AND hdy.hlday_actve = TRUE
    ORDER BY hdy.hlday_cname ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get Holiday- ${user_c}`);
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
      hlday_users,
      hlday_bsins,
      hlday_ccode,
      hlday_yerid,
      hlday_hldat,
      hlday_cname,
      hlday_notes,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !hlday_yerid ||
      !hlday_hldat ||
      !hlday_cname ||
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
    const newCode = await GenNewCode(user_c, "tmhb_hlday");

    const sql = `INSERT INTO tmhb_hlday(id, hlday_users, hlday_bsins, hlday_ccode, hlday_yerid, hlday_hldat,
      hlday_cname, hlday_notes, hlday_crusr, hlday_upusr)
    VALUES ($1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10)`;
    const params = [
      uuidv4(),
      user_c,
      user_b,
      newCode,
      hlday_yerid,
      hlday_hldat,
      hlday_cname,
      hlday_notes,
      user_s,
      user_s,
    ];

    await dbRun(sql, params, `create Holiday- ${user_c}`);
    res.json({
      success: true,
      message: `${hlday_cname} - Created successfully.`,
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
      hlday_users,
      hlday_bsins,
      hlday_ccode,
      hlday_yerid,
      hlday_hldat,
      hlday_cname,
      hlday_notes,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !hlday_yerid ||
      !hlday_hldat ||
      !hlday_cname ||
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
    const sql = `UPDATE tmhb_hlday
    SET hlday_yerid = $1,
    hlday_hldat = $2,
    hlday_cname = $3,
    hlday_notes = $4,    
    hlday_upusr = $5,
    hlday_updat = CURRENT_TIMESTAMP,
    hlday_rvnmr = hlday_rvnmr + 1
    WHERE id = $6`;
    const params = [
      hlday_yerid,
      hlday_hldat,
      hlday_cname,
      hlday_notes,
      user_s,
      id,
    ];

    await dbRun(sql, params, `update Holiday- ${user_c}`);
    res.json({
      success: true,
      message: `${hlday_cname} - Updated successfully.`,
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
    const { id, hlday_cname, hlday_actve, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!id || !hlday_cname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql = `UPDATE tmhb_hlday
    SET hlday_actve = NOT hlday_actve,
    hlday_upusr = $1,
    hlday_updat = CURRENT_TIMESTAMP,
    hlday_rvnmr = hlday_rvnmr + 1
    WHERE id = $2`;
    const params = [user_s, id];

    await dbRun(sql, params, `delete Holiday- ${user_c}`);
    res.json({
      success: true,
      message: `${hlday_cname} - ${hlday_actve ? "Deactivate" : "Activate"} successfully.`,
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
