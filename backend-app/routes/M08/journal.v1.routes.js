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
      tmtb_jrnlm,
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
    jrnlm_drval, jrnlm_crval, jrnlm_stats, jrnlm_crusr, jrnlm_upusr)
    VALUES ($1, $2, $3, $4, $5, $6,
    $7, $8, $9, $10, $11, $12,
    $13, $14, $15, $16, $17)`,
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
      tmtb_jrnlm,
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
cht.chtac_cname, pty.party_cname, pty.party_ptype,  pty.party_ccode, 0 as edit_stop
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

// create-auto journal
router.post("/create-auto-journal-avbcc", async (req, res) => {
  try {
    const { jrnlm_dpart, jrnlm_trdat, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!jrnlm_dpart || !jrnlm_trdat || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    //PULL :: pending master data
    const sql_data_m = `SELECT mrm.id, mrm.mrrdm_users, mrm.mrrdm_bsins, mrm.mrrdm_dpart, mrm.mrrdm_crncy, mrm.mrrdm_cntct,
          mrm.mrrdm_trnno, mrm.mrrdm_ttype, mrm.mrrdm_pyamt
          FROM tmpb_mrrdm mrm
          LEFT JOIN tmtb_jrnlm jrm ON mrm.mrrdm_trnno = jrm.jrnlm_refno
          WHERE jrm.jrnlm_refno IS NULL`;
    const params_data_m = [];
    const rows_data_m = await dbGetAll(
      sql_data_m,
      params_data_m,
      `get pending master data- ${user_c}`,
    );

    if (rows_data_m.length === 0) {
      return res.json({
        success: false,
        message: "No pending data found",
        data: [],
      });
    }

    //PULL :: currently active accounting period
    const sql_acprd = `SELECT prd.id AS acprd_id, prd.acprd_fsyar AS fsyar_id
          FROM tmtb_acprd prd
          WHERE prd.acprd_dpart = $1
          AND prd.acprd_bsins = $2
          AND prd.acprd_users = $3
          AND prd.acprd_stats = 'Open'
          AND prd.acprd_iscur = TRUE
          AND prd.acprd_actve = TRUE`;
    const params_acprd = [jrnlm_dpart, user_b, user_c];
    const row_acprd = await dbGet(
      sql_acprd,
      params_acprd,
      "Get accounts period",
    );
    if (!row_acprd) {
      return res.json({
        success: false,
        message: "No active fiscal year or accounting period found",
        data: {},
      });
    }
    if (row_acprd.length > 1) {
      return res.json({
        success: false,
        message: "Multiple active accounting periods found. Please select one.",
        data: {},
      });
    }

    //build scripts
    const scripts = [];
    //PREPARE :: scripts for JV for each Master Data
    for (row of rows_data_m) {
      const newTrn = await GenNewTrn(
        user_c,
        user_b,
        "tmtb_jrnlm",
        "Purchase Voucher",
        jrnlm_dpart,
      );

      const masterId = uuidv4();

      //PUSH :: JV master data
      scripts.push({
        sql: `INSERT INTO tmtb_jrnlm(id, jrnlm_users, jrnlm_bsins, jrnlm_dpart, jrnlm_fsyar, jrnlm_acprd,
    jrnlm_crncy, jrnlm_trtyp, jrnlm_trnno, jrnlm_trdat, jrnlm_refno, jrnlm_narrt,
    jrnlm_drval, jrnlm_crval, jrnlm_stats, jrnlm_crusr, jrnlm_upusr)
    VALUES ($1, $2, $3, $4, $5, $6,
    $7, $8, $9, $10, $11, $12,
    $13, $14, $15, $16, $17)`,
        params: [
          masterId,
          user_c,
          user_b,
          jrnlm_dpart,
          row_acprd.fsyar_id,
          row_acprd.acprd_id,
          row.mrrdm_crncy,
          "Purchase Voucher",
          newTrn,
          jrnlm_trdat,
          row.mrrdm_trnno,
          row.mrrdm_ttype,
          0,
          0,
          "Posted",
          user_s,
          user_s,
        ],
        label: `create journal- ${row.mrrdm_trnno}`,
      });

      //PULL :: pending detail data for each master data
      const sql_data_c = `SELECT mrd.id, mrd.mrrdc_users, mrd.mrrdc_bsins, mrd.mrrdc_mrrdm,
        mrd.mrrdc_items, mrd.mrrdc_itqty * mrd.mrrdc_csrat as dramt,
        pty.party_chtac AS chtac_id, pty.id AS party_id
        FROM tmpb_mrrdc mrd
        JOIN tmtb_party pty ON mrd.mrrdc_items = pty.party_vndor
      WHERE mrd.mrrdc_mrrdm = $1`;
      const params_data_c = [row.id];
      const rows_data_c = await dbGetAll(
        sql_data_c,
        params_data_c,
        `get pending detail data- ${user_c}`,
      );

      //1. Inventory Cost
      let line = 1;
      for (rowc of rows_data_c) {
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
            rowc.chtac_id,
            rowc.party_id,
            rowc.dramt,
            0,
            "",
            "Material Receipt Report",
            rowc.id,
            line,
            user_s,
            user_s,
          ],
          label: `Created jouranl detail ${newTrn}`,
        });
        line++;
      }

      //find supplier payable
      // const sql_sup_pybl = `SELECT pty.id AS party_id, pty.party_chtac AS chtac_id
      //   FROM tmtb_party pty
      //   JOIN tmtb_chtac cht ON pty.party_chtac = cht.id
      //   JOIN tmtb_prtya pta ON cht.chtac_chtno = pta.prtya_chtno
      //   JOIN tmsb_shtbl tbl ON pta.prtya_shtbl = tbl.id
      //   WHERE pty.party_vndor = $1
      //   AND tbl.shtbl_gname = 'SYS_MRR_DIRECT'`;
      // const params_sup_pybl = [row.mrrdm_cntct];
      // const row_sup_pybl = await dbGet(
      //   sql_sup_pybl,
      //   params_sup_pybl,
      //   "Get supplier payable",
      // );
      // if (!row_sup_pybl) {
      //   return res.json({
      //     success: false,
      //     message: "No active supplier payble account found",
      //     data: {},
      //   });
      // }
      // scripts.push({
      //   sql: `INSERT INTO tmtb_jrnlc(id, jrnlc_users, jrnlc_bsins, jrnlc_dpart, jrnlc_jrnlm, jrnlc_chtac,
      //   jrnlc_party, jrnlc_drval, jrnlc_crval, jrnlc_descr, jrnlc_sorce, jrnlc_refid,
      //   jrnlc_lines, jrnlc_crusr, jrnlc_upusr)
      //   VALUES ($1, $2, $3, $4, $5, $6,
      //   $7, $8, $9, $10, $11, $12,
      //   $13, $14, $15)`,
      //   params: [
      //     uuidv4(),
      //     user_c,
      //     user_b,
      //     jrnlm_dpart,
      //     masterId,
      //     row_sup_pybl.chtac_id,
      //     row_sup_pybl.party_id,
      //     0,
      //     row.mrrdm_pyamt,
      //     "",
      //     "Material Receipt Report",
      //     masterId,
      //     line,
      //     user_s,
      //     user_s,
      //   ],
      //   label: `Created jouranl detail ${newTrn}`,
      // });
      line++;
    }

    console.log("scripts", scripts);
    await dbRunAll(scripts);
    res.json({
      success: true,
      message: `Material Receipt Report - Created successfully.`,
      data: {},
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

router.post("/create-auto-journal", async (req, res) => {
  try {
    const { jrnlm_dpart, jrnlm_trdat, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!jrnlm_dpart || !jrnlm_trdat || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    //PULL :: pending master data
    const sql_data_m = `SELECT mrm.id, mrm.mrrdm_users, mrm.mrrdm_bsins, mrm.mrrdm_dpart, mrm.mrrdm_crncy, mrm.mrrdm_cntct,
          mrm.mrrdm_trnno, mrm.mrrdm_ttype, mrm.mrrdm_pyamt
          FROM tmpb_mrrdm mrm
          LEFT JOIN tmtb_jrnlm jrm ON mrm.mrrdm_trnno = jrm.jrnlm_refno
          WHERE jrm.jrnlm_refno IS NULL`;
    const params_data_m = [];
    const rows_data_m = await dbGetAll(
      sql_data_m,
      params_data_m,
      `get pending master data- ${user_c}`,
    );
    if (rows_data_m.length === 0) {
      return res.json({
        success: false,
        message: "No pending data found",
        data: [],
      });
    }

    //PULL :: currently active accounting period
    const sql_acprd = `SELECT prd.id AS acprd_id, prd.acprd_fsyar AS fsyar_id
          FROM tmtb_acprd prd
          WHERE prd.acprd_dpart = $1
          AND prd.acprd_bsins = $2
          AND prd.acprd_users = $3
          AND prd.acprd_stats = 'Open'
          AND prd.acprd_iscur = TRUE
          AND prd.acprd_actve = TRUE`;
    const params_acprd = [jrnlm_dpart, user_b, user_c];
    const row_acprd = await dbGet(
      sql_acprd,
      params_acprd,
      "Get accounts period",
    );
    if (!row_acprd) {
      return res.json({
        success: false,
        message: "No active fiscal year or accounting period found",
        data: {},
      });
    }
    if (row_acprd.length > 1) {
      return res.json({
        success: false,
        message: "Multiple active accounting periods found. Please select one.",
        data: {},
      });
    }

    //build scripts
    const scripts = [];
    //PREPARE :: scripts for JV for each Master Data
    for (row of rows_data_m) {
      const newTrn = await GenNewTrn(
        user_c,
        user_b,
        "tmtb_jrnlm",
        "Purchase Voucher",
        jrnlm_dpart,
      );

      const masterId = uuidv4();

      //PUSH :: JV master data
      scripts.push({
        sql: `INSERT INTO tmtb_jrnlm(id, jrnlm_users, jrnlm_bsins, jrnlm_dpart, jrnlm_fsyar, jrnlm_acprd,
    jrnlm_crncy, jrnlm_trtyp, jrnlm_trnno, jrnlm_trdat, jrnlm_refno, jrnlm_narrt,
    jrnlm_drval, jrnlm_crval, jrnlm_stats, jrnlm_crusr, jrnlm_upusr)
    VALUES ($1, $2, $3, $4, $5, $6,
    $7, $8, $9, $10, $11, $12,
    $13, $14, $15, $16, $17)`,
        params: [
          masterId,
          user_c,
          user_b,
          jrnlm_dpart,
          row_acprd.fsyar_id,
          row_acprd.acprd_id,
          row.mrrdm_crncy,
          "Purchase Voucher",
          newTrn,
          new Date(),
          row.mrrdm_trnno,
          row.mrrdm_ttype,
          0,
          0,
          "Posted",
          user_s,
          user_s,
        ],
        label: `create journal- ${row.mrrdm_trnno}`,
      });

      //PULL :: 1.1 Inventory after Discount, iVAT
      const sql_data_c = `SELECT mrd.id, mrd.mrrdc_users, mrd.mrrdc_bsins, mrd.mrrdc_mrrdm,
        mrd.mrrdc_items, ((mrd.mrrdc_itrat * mrd.mrrdc_itqty) + mrd.mrrdc_ivamt) - (mrd.mrrdc_dsamt + mrd.mrrdc_edamt) as dramt,
        pty.party_chtac AS chtac_id, pty.id AS party_id
        FROM tmpb_mrrdc mrd
        JOIN tmtb_party pty ON mrd.mrrdc_items = pty.party_vndor
      WHERE mrd.mrrdc_mrrdm = $1`;
      const params_data_c = [row.id];
      const rows_data_c = await dbGetAll(
        sql_data_c,
        params_data_c,
        `get pending detail data- ${user_c}`,
      );

      //PUSH :: 1.1 Inventory after Discount, iVAT
      let line = 1;
      for (rowc of rows_data_c) {
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
            rowc.chtac_id,
            rowc.party_id,
            rowc.dramt,
            0,
            "",
            "Material Receipt Report",
            rowc.id,
            line,
            user_s,
            user_s,
          ],
          label: `Create inventory JV ${newTrn}`,
        });
        line++;
      }

      //PULL :: 1.2 Payble Products after Discount, iVAT
      const sql_sup_pybl = `SELECT pty.id party_id, pty.party_chtac chtac_id
          FROM tmtb_prtyn ptn
          JOIN tmtb_party pty ON ptn.prtyn_chtac = pty.party_chtac
          WHERE ptn.prtyn_cname = 'SYS_MRR_DIRECT'
          AND ptn.prtyn_ctype = 'PAYABLE'
          AND pty.party_vndor = $1`;
      const params_sup_pybl = [row.mrrdm_cntct];
      const row_sup_pybl = await dbGet(
        sql_sup_pybl,
        params_sup_pybl,
        "Get supplier payable",
      );
      if (!row_sup_pybl) {
        return res.json({
          success: false,
          message: "No active supplier payble account found",
          data: {},
        });
      }
      const sql_sup_pybl_val = `SELECT SUM((mrd.mrrdc_itrat * mrd.mrrdc_itqty) - (mrd.mrrdc_dsamt + mrd.mrrdc_edamt)) as dramt,
      SUM(mrd.mrrdc_ivamt) as ivamt
        FROM tmpb_mrrdc mrd
        JOIN tmtb_party pty ON mrd.mrrdc_items = pty.party_vndor
     WHERE mrd.mrrdc_mrrdm = $1`;
      const params_sup_pybl_val = [row.id];
      const row_sup_pybl_val = await dbGet(
        sql_sup_pybl_val,
        params_sup_pybl_val,
        "Get supplier payable value",
      );

      if (!row_sup_pybl_val) {
        return res.json({
          success: false,
          message: "No supplier payble value found",
          data: {},
        });
      }

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
          row_sup_pybl.chtac_id,
          row_sup_pybl.party_id,
          0,
          row_sup_pybl_val.dramt,
          "",
          "Material Receipt Report",
          masterId,
          line,
          user_s,
          user_s,
        ],
        label: `Create Supplier Payble JV ${newTrn}`,
      });
      line++;


    }

    console.log("scripts", scripts);
    await dbRunAll(scripts);
    res.json({
      success: true,
      message: `Material Receipt Report - Created successfully.`,
      data: {},
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
