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
    const sql = `SELECT atrb.*, mctg.mcatg_mname,
    csr.users_uname AS crusr_cname, usr.users_uname AS upusr_cname, 0 as edit_stop
    FROM tmib_attrb atrb
    LEFT JOIN tmib_mcatg mctg ON atrb.attrb_mcatg = mctg.id
    LEFT JOIN tmnb_users csr ON atrb.attrb_crusr = csr.id
    LEFT JOIN tmnb_users usr ON atrb.attrb_upusr = usr.id
    WHERE atrb.attrb_apusr = $1
    ORDER BY atrb.attrb_aname ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get attrb- ${user_c}`);
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
    const sql = `SELECT atrb.*, 0 as edit_stop
    FROM tmib_attrb atrb
    WHERE atrb.attrb_apusr = $1
    AND atrb.attrb_actve = TRUE
    ORDER BY atrb.attrb_aname ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get attrb- ${user_c}`);
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
      attrb_apusr,
      attrb_bsins,
      attrb_mcatg,
      attrb_acode,
      attrb_aname,
      attrb_dtype,
      attrb_dvalu,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !attrb_mcatg ||
      !attrb_aname ||
      !attrb_dtype ||
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
    const newCode = await GenNewCode(user_c, "tmib_attrb");

    const sql = `INSERT INTO tmib_attrb(id, attrb_apusr, attrb_bsins, attrb_mcatg, attrb_acode, attrb_aname,
    attrb_dtype, attrb_dvalu, attrb_crusr, attrb_upusr)
    VALUES ($1, $2, $3, $4, $5, $6,
    $7, $8, $9, $10)`;
    const params = [
      uuidv4(),
      user_c,
      user_b,
      attrb_mcatg,
      newCode,
      attrb_aname,
      attrb_dtype,
      attrb_dvalu,
      user_s,
      user_s,
    ];

    await dbRun(sql, params, `create attrb- ${user_c}`);
    res.json({
      success: true,
      message: `${attrb_aname} - Created successfully.`,
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
      attrb_apusr,
      attrb_bsins,
      attrb_mcatg,
      attrb_acode,
      attrb_aname,
      attrb_dtype,
      attrb_dvalu,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !attrb_mcatg ||
      !attrb_aname ||
      !attrb_dtype ||
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
    const sql = `UPDATE tmib_attrb
    SET attrb_mcatg = $1,
    attrb_aname = $2,
    attrb_dtype = $3,
    attrb_dvalu = $4,
    attrb_upusr = $5,
    attrb_updat = CURRENT_TIMESTAMP,
    attrb_rvnmr = attrb_rvnmr + 1
    WHERE id = $6`;
    const params = [attrb_mcatg, attrb_aname, attrb_dtype, attrb_dvalu, user_s, id];

    await dbRun(sql, params, `update attrb- ${user_c}`);
    res.json({
      success: true,
      message: `${attrb_aname} - Updated successfully.`,
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
    const { id, attrb_aname, attrb_actve, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!id || !attrb_aname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql = `UPDATE tmib_attrb
    SET attrb_actve = NOT attrb_actve,
    attrb_upusr = $1,
    attrb_updat = CURRENT_TIMESTAMP,
    attrb_rvnmr = attrb_rvnmr + 1
    WHERE id = $2`;
    const params = [user_s, id];

    await dbRun(sql, params, `delete attrb- ${user_c}`);
    res.json({
      success: true,
      message: `${attrb_aname} - ${attrb_actve ? "Deactivate" : "Activate"} successfully.`,
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

//by category
//by product
