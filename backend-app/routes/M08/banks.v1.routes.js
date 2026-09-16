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
    const sql = `SELECT bnk.*,
    dpt.dpart_cname,
    csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 as edit_stop
    FROM tmtb_banks bnk
    LEFT JOIN tmsb_dpart dpt ON bnk.banks_dpart = dpt.id
    LEFT JOIN tmhb_emply csr ON bnk.banks_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON bnk.banks_upusr = usr.id
    WHERE bnk.banks_users = $1
    ORDER BY bnk.banks_endat ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get bank account- ${user_c}`);
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
    const sql = `SELECT bnk.*, 0 as edit_stop
    FROM tmtb_banks bnk
    WHERE bnk.banks_users = $1
    AND bnk.banks_iscur = TRUE
    AND bnk.banks_actve = TRUE
    ORDER BY bnk.banks_cname ASC`;

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
      banks_users,
      banks_bsins,
      banks_ccode,
      banks_dpart,
      banks_cname,
      banks_stdat,
      banks_endat,
      banks_stats,
      banks_iscur,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !banks_dpart ||
      !banks_cname ||
      !banks_stdat ||
      !banks_endat ||
      !banks_stats ||
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
    const newCode = await GenNewCode(user_c, "tmtb_banks");
    const sql = `INSERT INTO tmtb_banks(id, banks_users, banks_bsins, banks_ccode, banks_dpart, banks_cname,
    banks_stdat, banks_endat, banks_stats, banks_iscur, banks_crusr, banks_upusr)
    VALUES ($1, $2, $3, $4, $5, $6,
    $7, $8, $9, $10, $11, $12)`;
    const params = [
      uuidv4(),
      user_c,
      user_b,
      newCode,
      banks_dpart,
      banks_cname,
      banks_stdat,
      banks_endat,
      banks_stats,
      banks_iscur,
      user_s,
      user_s,
    ];

    //console.log("params", params);

    await dbRun(sql, params, `create fiscal year- ${user_c}`);
    res.json({
      success: true,
      message: `${banks_cname} - Created successfully.`,
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
      banks_users,
      banks_bsins,
      banks_ccode,
      banks_dpart,
      banks_cname,
      banks_stdat,
      banks_endat,
      banks_stats,
      banks_iscur,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !banks_dpart ||
      !banks_cname ||
      !banks_stdat ||
      !banks_endat ||
      !banks_stats ||
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
    const sql = `UPDATE tmtb_banks
    SET banks_cname = $1,
    banks_stdat = $2,
    banks_endat = $3,
    banks_stats = $4,
    banks_iscur = $5,
    banks_upusr = $6,
    banks_updat = CURRENT_TIMESTAMP,
    banks_rvnmr = banks_rvnmr + 1
    WHERE id = $7`;
    const params = [
      banks_cname,
      banks_stdat,
      banks_endat,
      banks_stats,
      banks_iscur,
      user_s,
      id,
    ];

    await dbRun(sql, params, `update fiscal year- ${user_c}`);
    res.json({
      success: true,
      message: `${banks_cname} - Updated successfully.`,
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
    const { id, banks_cname, chtac_actve, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!id || !banks_cname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql = `UPDATE tmtb_banks
    SET banks_actve = NOT banks_actve,
    banks_upusr = $1,
    banks_updat = CURRENT_TIMESTAMP,
    banks_rvnmr = banks_rvnmr + 1
    WHERE id = $2`;
    const params = [user_s, id];

    await dbRun(sql, params, `delete fiscal year- ${user_c}`);
    res.json({
      success: true,
      message: `${banks_cname} - ${chtac_actve ? "Deactivate" : "Activate"} successfully.`,
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
    const { banks_dpart, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!banks_dpart || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT bnk.*, 0 as edit_stop
    FROM tmtb_banks bnk
    WHERE bnk.banks_users = $1
    AND bnk.banks_iscur = TRUE
    AND bnk.banks_actve = TRUE
    AND bnk.banks_dpart = $2
    ORDER BY bnk.banks_cname ASC`;

    const params = [user_c, banks_dpart];
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
