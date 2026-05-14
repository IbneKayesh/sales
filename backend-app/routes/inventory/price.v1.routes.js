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
    const sql = `SELECT prce.*,
    csr.users_uname AS crusr_cname, usr.users_uname AS upusr_cname, 0 as edit_stop
    FROM tmib_price prce
    LEFT JOIN tmnb_users csr ON prce.price_crusr = csr.id
    LEFT JOIN tmnb_users usr ON prce.price_upusr = usr.id
    WHERE prce.price_apusr = $1
    ORDER BY prce.price_pname ASC`;

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
    const sql = `SELECT prce.*, 0 as edit_stop
    FROM tmib_price prce
    WHERE prce.price_apusr = $1
    AND prce.price_actve = TRUE
    ORDER BY prce.price_pname ASC`;

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
      price_apusr,
      price_bsins,
      price_pcode,
      price_pname,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (!price_pname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const newCode = await GenNewCode(user_c, "tmib_price");

    const sql = `INSERT INTO tmib_price(id, price_apusr, price_bsins, price_pcode, price_pname, price_crusr, price_upusr)
    VALUES ($1, $2, $3, $4, $5, $6, $7)`;
    const params = [
      uuidv4(),
      user_c,
      user_b,
      newCode,
      price_pname,
      user_s,
      user_s,
    ];

    await dbRun(sql, params, `create price- ${user_c}`);
    res.json({
      success: true,
      message: `${price_pname} - Created successfully.`,
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
      price_apusr,
      price_bsins,
      price_pcode,
      price_pname,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (!id || !price_pname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql = `UPDATE tmib_price
    SET price_pname = $1,
    price_upusr = $2,
    price_updat = CURRENT_TIMESTAMP,
    price_rvnmr = price_rvnmr + 1
    WHERE id = $3`;
    const params = [price_pname, user_s, id];

    await dbRun(sql, params, `update price- ${user_c}`);
    res.json({
      success: true,
      message: `${price_pname} - Updated successfully.`,
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
    const { id, price_pname, price_actve, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!id || !price_pname || !user_s || !user_c || !user_b) {
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
      message: `${price_pname} - ${price_actve ? "Deactivate" : "Activate"} successfully.`,
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
