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
    const sql = `SELECT dprt.*,
    csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 as edit_stop
    FROM tmsb_dpart dprt
    LEFT JOIN tmhb_emply csr ON dprt.dpart_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON dprt.dpart_upusr = usr.id
    WHERE dprt.dpart_users = $1
    ORDER BY dprt.dpart_cname ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get Department- ${user_c}`);
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
    const sql = `SELECT dprt.*, 0 as edit_stop
    FROM tmsb_dpart dprt
    WHERE dprt.dpart_users = $1
    AND dprt.dpart_actve = TRUE
    ORDER BY dprt.dpart_cname ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get Department- ${user_c}`);
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
      dpart_users,
      dpart_bsins,
      dpart_ccode,
      dpart_cname,
      dpart_ofadr,
      dpart_emcap,
      dpart_stdst,
      dpart_stpur,
      dpart_stsal,
      dpart_stnsf,
      dpart_stpro,
      dpart_stjrn,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (!dpart_cname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const newCode = await GenNewCode(user_c, "tmsb_dpart");

    const sql = `INSERT INTO tmsb_dpart(id, dpart_users, dpart_bsins, dpart_ccode, dpart_cname, dpart_ofadr,
    dpart_emcap, dpart_stdst, dpart_stpur, dpart_stsal, dpart_stnsf, dpart_stpro, dpart_stjrn,
    dpart_crusr, dpart_upusr)
    VALUES ($1, $2, $3, $4, $5, $6,
    $7, $8, $9, $10, $11, $12,
    $13, $14, $15)`;
    const params = [
      uuidv4(),
      user_c,
      user_b,
      newCode,
      dpart_cname,
      dpart_ofadr,
      dpart_emcap,
      dpart_stdst,
      dpart_stpur,
      dpart_stsal,
      dpart_stnsf,
      dpart_stpro,
      dpart_stjrn,
      user_s,
      user_s,
    ];

    await dbRun(sql, params, `create Department- ${user_c}`);
    res.json({
      success: true,
      message: `${dpart_cname} - Created successfully.`,
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
      dpart_users,
      dpart_bsins,
      dpart_ccode,
      dpart_cname,
      dpart_ofadr,
      dpart_emcap,
      dpart_stdst,
      dpart_stpur,
      dpart_stsal,
      dpart_stnsf,
      dpart_stpro,
      dpart_stjrn,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (!dpart_cname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }
    //database action
    const sql = `UPDATE tmsb_dpart
    SET dpart_cname = $1,
    dpart_ofadr = $2,
    dpart_emcap = $3,
    dpart_stdst = $4,
    dpart_stpur = $5,
    dpart_stsal = $6,
    dpart_stnsf = $7,
    dpart_stpro = $8,
    dpart_stjrn = $9,
    dpart_upusr = $10,
    dpart_updat = CURRENT_TIMESTAMP,
    dpart_rvnmr = dpart_rvnmr + 1
    WHERE id = $11`;
    const params = [
      dpart_cname,
      dpart_ofadr,
      dpart_emcap,
      dpart_stdst,
      dpart_stpur,
      dpart_stsal,
      dpart_stnsf,
      dpart_stpro,
      dpart_stjrn,
      user_s,
      id,
    ];

    await dbRun(sql, params, `update Department- ${user_c}`);
    res.json({
      success: true,
      message: `${dpart_cname} - Updated successfully.`,
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
    const { id, dpart_cname, dpart_actve, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!id || !dpart_cname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql = `UPDATE tmsb_dpart
    SET dpart_actve = NOT dpart_actve,
    dpart_upusr = $1,
    dpart_updat = CURRENT_TIMESTAMP,
    dpart_rvnmr = dpart_rvnmr + 1
    WHERE id = $2`;
    const params = [user_s, id];

    await dbRun(sql, params, `delete Department- ${user_c}`);
    res.json({
      success: true,
      message: `${dpart_cname} - ${dpart_actve ? "Deactivate" : "Activate"} successfully.`,
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

// get-purchase
router.post("/get-purchase", async (req, res) => {
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
    const sql = `SELECT dprt.*, 0 as edit_stop
    FROM tmsb_dpart dprt
    WHERE dprt.dpart_users = $1
    AND dprt.dpart_stpur = FALSE
    AND dprt.dpart_actve = TRUE
    ORDER BY dprt.dpart_cname ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get Department- ${user_c}`);
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

// get-sales
router.post("/get-sales", async (req, res) => {
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
    const sql = `SELECT dprt.*, 0 as edit_stop
    FROM tmsb_dpart dprt
    WHERE dprt.dpart_users = $1
    AND dprt.dpart_stsal = FALSE
    AND dprt.dpart_actve = TRUE
    ORDER BY dprt.dpart_cname ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get Department- ${user_c}`);
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



// get-journal
router.post("/get-journal", async (req, res) => {
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
    const sql = `SELECT dprt.*, 0 as edit_stop
    FROM tmsb_dpart dprt
    WHERE dprt.dpart_users = $1
    AND dprt.dpart_stjrn = FALSE
    AND dprt.dpart_actve = TRUE
    ORDER BY dprt.dpart_cname ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get Department- ${user_c}`);
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
