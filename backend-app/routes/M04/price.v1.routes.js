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
    const sql = `SELECT prce.*, itm.items_iname,
    csr.users_uname AS crusr_cname, usr.users_uname AS upusr_cname, 0 as edit_stop
    FROM tmib_price prce
    LEFT JOIN tmib_items itm ON prce.price_items = itm.id
    LEFT JOIN tmnb_users csr ON prce.price_crusr = csr.id
    LEFT JOIN tmnb_users usr ON prce.price_upusr = usr.id
    WHERE prce.price_users = $1
    ORDER BY itm.items_iname ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get price- ${user_c}`);
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
    const sql = `SELECT prce.*, itm.items_iname, 0 as edit_stop
    FROM tmib_price prce
    LEFT JOIN tmib_items itm ON prce.price_items = itm.id
    WHERE prce.price_users = $1
    AND prce.price_actve = TRUE
    ORDER BY itm.items_iname ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get price- ${user_c}`);
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
      price_users,
      price_bsins,
      price_ccode,
      price_items,
      price_cname,
      price_lprat,
      price_dprat,
      price_tprat,
      price_mrrat,
      price_dspct,
      price_gdstk,
      price_bdstk,
      price_mnqty,
      price_mxqty,
      price_pbqty,
      price_sbqty,
      price_notes,
      price_jnote,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (!price_items || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const newCode = await GenNewCode(user_c, "tmib_price");

    const sql = `INSERT INTO tmib_price(
      id, price_users, price_bsins, price_ccode, price_items, price_cname,
      price_lprat, price_dprat, price_tprat, price_mrrat, price_dspct, 
      price_gdstk, price_bdstk, price_mnqty, price_mxqty, price_pbqty, 
      price_sbqty, price_notes, price_jnote, 
      price_crusr, price_upusr
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)`;

    const params = [
      uuidv4(),
      user_c,
      user_b,
      newCode,
      price_items,
      price_cname,
      price_lprat || 0,
      price_dprat || 0,
      price_tprat || 0,
      price_mrrat || 0,
      price_dspct || 0,
      price_gdstk || 0,
      price_bdstk || 0,
      price_mnqty || 0,
      price_mxqty || 0,
      price_pbqty || 0,
      price_sbqty || 0,
      price_notes,
      price_jnote,
      user_s,
      user_s,
    ];

    await dbRun(sql, params, `create price- ${user_c}`);
    res.json({
      success: true,
      message: `Price - ${price_cname} Created successfully.`,
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
      price_users,
      price_bsins,
      price_ccode,
      price_items,
      price_cname,
      price_lprat,
      price_dprat,
      price_tprat,
      price_mrrat,
      price_dspct,
      price_gdstk,
      price_bdstk,
      price_mnqty,
      price_mxqty,
      price_pbqty,
      price_sbqty,
      price_notes,
      price_jnote,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (!price_items || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql = `UPDATE tmib_price
    SET price_cname = $1,
    price_lprat = $2,
    price_dprat = $3,
    price_tprat = $4,
    price_mrrat = $5,
    price_dspct = $6,
    price_gdstk = $7,
    price_bdstk = $8,
    price_mnqty = $9,
    price_mxqty = $10,
    price_pbqty = $11,
    price_sbqty = $12,
    price_notes = $13,
    price_jnote = $14,
    price_upusr = $15,
    price_updat = CURRENT_TIMESTAMP,
    price_rvnmr = price_rvnmr + 1
    WHERE id = $16`;

    const params = [
      price_cname,
      price_lprat || 0,
      price_dprat || 0,
      price_tprat || 0,
      price_mrrat || 0,
      price_dspct || 0,
      price_gdstk || 0,
      price_bdstk || 0,
      price_mnqty || 0,
      price_mxqty || 0,
      price_pbqty || 0,
      price_sbqty || 0,
      price_notes,
      price_jnote,
      user_s,
      id,
    ];

    await dbRun(sql, params, `update price- ${price_cname}`);
    res.json({
      success: true,
      message: `Price - ${price_cname} Updated successfully.`,
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
    const { id, price_cname, price_actve, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!id || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql = `UPDATE tmib_price
    SET price_actve = NOT price_actve,
    price_upusr = $1,
    price_updat = CURRENT_TIMESTAMP,
    price_rvnmr = price_rvnmr + 1
    WHERE id = $2`;
    const params = [user_s, id];

    await dbRun(sql, params, `delete price- ${user_c}`);
    res.json({
      success: true,
      message: `Price - ${price_cname ? "Deactivate" : "Activate"} successfully.`,
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

// get by item
router.post("/get-by-item", async (req, res) => {
  try {
    const { price_items, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!price_items || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT prce.*, itm.items_iname,
    csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 as edit_stop
    FROM tmib_price prce
    LEFT JOIN tmib_items itm ON prce.price_items = itm.id
    LEFT JOIN tmhb_emply csr ON prce.price_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON prce.price_upusr = usr.id
    WHERE prce.price_users = $1
    AND prce.price_items = $2
    ORDER BY itm.items_iname ASC`;

    const params = [user_c, price_items];
    const rows = await dbGetAll(sql, params, `get price- ${user_c}`);
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

module.exports = router;
