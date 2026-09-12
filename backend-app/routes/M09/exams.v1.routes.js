const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");
const { GenNewCode } = require("../../db/genHelper");

// get all
router.post("/", async (req, res) => {
  try {
    const { user_s, user_c, user_b } = req.body;

    if (!user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    const sql = `SELECT exm.*, tch.teach_cname AS teach_cname_ref,
    csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 as edit_stop
    FROM tmsb_exams exm
    LEFT JOIN tmsb_teach tch ON exm.exams_teach = tch.id
    LEFT JOIN tmhb_emply csr ON exm.exams_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON exm.exams_upusr = usr.id
    WHERE exm.exams_users = $1
    ORDER BY exm.exams_crdat DESC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get exams- ${user_c}`);
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

    if (!user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    const sql = `SELECT exm.*, tch.teach_cname AS teach_cname_ref, 0 as edit_stop
    FROM tmsb_exams exm
    LEFT JOIN tmsb_teach tch ON exm.exams_teach = tch.id
    WHERE exm.exams_users = $1
    AND exm.exams_actve = TRUE
    ORDER BY exm.exams_crdat DESC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get exams- ${user_c}`);
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
      exams_users,
      exams_bsins,
      exams_ccode,
      exams_srial,
      exams_teach,
      exams_cname,
      exams_answr,
      exams_notes,
      exams_marks,
      exams_stats,
      exams_actve,
      user_s,
      user_c,
      user_b,
    } = req.body;

    if (
      !exams_users ||
      !exams_bsins ||
      !exams_srial ||
      !exams_teach ||
      !exams_cname ||
      !exams_marks ||
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

    const newCode = await GenNewCode(user_c, "tmsb_exams");
    const scripts = [];
    scripts.push({
      sql: `INSERT INTO tmsb_exams(id, exams_users, exams_bsins, exams_ccode, exams_srial, exams_teach,
      exams_cname, exams_answr, exams_notes, exams_marks, exams_stats, exams_actve,
      exams_crusr, exams_upusr)
      VALUES ($1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11, $12,
      $13, $14)`,
      params: [
        uuidv4(),
        user_c,
        user_b,
        newCode,
        exams_srial,
        exams_teach,
        exams_cname,
        exams_answr || null,
        exams_notes || null,
        exams_marks,
        exams_stats ?? false,
        exams_actve ?? true,
        user_s,
        user_s,
      ],
      label: `create exams- ${user_c}`,
    });

    await dbRunAll(scripts);
    res.json({
      success: true,
      message: `${newCode} - Created successfully.`,
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
      exams_users,
      exams_bsins,
      exams_ccode,
      exams_srial,
      exams_teach,
      exams_cname,
      exams_answr,
      exams_notes,
      exams_marks,
      exams_stats,
      user_s,
      user_c,
      user_b,
    } = req.body;

    if (
      !id ||
      !exams_users ||
      !exams_bsins ||
      !exams_srial ||
      !exams_teach ||
      !exams_cname ||
      !exams_marks ||
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

    const sql = `UPDATE tmsb_exams
    SET exams_srial = $1,
    exams_teach = $2,
    exams_cname = $3,
    exams_answr = $4,
    exams_notes = $5,
    exams_marks = $6,
    exams_stats = $7,
    exams_upusr = $8,
    exams_updat = CURRENT_TIMESTAMP,
    exams_rvnmr = exams_rvnmr + 1
    WHERE id = $9`;
    const params = [
      exams_srial,
      exams_teach,
      exams_cname,
      exams_answr || null,
      exams_notes || null,
      exams_marks,
      exams_stats ?? false,
      user_s,
      id,
    ];

    await dbRun(sql, params, `update exams- ${user_c}`);
    res.json({
      success: true,
      message: `${exams_cname} - Updated successfully.`,
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
    const { id, exams_cname, exams_actve, user_s, user_c, user_b } = req.body;

    if (!id || !exams_cname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    const sql = `UPDATE tmsb_exams
    SET exams_actve = NOT exams_actve,
    exams_upusr = $1,
    exams_updat = CURRENT_TIMESTAMP,
    exams_rvnmr = exams_rvnmr + 1
    WHERE id = $2`;
    const params = [user_s, id];

    await dbRun(sql, params, `delete exams- ${user_c}`);
    res.json({
      success: true,
      message: `${exams_cname} - ${exams_actve ? "Deactivate" : "Activate"} successfully.`,
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
