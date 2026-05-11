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
    const sql = `SELECT sgrp.*, mctg.mgrup_mname,
    csr.users_uname AS crusr_cname, usr.users_uname AS upusr_cname, 0 as edit_stop
    FROM tmib_sgrup sgrp
    LEFT JOIN tmib_mgrup mctg ON sgrp.sgrup_mgrup = mctg.id
    LEFT JOIN tmnb_users csr ON sgrp.sgrup_crusr = csr.id
    LEFT JOIN tmnb_users usr ON sgrp.sgrup_upusr = usr.id
    WHERE sgrp.sgrup_apusr = $1
    ORDER BY sgrp.sgrup_sname ASC`;

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
    WHERE sgrp.sgrup_apusr = $1
    AND sgrp.sgrup_actve = TRUE
    ORDER BY sgrp.sgrup_sname ASC`;

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
      sgrup_apusr,
      sgrup_bsins,
      sgrup_mgrup,
      sgrup_scode,
      sgrup_sname,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (!sgrup_mgrup || !sgrup_sname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const newCode = await GenNewCode(user_c, "tmib_sgrup");

    const sql = `INSERT INTO tmib_sgrup(id, sgrup_apusr, sgrup_bsins, sgrup_mgrup, sgrup_scode, sgrup_sname, sgrup_crusr, sgrup_upusr)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
    const params = [
      uuidv4(),
      user_c,
      user_b,
      sgrup_mgrup,
      newCode,
      sgrup_sname,
      user_s,
      user_s,
    ];

    await dbRun(sql, params, `create sub group- ${user_c}`);
    res.json({
      success: true,
      message: `${sgrup_sname} - Created successfully.`,
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
      sgrup_apusr,
      sgrup_bsins,
      sgrup_mgrup,
      sgrup_scode,
      sgrup_sname,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (!id || !sgrup_mgrup || !sgrup_sname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql = `UPDATE tmib_sgrup
    SET sgrup_mgrup = $1,
    sgrup_sname = $2,
    sgrup_upusr = $3,
    sgrup_updat = CURRENT_TIMESTAMP,
    sgrup_rvnmr = sgrup_rvnmr + 1
    WHERE id = $4`;
    const params = [sgrup_mgrup, sgrup_sname, user_s, id];

    await dbRun(sql, params, `update sub group- ${user_c}`);
    res.json({
      success: true,
      message: `${sgrup_sname} - Updated successfully.`,
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
    const { id, sgrup_sname, sgrup_actve, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!id || !sgrup_sname || !user_s || !user_c || !user_b) {
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
      message: `${sgrup_sname} - ${sgrup_actve ? "Deactivate" : "Activate"} successfully.`,
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
