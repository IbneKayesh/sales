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
    const sql = `SELECT coa.*,
    csr.users_uname AS crusr_cname, usr.users_uname AS upusr_cname, 0 as edit_stop
    FROM tmtb_chtac coa
    LEFT JOIN tmnb_users csr ON coa.chtac_crusr = csr.id
    LEFT JOIN tmnb_users usr ON coa.chtac_upusr = usr.id
    WHERE coa.chtac_apusr = $1
    ORDER BY coa.chtac_chtno ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get account coa- ${user_c}`);
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
    WHERE fsy.fsyar_apusr = $1
    AND fsy.fsyar_iscur = TRUE
    AND fsy.fsyar_actve = TRUE
    ORDER BY fsy.fsyar_fname ASC`;

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
      chtac_apusr,
      chtac_bsins,
      chtac_chtac,
      chtac_ccode,
      chtac_cname,
      chtac_ctype,
      chtac_chtno,
      chtac_child,
      chtac_alpst,
      chtac_level,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !chtac_chtac ||
      !chtac_cname ||
      !chtac_ctype ||
      !chtac_chtno ||
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
    const chtac_child_new = chtac_chtac === "-" ? false : true;
    const chtac_level_new = chtac_chtac === "-" ? 0 : 1;
    const newCode = await GenNewCode(user_c, "tmtb_chtac");

    const sql_sequence = `SELECT shtbl_value FROM tmnb_shtbl WHERE shtbl_gname = $1 AND shtbl_dvalu = $2`;
    const row_sequence = await dbGet(
      sql_sequence,
      [chtac_ctype, chtac_ctype],
      `get account coa- ${user_c}`,
    );

    if (!row_sequence) {
      return res.json({
        success: false,
        message: "No range setup for this account type.",
        data: {},
      });
    }

    const sql_sl = `SELECT COUNT(id) AS last_no FROM tmtb_chtac WHERE chtac_ctype = $1`;
    const row_sl = await dbGet(
      sql_sl,
      [chtac_ctype],
      `get account coa- ${user_c}`,
    );

    //console.log(row_sequence, row_sl);

    const chtac_chtno_new =
      Number(row_sequence.shtbl_value) + Number(row_sl?.last_no || 0);

    const sql = `INSERT INTO tmtb_chtac(id, chtac_apusr, chtac_bsins, chtac_chtac, chtac_ccode, chtac_cname,
    chtac_ctype, chtac_chtno, chtac_child, chtac_alpst, chtac_level, chtac_crusr, chtac_upusr)
    VALUES ($1, $2, $3, $4, $5, $6,
    $7, $8, $9, $10, $11, $12, $13)`;
    const params = [
      uuidv4(),
      user_c,
      user_b,
      chtac_chtac,
      newCode,
      chtac_cname,
      chtac_ctype,
      chtac_chtno_new,
      chtac_child_new,
      chtac_alpst,
      chtac_level_new,
      user_s,
      user_s,
    ];

    //console.log("params", params);

    await dbRun(sql, params, `create account coa- ${user_c}`);
    res.json({
      success: true,
      message: `${chtac_cname} - Created successfully.`,
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
      chtac_apusr,
      chtac_bsins,
      chtac_chtac,
      chtac_ccode,
      chtac_cname,
      chtac_ctype,
      chtac_chtno,
      chtac_child,
      chtac_alpst,
      chtac_level,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !chtac_chtac ||
      !chtac_cname ||
      !chtac_ctype ||
      !chtac_chtno ||
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
    const sql = `UPDATE tmtb_chtac
    SET chtac_chtac = $1,
    chtac_cname = $2,
    chtac_ctype = $3,
    chtac_alpst = $4,
    chtac_upusr = $5,
    chtac_updat = CURRENT_TIMESTAMP,
    chtac_rvnmr = chtac_rvnmr + 1
    WHERE id = $6`;
    const params = [
      chtac_chtac,
      chtac_cname,
      chtac_ctype,
      chtac_alpst,
      user_s,
      id,
    ];

    await dbRun(sql, params, `update account coa- ${user_c}`);
    res.json({
      success: true,
      message: `${chtac_cname} - Updated successfully.`,
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
    const { id, chtac_cname, chtac_actve, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!id || !chtac_cname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql = `UPDATE tmtb_chtac
    SET chtac_actve = NOT chtac_actve,
    chtac_upusr = $1,
    dzone_updat = CURRENT_TIMESTAMP,
    chtac_rvnmr = chtac_rvnmr + 1
    WHERE id = $2`;
    const params = [user_s, id];

    await dbRun(sql, params, `delete account coa- ${user_c}`);
    res.json({
      success: true,
      message: `${chtac_cname} - ${chtac_actve ? "Deactivate" : "Activate"} successfully.`,
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


// get-coa-posting
router.post("/get-coa-posting", async (req, res) => {
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
    const sql = `SELECT cht.*, 0 as edit_stop
    FROM tmtb_chtac cht
    WHERE cht.chtac_alpst = TRUE
    AND cht.chtac_actve = TRUE
    AND cht.chtac_apusr = $1
    ORDER BY cht.chtac_ctype ASC, cht.chtac_chtac ASC, cht.chtac_chtno ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get account coa- ${user_c}`);
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
