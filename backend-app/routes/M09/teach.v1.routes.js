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

    const sql = `SELECT tch.*, csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 as edit_stop
    FROM tmsb_teach tch
    LEFT JOIN tmhb_emply csr ON tch.teach_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON tch.teach_upusr = usr.id
    WHERE tch.teach_users = $1
    ORDER BY tch.teach_crdat DESC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get teach- ${user_c}`);
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

    const sql = `SELECT tch.*, 0 as edit_stop
    FROM tmsb_teach tch
    WHERE tch.teach_users = $1
    AND tch.teach_actve = TRUE
    ORDER BY tch.teach_crdat DESC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get teach- ${user_c}`);
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
      teach_users,
      teach_bsins,
      teach_ccode,
      teach_srial,
      teach_teach,
      teach_cname,
      teach_descr,
      teach_notes,
      teach_ttype,
      teach_tagno,
      teach_marks,
      teach_stats,
      teach_actve,
      user_s,
      user_c,
      user_b,
    } = req.body;

    if (
      !teach_users ||
      !teach_bsins ||
      !teach_srial ||
      !teach_cname ||
      !teach_marks ||
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

    const newCode = await GenNewCode(user_c, "tmsb_teach");
    const scripts = [];
    scripts.push({
      sql: `INSERT INTO tmsb_teach(id, teach_users, teach_bsins, teach_ccode, teach_srial, teach_teach,
      teach_cname, teach_descr, teach_notes, teach_ttype, teach_tagno, teach_marks, teach_stats, teach_actve,
      teach_crusr, teach_upusr)
      VALUES ($1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11, $12, $13, $14,
      $15, $16)`,
      params: [
        uuidv4(),
        user_c,
        user_b,
        newCode,
        teach_srial,
        teach_teach || null,
        teach_cname,
        teach_descr || null,
        teach_notes || null,
        teach_ttype || null,
        teach_tagno || null,
        teach_marks,
        teach_stats ?? false,
        teach_actve ?? true,
        user_s,
        user_s,
      ],
      label: `create teach- ${user_c}`,
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
      teach_users,
      teach_bsins,
      teach_ccode,
      teach_srial,
      teach_teach,
      teach_cname,
      teach_descr,
      teach_notes,
      teach_ttype,
      teach_tagno,
      teach_marks,
      teach_stats,
      user_s,
      user_c,
      user_b,
    } = req.body;

    if (
      !id ||
      !teach_users ||
      !teach_bsins ||
      !teach_srial ||
      !teach_cname ||
      !teach_marks ||
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

    const sql = `UPDATE tmsb_teach
    SET teach_srial = $1,
    teach_teach = $2,
    teach_cname = $3,
    teach_descr = $4,
    teach_notes = $5,
    teach_ttype = $6,
    teach_tagno = $7,
    teach_marks = $8,
    teach_stats = $9,
    teach_upusr = $10,
    teach_updat = CURRENT_TIMESTAMP,
    teach_rvnmr = teach_rvnmr + 1
    WHERE id = $11`;
    const params = [
      teach_srial,
      teach_teach || null,
      teach_cname,
      teach_descr || null,
      teach_notes || null,
      teach_ttype || null,
      teach_tagno || null,
      teach_marks,
      teach_stats ?? false,
      user_s,
      id,
    ];

    await dbRun(sql, params, `update teach- ${user_c}`);
    res.json({
      success: true,
      message: `${teach_cname} - Updated successfully.`,
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
    const { id, teach_cname, teach_actve, user_s, user_c, user_b } = req.body;

    if (!id || !teach_cname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    const sql = `UPDATE tmsb_teach
    SET teach_actve = NOT teach_actve,
    teach_upusr = $1,
    teach_updat = CURRENT_TIMESTAMP,
    teach_rvnmr = teach_rvnmr + 1
    WHERE id = $2`;
    const params = [user_s, id];

    await dbRun(sql, params, `delete teach- ${user_c}`);
    res.json({
      success: true,
      message: `${teach_cname} - ${teach_actve ? "Deactivate" : "Activate"} successfully.`,
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
