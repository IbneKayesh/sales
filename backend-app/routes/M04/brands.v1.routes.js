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
      SELECT brnd.*,
             csr.emply_cname AS crusr_cname,
             usr.emply_cname AS upusr_cname,
             0 AS edit_stop
      FROM tmib_brand brnd
      LEFT JOIN tmhb_emply csr ON brnd.brand_crusr = csr.id
      LEFT JOIN tmhb_emply usr ON brnd.brand_upusr = usr.id
      WHERE brnd.brand_users = $1
      ORDER BY brnd.brand_cname`;

    const rows = await dbGetAll(sql, [user_c], `Get Brand - ${user_c}`);

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
      SELECT brnd.*,0 AS edit_stop
      FROM tmib_brand brnd
      WHERE brnd.brand_users = $1
      AND brnd.brand_actve = TRUE
      ORDER BY brnd.brand_cname ASC`;

    const rows = await dbGetAll(
      sql,
      [user_c],
      `Get Active Brand - ${user_c}`,
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
      brand_users,
      brand_bsins,
      brand_ccode,
      brand_cntry,
      brand_cname,
      user_s,
      user_c,
      user_b,
    } = req.body;

    if (!brand_cntry || !brand_cname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    const newCode = await GenNewCode(user_c, "tmib_brand");

    const sql = `INSERT INTO tmib_brand ( id, brand_users, brand_bsins, brand_ccode, brand_cntry, brand_cname,
    brand_crusr, brand_upusr )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;

    const params = [
      uuidv4(),
      user_c,
      user_b,
      newCode,
      brand_cntry,
      brand_cname,
      user_s,
      user_s,
    ];

    await dbRun(sql, params, `Create Brand - ${user_c}`);

    res.json({
      success: true,
      message: `${brand_cname} - Created successfully.`,
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
      brand_users,
      brand_bsins,
      brand_ccode,
      brand_cntry,
      brand_cname,
      user_s,
      user_c,
      user_b,
    } = req.body;

    if (!brand_cntry || !brand_cname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    const sql = `
      UPDATE tmib_brand
      SET
        brand_cntry = $1,
        brand_cname = $2,
        brand_upusr = $3,
        brand_updat = CURRENT_TIMESTAMP,
        brand_rvnmr = brand_rvnmr + 1
      WHERE id = $4`;

    const params = [brand_cntry, brand_cname, user_s, id];

    await dbRun(sql, params, `Update Brand - ${user_c}`);

    res.json({
      success: true,
      message: `${brand_cname} - Updated successfully.`,
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
    const { id, brand_cname, brand_actve, user_s, user_c, user_b } = req.body;

    if (!id || !brand_cname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    const sql = `
      UPDATE tmib_brand
      SET
        brand_actve = NOT brand_actve,
        brand_upusr = $1,
        brand_updat = CURRENT_TIMESTAMP,
        brand_rvnmr = brand_rvnmr + 1
      WHERE id = $2`;

    await dbRun(sql, [user_s, id], `Delete Product - ${user_c}`);

    res.json({
      success: true,
      message: `${brand_cname} - ${
        brand_actve ? "Deactivate" : "Activate"
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
