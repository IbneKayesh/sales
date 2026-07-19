const express = require("express");
const router = express.Router();
const { dbGetAll, dbRun } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");
const { GenNewCode } = require("../../db/genHelper");

// =====================
// Get All
// =====================
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

    const sql = `
      SELECT pd.*,
             csr.emply_cname AS crusr_cname,
             usr.emply_cname AS upusr_cname,
             0 AS edit_stop
      FROM tmmb_prods pd
      LEFT JOIN tmhb_emply csr ON pd.prods_crusr = csr.id
      LEFT JOIN tmhb_emply usr ON pd.prods_upusr = usr.id
      WHERE pd.prods_users = $1
      ORDER BY pd.prods_prono, pd.prods_cname`;

    const rows = await dbGetAll(sql, [user_c], `Get Production - ${user_c}`);

    res.json({
      success: true,
      message: "Query executed successfully.",
      data: rows,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: [],
    });
  }
});

// =====================
// Get Active
// =====================
router.post("/get-all-active", async (req, res) => {
  try {
    const { user_c } = req.body;

    if (!user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    const sql = `
      SELECT pd.*,0 AS edit_stop
      FROM tmmb_prods pd
      WHERE pd.prods_users = $1
      AND pd.prods_actve = TRUE
      ORDER BY pd.prods_cname ASC`;

    const rows = await dbGetAll(
      sql,
      [user_c],
      `Get Active Production - ${user_c}`,
    );

    res.json({
      success: true,
      message: "Query executed successfully.",
      data: rows,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: [],
    });
  }
});

// =====================
// Create
// =====================
const create = async (req, res) => {
  try {
    const {
      id,
      prods_users,
      prods_bsins,
      prods_ccode,
      prods_cname,
      prods_prono,
      user_s,
      user_c,
      user_b,
    } = req.body;

    if (!prods_cname || !prods_prono || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    const newCode = await GenNewCode(user_c, "tmmb_prods");

    const sql = `INSERT INTO tmmb_prods ( id, prods_users, prods_bsins, prods_ccode, prods_cname, prods_prono,
    prods_crusr, prods_upusr )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;

    const params = [
      uuidv4(),
      user_c,
      user_b,
      newCode,
      prods_cname,
      prods_prono,
      user_s,
      user_s,
    ];

    await dbRun(sql, params, `Create Production - ${user_c}`);

    res.json({
      success: true,
      message: `${prods_cname} - Created successfully.`,
      data: {},
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: {},
    });
  }
};

// =====================
// Update
// =====================
const update = async (req, res) => {
  try {
    const {
      id,
      prods_users,
      prods_bsins,
      prods_ccode,
      prods_cname,
      prods_prono,
      user_s,
      user_c,
      user_b,
    } = req.body;

    if (!prods_cname || !prods_prono || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    const sql = `
      UPDATE tmmb_prods
      SET
        prods_cname = $1,
        prods_prono = $2,
        prods_upusr = $3,
        prods_updat = CURRENT_TIMESTAMP,
        prods_rvnmr = prods_rvnmr + 1
      WHERE id = $4`;

    const params = [prods_cname, prods_prono, user_s, id];

    await dbRun(sql, params, `Update Production - ${user_c}`);

    res.json({
      success: true,
      message: `${prods_cname} - Updated successfully.`,
      data: {},
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: {},
    });
  }
};

// =====================
// Upsert
// =====================
router.post("/upsert", async (req, res) => {
  if (req.body.id) {
    return update(req, res);
  }
  return create(req, res);
});

// =====================
// Create
// =====================
router.post("/create", create);

// =====================
// Update
// =====================
router.post("/update", update);

// =====================
// Activate / Deactivate
// =====================
router.post("/delete", async (req, res) => {
  try {
    const { id, prods_cname, prods_actve, user_s, user_c, user_b } = req.body;

    if (!id || !prods_cname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    const sql = `
      UPDATE tmmb_prods
      SET
        prods_actve = NOT prods_actve,
        prods_upusr = $1,
        prods_updat = CURRENT_TIMESTAMP,
        prods_rvnmr = prods_rvnmr + 1
      WHERE id = $2`;

    await dbRun(sql, [user_s, id], `Delete Product - ${user_c}`);

    res.json({
      success: true,
      message: `${prods_cname} - ${
        prods_actve ? "Deactivate" : "Activate"
      } successfully.`,
      data: {},
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: {},
    });
  }
});

module.exports = router;
