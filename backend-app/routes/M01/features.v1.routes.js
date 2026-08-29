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
    const sql = `SELECT ftr.*,
    csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 as edit_stop
    FROM tmsb_fetur ftr
    LEFT JOIN tmhb_emply csr ON ftr.fetur_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON ftr.fetur_upusr = usr.id
    ORDER BY ftr.fetur_srial ASC`;

    const params = [];
    const rows = await dbGetAll(sql, params, `get feature- ${user_c}`);
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
    const sql = `SELECT ftr.*, 0 as edit_stop
    FROM tmsb_fetur ftr
    WHERE ftr.fetur_actve = TRUE
    ORDER BY ftr.fetur_srial ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get feature- ${user_c}`);
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
      fetur_srial,
      fetur_fetur,
      fetur_cname,
      fetur_descr,
      fetur_notes,
      fetur_stats,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !fetur_srial ||
      !fetur_fetur ||
      !fetur_cname ||
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

    const sql = `INSERT INTO tmsb_fetur(id, fetur_srial, fetur_fetur, fetur_cname, fetur_descr, fetur_notes,
    fetur_crusr, fetur_upusr)
    VALUES ($1, $2, $3, $4, $5, $6,
    $7, $8)`;
    const params = [
      uuidv4(),
      fetur_srial,
      fetur_fetur,
      fetur_cname,
      fetur_descr,
      fetur_notes,
      user_s,
      user_s,
    ];

    await dbRun(sql, params, `create feature- ${fetur_cname}`);
    res.json({
      success: true,
      message: `${fetur_cname} - Created successfully.`,
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
      fetur_srial,
      fetur_fetur,
      fetur_cname,
      fetur_descr,
      fetur_notes,
      fetur_stats,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !fetur_srial ||
      !fetur_fetur ||
      !fetur_cname ||
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
    const sql = `UPDATE tmsb_fetur
    SET fetur_srial = $1,
    fetur_fetur = $2,
    fetur_cname = $3,
    fetur_descr = $4,
    fetur_notes = $5,
    fetur_stats = $6,
    fetur_upusr = $7,
    fetur_updat = CURRENT_TIMESTAMP,
    fetur_rvnmr = fetur_rvnmr + 1
    WHERE id = $8`;
    const params = [
      fetur_srial,
      fetur_fetur,
      fetur_cname,
      fetur_descr,
      fetur_notes,
      fetur_stats,
      user_s,
      id,
    ];

    await dbRun(sql, params, `update feature- ${fetur_cname}`);
    res.json({
      success: true,
      message: `${fetur_cname} - Updated successfully.`,
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
    const { id, fetur_cname, fetur_actve, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!id || !fetur_cname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql = `UPDATE tmsb_fetur
    SET fetur_actve = NOT fetur_actve,
    fetur_upusr = $1,
    fetur_updat = CURRENT_TIMESTAMP,
    fetur_rvnmr = fetur_rvnmr + 1
    WHERE id = $2`;
    const params = [user_s, id];

    await dbRun(sql, params, `delete feature- ${fetur_cname}`);
    res.json({
      success: true,
      message: `${fetur_cname} - ${fetur_actve ? "Deactivate" : "Activate"} successfully.`,
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
