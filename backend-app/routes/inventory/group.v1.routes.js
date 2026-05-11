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
    const sql = `SELECT mgrp.*,
    csr.users_uname AS crusr_cname, usr.users_uname AS upusr_cname, 0 as edit_stop
    FROM tmib_mgrup mgrp
    LEFT JOIN tmnb_users csr ON mgrp.mgrup_crusr = csr.id
    LEFT JOIN tmnb_users usr ON mgrp.mgrup_upusr = usr.id
    WHERE mgrp.mgrup_apusr = $1
    ORDER BY mgrp.mgrup_mname ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get group- ${user_c}`);
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
    const sql = `SELECT mgrp.*, 0 as edit_stop
    FROM tmib_mgrup mgrp
    WHERE mgrp.mgrup_apusr = $1
    AND mgrp.mgrup_actve = TRUE
    ORDER BY mgrp.mgrup_mname ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get group- ${user_c}`);
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
      mgrup_apusr,
      mgrup_bsins,
      mgrup_mcode,
      mgrup_mname,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (!mgrup_mname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const newCode = await GenNewCode(user_c, "tmib_mgrup");

    const sql = `INSERT INTO tmib_mgrup(id, mgrup_apusr, mgrup_bsins, mgrup_mcode, mgrup_mname, mgrup_crusr, mgrup_upusr)
    VALUES ($1, $2, $3, $4, $5, $6, $7)`;
    const params = [
      uuidv4(),
      user_c,
      user_b,
      newCode,
      mgrup_mname,
      user_s,
      user_s,
    ];

    await dbRun(sql, params, `create group- ${user_c}`);
    res.json({
      success: true,
      message: `${mgrup_mname} - Created successfully.`,
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
      mgrup_apusr,
      mgrup_bsins,
      mgrup_mcode,
      mgrup_mname,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (!id || !mgrup_mname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql = `UPDATE tmib_mgrup
    SET mgrup_mname = $1,
    mgrup_upusr = $2,
    mgrup_updat = CURRENT_TIMESTAMP,
    mgrup_rvnmr = mgrup_rvnmr + 1
    WHERE id = $3`;
    const params = [mgrup_mname, user_s, id];

    await dbRun(sql, params, `update group- ${user_c}`);
    res.json({
      success: true,
      message: `${mgrup_mname} - Updated successfully.`,
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
    const { id, mgrup_mname, mgrup_actve, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!id || !mgrup_mname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql = `UPDATE tmib_mgrup
    SET mgrup_actve = NOT mgrup_actve,
    mgrup_upusr = $1,
    mgrup_updat = CURRENT_TIMESTAMP,
    mgrup_rvnmr = mgrup_rvnmr + 1
    WHERE id = $2`;
    const params = [user_s, id];

    await dbRun(sql, params, `delete group- ${user_c}`);
    res.json({
      success: true,
      message: `${mgrup_mname} - ${mgrup_actve ? "Deactivate" : "Activate"} successfully.`,
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
