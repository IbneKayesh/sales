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
    const sql = `SELECT fsy.*,
    dpt.dpart_cname,
    csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 as edit_stop
    FROM tmtb_fsyar fsy
    LEFT JOIN tmsb_dpart dpt ON fsy.fsyar_dpart = dpt.id
    LEFT JOIN tmhb_emply csr ON fsy.fsyar_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON fsy.fsyar_upusr = usr.id
    WHERE fsy.fsyar_users = $1
    ORDER BY fsy.fsyar_endat ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get account fsy- ${user_c}`);
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
    const sql = `SELECT fsy.*, 0 as edit_stop
    FROM tmtb_fsyar fsy
    WHERE fsy.fsyar_users = $1
    AND fsy.fsyar_iscur = TRUE
    AND fsy.fsyar_actve = TRUE
    ORDER BY fsy.fsyar_cname ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get fiscal year- ${user_c}`);
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
      fsyar_users,
      fsyar_bsins,
      fsyar_ccode,
      fsyar_dpart,
      fsyar_cname,
      fsyar_stdat,
      fsyar_endat,
      fsyar_stats,
      fsyar_iscur,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !fsyar_dpart ||
      !fsyar_cname ||
      !fsyar_stdat ||
      !fsyar_endat ||
      !fsyar_stats ||
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
    const newCode = await GenNewCode(user_c, "tmtb_fsyar");
    const sql = `INSERT INTO tmtb_fsyar(id, fsyar_users, fsyar_bsins, fsyar_ccode, fsyar_dpart, fsyar_cname,
    fsyar_stdat, fsyar_endat, fsyar_stats, fsyar_iscur, fsyar_crusr, fsyar_upusr)
    VALUES ($1, $2, $3, $4, $5, $6,
    $7, $8, $9, $10, $11, $12)`;
    const params = [
      uuidv4(),
      user_c,
      user_b,
      newCode,
      fsyar_dpart,
      fsyar_cname,
      fsyar_stdat,
      fsyar_endat,
      fsyar_stats,
      fsyar_iscur,
      user_s,
      user_s,
    ];

    //console.log("params", params);

    await dbRun(sql, params, `create fiscal year- ${user_c}`);
    res.json({
      success: true,
      message: `${fsyar_cname} - Created successfully.`,
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
      fsyar_users,
      fsyar_bsins,
      fsyar_ccode,
      fsyar_dpart,
      fsyar_cname,
      fsyar_stdat,
      fsyar_endat,
      fsyar_stats,
      fsyar_iscur,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !fsyar_dpart ||
      !fsyar_cname ||
      !fsyar_stdat ||
      !fsyar_endat ||
      !fsyar_stats ||
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
    const sql = `UPDATE tmtb_fsyar
    SET fsyar_cname = $1,
    fsyar_stdat = $2,
    fsyar_endat = $3,
    fsyar_stats = $4,
    fsyar_iscur = $5,
    fsyar_upusr = $6,
    fsyar_updat = CURRENT_TIMESTAMP,
    fsyar_rvnmr = fsyar_rvnmr + 1
    WHERE id = $7`;
    const params = [
      fsyar_cname,
      fsyar_stdat,
      fsyar_endat,
      fsyar_stats,
      fsyar_iscur,
      user_s,
      id,
    ];

    await dbRun(sql, params, `update fiscal year- ${user_c}`);
    res.json({
      success: true,
      message: `${fsyar_cname} - Updated successfully.`,
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
    const { id, fsyar_cname, chtac_actve, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!id || !fsyar_cname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql = `UPDATE tmtb_fsyar
    SET fsyar_actve = NOT fsyar_actve,
    fsyar_upusr = $1,
    fsyar_updat = CURRENT_TIMESTAMP,
    fsyar_rvnmr = fsyar_rvnmr + 1
    WHERE id = $2`;
    const params = [user_s, id];

    await dbRun(sql, params, `delete fiscal year- ${user_c}`);
    res.json({
      success: true,
      message: `${fsyar_cname} - ${chtac_actve ? "Deactivate" : "Activate"} successfully.`,
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

// get-current-by-department
router.post("/get-current-by-department", async (req, res) => {
  try {
    const { fsyar_dpart, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!fsyar_dpart || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT fsy.*, 0 as edit_stop
    FROM tmtb_fsyar fsy
    WHERE fsy.fsyar_users = $1
    AND fsy.fsyar_iscur = TRUE
    AND fsy.fsyar_actve = TRUE
    AND fsy.fsyar_dpart = $2
    ORDER BY fsy.fsyar_cname ASC`;

    const params = [user_c, fsyar_dpart];
    const rows = await dbGetAll(sql, params, `get fiscal year- ${user_c}`);
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
