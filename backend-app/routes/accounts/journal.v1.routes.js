const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");
const { GenNewCode, GenNewTrn } = require("../../db/genTableCode");

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
    const sql = `SELECT jrn.*,
    csr.users_uname AS crusr_cname, usr.users_uname AS upusr_cname, 0 as edit_stop
    FROM tmtb_mjrnl jrn
    LEFT JOIN tmnb_users csr ON jrn.mjrnl_crusr = csr.id
    LEFT JOIN tmnb_users usr ON jrn.mjrnl_upusr = usr.id
    WHERE jrn.mjrnl_apusr = $1
    ORDER BY jrn.mjrnl_trtyp ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get journal- ${user_c}`);
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
    const sql = `SELECT coa.*, 0 as edit_stop
    FROM tmtb_mjrnl coa
    WHERE coa.mjrnl_apusr = $1
    AND coa.chtac_actve = TRUE
    ORDER BY coa.mjrnl_fsyar ASC`;

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

const create = async (req, res) => {
  try {
    const {
      id,
      mjrnl_apusr,
      mjrnl_bsins,
      mjrnl_dpart,
      mjrnl_crncy,
      mjrnl_fsyar,
      mjrnl_acprd,
      mjrnl_trtyp,
      mjrnl_trnno,
      mjrnl_trdat,
      mjrnl_refno,
      mjrnl_narrt,
      mjrnl_drval,
      mjrnl_crval,
      mjrnl_stats,
      mjrnl_appid,
      mjrnl_apdat,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !mjrnl_dpart ||
      !mjrnl_crncy ||
      !mjrnl_fsyar ||
      !mjrnl_acprd ||
      !mjrnl_trtyp ||
      !mjrnl_trdat ||
      !mjrnl_narrt ||
      !mjrnl_stats ||
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
    //const newCode = await GenNewCode(user_c, "tmtb_mjrnl");
    const newTrn = await GenNewTrn(
      user_c,
      user_b,
      "tmtb_mjrnl",
      mjrnl_trtyp,
      mjrnl_dpart,
    );

    const sql = `INSERT INTO tmtb_mjrnl(id, mjrnl_apusr, mjrnl_bsins, mjrnl_dpart, mjrnl_crncy, mjrnl_fsyar,
    mjrnl_acprd, mjrnl_trtyp, mjrnl_trnno, mjrnl_trdat, mjrnl_refno, mjrnl_narrt,
    mjrnl_drval, mjrnl_crval, mjrnl_stats, mjrnl_appid, mjrnl_apdat, mjrnl_crusr, mjrnl_upusr)
    VALUES ($1, $2, $3, $4, $5, $6,
    $7, $8, $9, $10, $11, $12,
    $13, $14, $15, $16, $17, $18, $19)`;
    const params = [
      uuidv4(),
      user_c,
      user_b,
      mjrnl_dpart,
      mjrnl_crncy,
      mjrnl_fsyar,
      mjrnl_acprd,
      mjrnl_trtyp,
      newTrn,
      mjrnl_trdat,
      mjrnl_refno,
      mjrnl_narrt,
      mjrnl_drval,
      mjrnl_crval,
      mjrnl_stats,
      mjrnl_appid,
      mjrnl_apdat,
      user_s,
      user_s,
    ];

    //console.log("params", params);

    await dbRun(sql, params, `create journal- ${user_c}`);
    res.json({
      success: true,
      message: `${newTrn} - Created successfully.`,
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
      mjrnl_apusr,
      mjrnl_bsins,
      mjrnl_dpart,
      mjrnl_crncy,
      mjrnl_fsyar,
      mjrnl_acprd,
      mjrnl_trtyp,
      mjrnl_trnno,
      mjrnl_trdat,
      mjrnl_refno,
      mjrnl_narrt,
      mjrnl_drval,
      mjrnl_crval,
      mjrnl_stats,
      mjrnl_appid,
      mjrnl_apdat,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !mjrnl_dpart ||
      !mjrnl_crncy ||
      !mjrnl_fsyar ||
      !mjrnl_acprd ||
      !mjrnl_trtyp ||
      !mjrnl_trdat ||
      !mjrnl_narrt ||
      !mjrnl_stats ||
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
    const sql = `UPDATE tmtb_mjrnl
    SET mjrnl_dpart = $1,
    mjrnl_fsyar = $2,
    mjrnl_acprd = $3,
    mjrnl_trdat = $4,
    chtac_upusr = $5,
    chtac_updat = CURRENT_TIMESTAMP,
    chtac_rvnmr = chtac_rvnmr + 1
    WHERE id = $6`;
    const params = [
      mjrnl_dpart,
      mjrnl_fsyar,
      mjrnl_acprd,
      mjrnl_trdat,
      user_s,
      id,
    ];

    await dbRun(sql, params, `update journal- ${user_c}`);
    res.json({
      success: true,
      message: `${mjrnl_trnno} - Updated successfully.`,
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
    const { id, mjrnl_fsyar, chtac_actve, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!id || !mjrnl_fsyar || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql = `UPDATE tmtb_mjrnl
    SET chtac_actve = NOT chtac_actve,
    chtac_upusr = $1,
    dzone_updat = CURRENT_TIMESTAMP,
    chtac_rvnmr = chtac_rvnmr + 1
    WHERE id = $2`;
    const params = [user_s, id];

    await dbRun(sql, params, `delete account coa- ${user_c}`);
    res.json({
      success: true,
      message: `${mjrnl_fsyar} - ${chtac_actve ? "Deactivate" : "Activate"} successfully.`,
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
    FROM tmtb_mjrnl cht
    WHERE cht.mjrnl_trdat = TRUE
    AND cht.chtac_actve = TRUE
    AND cht.mjrnl_apusr = $1
    ORDER BY cht.mjrnl_acprd ASC, cht.mjrnl_dpart ASC, cht.mjrnl_trtyp ASC`;

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
