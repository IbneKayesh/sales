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
    const sql = `SELECT prd.*,
    dpt.dpart_cname, fsy.fsyar_cname,
    csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 as edit_stop
    FROM tmtb_acprd prd
    LEFT JOIN tmsb_dpart dpt ON prd.acprd_dpart = dpt.id
    LEFT JOIN tmtb_fsyar fsy ON prd.acprd_fsyar = fsy.id
    LEFT JOIN tmhb_emply csr ON prd.acprd_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON prd.acprd_upusr = usr.id
    WHERE prd.acprd_users = $1
    ORDER BY prd.acprd_cname ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get account prd- ${user_c}`);
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
    const { acprd_fsyar, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!acprd_fsyar || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT acp.*, 0 as edit_stop
    FROM tmtb_acprd acp
    WHERE acp.acprd_users = $1
    AND acp.acprd_fsyar = $2
    AND acp.acprd_iscur = TRUE
    AND acp.acprd_actve = TRUE
    ORDER BY acp.acprd_cname ASC`;

    const params = [user_c, acprd_fsyar];
    const rows = await dbGetAll(sql, params, `get account period- ${user_c}`);
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
      acprd_users,
      acprd_bsins,
      acprd_ccode,
      acprd_dpart,
      acprd_fsyar,
      acprd_cname,
      acprd_trnno,
      acprd_stdat,
      acprd_endat,
      acprd_stats,
      acprd_iscur,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !acprd_dpart ||
      !acprd_fsyar ||
      !acprd_cname ||
      !acprd_trnno ||
      !acprd_stdat ||
      !acprd_endat ||
      !acprd_stats ||
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
    const newCode = await GenNewCode(user_c, "tmtb_acprd");
    const sql = `INSERT INTO tmtb_acprd(id, acprd_users, acprd_bsins, acprd_ccode, acprd_dpart, acprd_fsyar,
    acprd_cname, acprd_trnno, acprd_stdat, acprd_endat, acprd_stats, acprd_iscur, acprd_crusr, acprd_upusr)
    VALUES ($1, $2, $3, $4, $5, $6,
    $7, $8, $9, $10, $11, $12, $13, $14)`;
    const params = [
      uuidv4(),
      user_c,
      user_b,
      newCode,
      acprd_dpart,
      acprd_fsyar,
      acprd_cname,
      acprd_trnno,
      acprd_stdat,
      acprd_endat,
      acprd_stats,
      acprd_iscur,
      user_s,
      user_s,
    ];

    //console.log("params", params);

    await dbRun(sql, params, `create account prd- ${user_c}`);
    res.json({
      success: true,
      message: `${acprd_cname} - Created successfully.`,
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
      acprd_users,
      acprd_bsins,
      acprd_ccode,
      acprd_dpart,
      acprd_fsyar,
      acprd_cname,
      acprd_trnno,
      acprd_stdat,
      acprd_endat,
      acprd_stats,
      acprd_iscur,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !acprd_dpart ||
      !acprd_fsyar ||
      !acprd_cname ||
      !acprd_trnno ||
      !acprd_stdat ||
      !acprd_endat ||
      !acprd_stats ||
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
    const sql = `UPDATE tmtb_acprd
    SET acprd_cname = $1,
    acprd_trnno = $2,
    acprd_stdat = $3,
    acprd_endat = $4,
    acprd_stats = $5,
    acprd_iscur = $6,
    acprd_upusr = $7,
    acprd_updat = CURRENT_TIMESTAMP,
    acprd_rvnmr = acprd_rvnmr + 1
    WHERE id = $8`;
    const params = [
      acprd_cname,
      acprd_trnno,
      acprd_stdat,
      acprd_endat,
      acprd_stats,
      acprd_iscur,
      user_s,
      id,
    ];

    await dbRun(sql, params, `update account prd- ${user_c}`);
    res.json({
      success: true,
      message: `${acprd_cname} - Updated successfully.`,
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
    const { id, acprd_cname, acprd_actve, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!id || !acprd_cname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql = `UPDATE tmtb_acprd
    SET acprd_actve = NOT acprd_actve,
    acprd_upusr = $1,
    acprd_updat = CURRENT_TIMESTAMP,
    acprd_rvnmr = acprd_rvnmr + 1
    WHERE id = $2`;
    const params = [user_s, id];

    await dbRun(sql, params, `delete account prd- ${user_c}`);
    res.json({
      success: true,
      message: `${acprd_cname} - ${acprd_actve ? "Deactivate" : "Activate"} successfully.`,
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
