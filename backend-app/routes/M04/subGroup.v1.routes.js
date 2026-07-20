const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");
const { GenNewCode } = require("../../db/genHelper");

// get all
router.post("/", async (req, res) => {
  try {
    const { sgrup_mgrup, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!sgrup_mgrup || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT sgrp.*,
    csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 as edit_stop
    FROM tmib_sgrup sgrp
    LEFT JOIN tmhb_emply csr ON sgrp.sgrup_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON sgrp.sgrup_upusr = usr.id
    WHERE sgrp.sgrup_users = $1
    AND sgrp.sgrup_mgrup = $2
    ORDER BY sgrp.sgrup_cname ASC`;

    const params = [user_c, sgrup_mgrup];
    const rows = await dbGetAll(sql, params, `get sub group- ${user_c}`);
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
    const sql = `SELECT sgrp.*, 0 as edit_stop
    FROM tmib_sgrup sgrp
    WHERE sgrp.sgrup_users = $1
    AND sgrp.sgrup_actve = TRUE
    ORDER BY sgrp.sgrup_cname ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get sub group- ${user_c}`);
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
      sgrup_users,
      sgrup_bsins,
      sgrup_ccode,
      sgrup_mgrup,
      sgrup_cname,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (!sgrup_mgrup || !sgrup_cname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const newCode = await GenNewCode(user_c, "tmib_sgrup");

    const sql = `INSERT INTO tmib_sgrup(id, sgrup_users, sgrup_bsins, sgrup_ccode, sgrup_mgrup, sgrup_cname, sgrup_crusr, sgrup_upusr)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
    const params = [
      uuidv4(),
      user_c,
      user_b,
      newCode,
      sgrup_mgrup,
      sgrup_cname,
      user_s,
      user_s,
    ];

    await dbRun(sql, params, `create sub group- ${user_c}`);
    res.json({
      success: true,
      message: `${sgrup_cname} - Created successfully.`,
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
      sgrup_users,
      sgrup_bsins,
      sgrup_ccode,
      sgrup_mgrup,
      sgrup_cname,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (!id || !sgrup_mgrup || !sgrup_cname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql = `UPDATE tmib_sgrup
    SET sgrup_cname = $1,
    sgrup_upusr = $2,
    sgrup_updat = CURRENT_TIMESTAMP,
    sgrup_rvnmr = sgrup_rvnmr + 1
    WHERE id = $3`;
    const params = [sgrup_cname, user_s, id];

    await dbRun(sql, params, `update sub group- ${user_c}`);
    res.json({
      success: true,
      message: `${sgrup_cname} - Updated successfully.`,
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
    const { id, sgrup_cname, sgrup_actve, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!id || !sgrup_cname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql = `UPDATE tmib_sgrup
    SET sgrup_actve = NOT sgrup_actve,
    sgrup_upusr = $1,
    sgrup_updat = CURRENT_TIMESTAMP,
    sgrup_rvnmr = sgrup_rvnmr + 1
    WHERE id = $2`;
    const params = [user_s, id];

    await dbRun(sql, params, `delete sub group- ${user_c}`);
    res.json({
      success: true,
      message: `${sgrup_cname} - ${sgrup_actve ? "Deactivate" : "Activate"} successfully.`,
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
