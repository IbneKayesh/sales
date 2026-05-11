const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");
const {
  GenNewCode,
  GenNewTrn,
  getFiscalYearPeriod,
} = require("../../db/genHelper");

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
      tmtb_djrnl,
      user_s,
      user_c,
      user_b,
    } = req.body;

    //console.log(" req.body;", req.body);

    // Validate input
    if (
      !mjrnl_dpart ||
      !mjrnl_crncy ||
      // !mjrnl_fsyar ||
      // !mjrnl_acprd ||
      !mjrnl_trtyp ||
      !mjrnl_trdat ||
      !mjrnl_narrt ||
      !mjrnl_stats ||
      !tmtb_djrnl ||
      tmtb_djrnl.length === 0 ||
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
    const fsyacp = await getFiscalYearPeriod(
      user_c,
      user_b,
      mjrnl_dpart,
      mjrnl_trdat,
    );
    if (!fsyacp) {
      return res.json({
        success: false,
        message: "No active fiscal year or accounting period found",
        data: {},
      });
    }
    if (fsyacp.length > 1) {
      return res.json({
        success: false,
        message: "Multiple active accounting periods found. Please select one.",
        data: {},
      });
    }
    //console.log("fsyacp", fsyacp);

    const { fsyar_id, acprd_id } = fsyacp[0];

    const newTrn = await GenNewTrn(
      user_c,
      user_b,
      "tmtb_mjrnl",
      mjrnl_trtyp,
      mjrnl_dpart,
    );

    //build scripts
    const masterId = uuidv4();
    const scripts = [];

    scripts.push({
      sql: `INSERT INTO tmtb_mjrnl(id, mjrnl_apusr, mjrnl_bsins, mjrnl_dpart, mjrnl_crncy, mjrnl_fsyar,
    mjrnl_acprd, mjrnl_trtyp, mjrnl_trnno, mjrnl_trdat, mjrnl_refno, mjrnl_narrt,
    mjrnl_drval, mjrnl_crval, mjrnl_stats, mjrnl_appid, mjrnl_apdat, mjrnl_crusr, mjrnl_upusr)
    VALUES ($1, $2, $3, $4, $5, $6,
    $7, $8, $9, $10, $11, $12,
    $13, $14, $15, $16, $17, $18, $19)`,
      params: [
        masterId,
        user_c,
        user_b,
        mjrnl_dpart,
        mjrnl_crncy,
        fsyar_id,
        acprd_id,
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
      ],
      label: `create journal- ${user_c}`,
    });

    for (const det of tmtb_djrnl) {
      scripts.push({
        sql: `INSERT INTO tmtb_djrnl(id, djrnl_apusr, djrnl_bsins, djrnl_dpart, djrnl_mjrnl, djrnl_chtac,
        djrnl_party, djrnl_drval, djrnl_crval, djrnl_descr, djrnl_rftyp, djrnl_refid,
        djrnl_lneno, djrnl_crusr, djrnl_upusr)
        VALUES ($1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12,
        $13, $14, $15)`,
        params: [
          uuidv4(),
          user_c,
          user_b,
          mjrnl_dpart,
          masterId,
          det.djrnl_chtac,
          det.djrnl_party,
          det.djrnl_drval,
          det.djrnl_crval,
          det.djrnl_descr || "",
          det.djrnl_rftyp || "",
          det.djrnl_refid || "",
          det.djrnl_lneno,
          user_s,
          user_s,
        ],
        label: `Created jouranl detail ${newTrn}`,
      });
    }
    //console.log("params", params);

    await dbRunAll(scripts);
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

// get-detail
router.post("/get-detail", async (req, res) => {
  try {
    const { djrnl_mjrnl, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!djrnl_mjrnl || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `select jrd.*,
cht.chtac_cname, pty.party_pname  || ' | ' ||  pty.party_ptype  || ' | ' ||  pty.party_pcode AS party_pname, 0 as edit_stop
FROM tmtb_djrnl jrd
LEFT JOIN tmtb_chtac cht ON jrd.djrnl_chtac = cht.id
LEFT JOIN tmtb_party pty ON jrd.djrnl_party = pty.id
WHERE jrd.djrnl_mjrnl = $1
ORDER BY jrd.djrnl_lneno ASC`;

    const params = [djrnl_mjrnl];
    const rows = await dbGetAll(
      sql,
      params,
      `get detail journal- ${djrnl_mjrnl}`,
    );
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
