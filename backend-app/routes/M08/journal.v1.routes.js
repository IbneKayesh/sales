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
    const sql = `SELECT jrn.*, fsy.fsyar_cname, acp.acprd_cname,
    csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 as edit_stop
    FROM tmtb_jrnlm jrn
    LEFT JOIN tmtb_fsyar fsy ON jrn.jrnlm_fsyar = fsy.id
    LEFT JOIN tmtb_acprd acp ON jrn.jrnlm_acprd = acp.id
    LEFT JOIN tmhb_emply csr ON jrn.jrnlm_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON jrn.jrnlm_upusr = usr.id
    WHERE jrn.jrnlm_users = $1
    ORDER BY jrn.jrnlm_trtyp ASC`;

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
      jrnlm_users,
      jrnlm_bsins,
      jrnlm_dpart,
      jrnlm_fsyar,
      jrnlm_acprd,
      jrnlm_crncy,
      jrnlm_trtyp,
      jrnlm_trnno,
      jrnlm_trdat,
      jrnlm_refno,
      jrnlm_narrt,
      jrnlm_drval,
      jrnlm_crval,
      jrnlm_stats,
      jrnlm_appid,
      jrnlm_apdat,
      tmtb_jrnlc,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !jrnlm_fsyar ||
      !jrnlm_acprd ||
      !jrnlm_crncy ||
      !jrnlm_trtyp ||
      !jrnlm_refno ||
      !jrnlm_narrt ||
      !jrnlm_drval ||
      !jrnlm_crval ||
      !tmtb_jrnlc ||
      tmtb_jrnlc.length === 0 ||
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
    //const newCode = await GenNewCode(user_c, "tmtb_jrnlm");
    // const fsyacp = await getFiscalYearPeriod(
    //   user_c,
    //   user_b,
    //   mjrnl_dpart,
    //   mjrnl_trdat,
    // );
    // if (!fsyacp) {
    //   return res.json({
    //     success: false,
    //     message: "No active fiscal year or accounting period found",
    //     data: {},
    //   });
    // }
    // if (fsyacp.length > 1) {
    //   return res.json({
    //     success: false,
    //     message: "Multiple active accounting periods found. Please select one.",
    //     data: {},
    //   });
    // }
    //console.log("fsyacp", fsyacp);
    //const { fsyar_id, acprd_id } = fsyacp[0];

    const newTrn = await GenNewTrn(
      user_c,
      user_b,
      "tmtb_jrnlm",
      jrnlm_trtyp,
      jrnlm_dpart,
    );

    //build scripts
    const masterId = uuidv4();
    const scripts = [];

    scripts.push({
      sql: `INSERT INTO tmtb_jrnlm(id, jrnlm_users, jrnlm_bsins, jrnlm_dpart, jrnlm_fsyar, jrnlm_acprd,
    jrnlm_crncy, jrnlm_trtyp, jrnlm_trnno, jrnlm_trdat, jrnlm_refno, jrnlm_narrt,
    jrnlm_drval, jrnlm_crval, jrnlm_stats, jrnlm_appid, jrnlm_apdat, jrnlm_crusr, jrnlm_upusr)
    VALUES ($1, $2, $3, $4, $5, $6,
    $7, $8, $9, $10, $11, $12,
    $13, $14, $15, $16, $17, $18, $19)`,
      params: [
        masterId,
        user_c,
        user_b,
        jrnlm_dpart,
        jrnlm_fsyar,
        jrnlm_acprd,
        jrnlm_crncy,
        jrnlm_trtyp,
        newTrn,
        jrnlm_trdat,
        jrnlm_refno,
        jrnlm_narrt,
        jrnlm_drval,
        jrnlm_crval,
        jrnlm_stats,
        jrnlm_appid,
        jrnlm_apdat,
        user_s,
        user_s,
      ],
      label: `create journal- ${user_c}`,
    });

    let line = 1;
    for (const det of tmtb_jrnlc) {
      scripts.push({
        sql: `INSERT INTO tmtb_jrnlc(id, jrnlc_users, jrnlc_bsins, jrnlc_dpart, jrnlc_jrnlm, jrnlc_chtac,
        jrnlc_party, jrnlc_drval, jrnlc_crval, jrnlc_descr, jrnlc_sorce, jrnlc_refid,
        jrnlc_lines, jrnlc_crusr, jrnlc_upusr)
        VALUES ($1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12,
        $13, $14, $15)`,
        params: [
          uuidv4(),
          user_c,
          user_b,
          jrnlm_dpart,
          masterId,
          det.jrnlc_chtac,
          det.jrnlc_party,
          det.jrnlc_drval,
          det.jrnlc_crval,
          det.jrnlc_descr || "",
          det.jrnlc_sorce || "",
          det.jrnlc_refid || "",
          line,
          user_s,
          user_s,
        ],
        label: `Created jouranl detail ${newTrn}`,
      });
      line++;
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
    return res.json({
      success: false,
      message: `Update is not available.`,
      data: {},
    });
    const {
      id,
      jrnlm_users,
      jrnlm_bsins,
      jrnlm_dpart,
      jrnlm_fsyar,
      jrnlm_acprd,
      jrnlm_crncy,
      jrnlm_trtyp,
      jrnlm_trnno,
      jrnlm_trdat,
      jrnlm_refno,
      jrnlm_narrt,
      jrnlm_drval,
      jrnlm_crval,
      jrnlm_stats,
      jrnlm_appid,
      jrnlm_apdat,
      tmtb_jrnlc,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !jrnlm_fsyar ||
      !jrnlm_acprd ||
      !jrnlm_crncy ||
      !jrnlm_trtyp ||
      !jrnlm_refno ||
      !jrnlm_narrt ||
      !jrnlm_drval ||
      !jrnlm_crval ||
      !tmtb_jrnlc ||
      tmtb_jrnlc.length === 0 ||
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
    mjrnl_upusr = $5,
    mjrnl_updat = CURRENT_TIMESTAMP,
    mjrnl_rvnmr = mjrnl_rvnmr + 1
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

// get-child
router.post("/get-child", async (req, res) => {
  try {
    const { jrnlc_jrnlm, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!jrnlc_jrnlm || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `select jrd.*,
cht.chtac_cname, pty.party_cname  || ' | ' ||  pty.party_ptype  || ' | ' ||  pty.party_ccode AS party_cname, 0 as edit_stop
FROM tmtb_jrnlc jrd
LEFT JOIN tmtb_chtac cht ON jrd.jrnlc_chtac = cht.id
LEFT JOIN tmtb_party pty ON jrd.jrnlc_party = pty.id
WHERE jrd.jrnlc_jrnlm = $1
ORDER BY jrd.jrnlc_lines ASC`;

    const params = [jrnlc_jrnlm];
    const rows = await dbGetAll(
      sql,
      params,
      `get detail journal- ${jrnlc_jrnlm}`,
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
