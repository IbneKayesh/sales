const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");
const { GenNewCode, GenNewTrn } = require("../../db/genHelper");

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
    const sql = `SELECT mrr.*, dpt.dpart_cname, cnt.cntct_cname,
    csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 as edit_stop
    FROM tmpb_mrrdm mrr
    JOIN tmsb_dpart dpt ON mrr.mrrdm_dpart = dpt.id
    JOIN tmcb_cntct cnt ON mrr.mrrdm_cntct = cnt.id
    LEFT JOIN tmhb_emply csr ON mrr.mrrdm_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON mrr.mrrdm_upusr = usr.id
    WHERE mrr.mrrdm_users = $1
    ORDER BY mrr.mrrdm_trdat DESC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get MRR- ${user_c}`);
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
    const sql = `SELECT mrr.*,
    csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 as edit_stop
    FROM tmpb_mrrdm mrr
    LEFT JOIN tmhb_emply csr ON mrr.mrrdm_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON mrr.mrrdm_upusr = usr.id
    WHERE mrr.mrrdm_users = $1
    AND mrr.mrrdm_actve = TRUE
    ORDER BY mrr.mrrdm_trnno ASC`;

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
      mrrdm_users,
      mrrdm_bsins,
      mrrdm_dpart,
      mrrdm_crncy,
      mrrdm_cntct,
      mrrdm_ttype,
      mrrdm_trnno,
      mrrdm_trdat,
      mrrdm_refno,
      mrrdm_notes,
      mrrdm_tramt,
      mrrdm_itmds,
      mrrdm_dspct,
      mrrdm_invds,
      mrrdm_ivtmt,
      mrrdm_vtamt,
      mrrdm_txamt,
      mrrdm_fcamt,
      mrrdm_icamt,
      mrrdm_ecamt,
      mrrdm_pyamt,
      mrrdm_pdamt,
      mrrdm_duamt,
      mrrdm_exrat,
      mrrdm_vehid,
      mrrdm_ispst,
      mrrdm_ispad,
      mrrdm_isqcp,
      mrrdm_isapp,
      tmpb_mrrdc,
      tmpb_mrrcs,
      tmpb_mrrpy,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !mrrdm_dpart ||
      !mrrdm_crncy ||
      !mrrdm_cntct ||
      !mrrdm_ttype ||
      !mrrdm_exrat ||
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
    const newId = uuidv4();
    //const newCode = await GenNewCode(user_c, "tmpb_mrrdm");
    const newTrnNo = await GenNewTrn(
      user_c,
      user_b,
      "tmpb_mrrdm",
      mrrdm_ttype, //"Material Receipt Report",
      mrrdm_dpart,
    );
    //build scripts
    const scripts = [];
    scripts.push({
      sql: `INSERT INTO tmpb_mrrdm(id, mrrdm_users, mrrdm_bsins, mrrdm_dpart, mrrdm_crncy, mrrdm_cntct,
      mrrdm_ttype, mrrdm_trnno, mrrdm_trdat, mrrdm_refno, mrrdm_notes, mrrdm_tramt, mrrdm_itmds,
      mrrdm_dspct, mrrdm_invds, mrrdm_ivtmt, mrrdm_vtamt, mrrdm_txamt, mrrdm_fcamt, mrrdm_icamt, mrrdm_ecamt,
      mrrdm_pyamt, mrrdm_pdamt, mrrdm_duamt, mrrdm_exrat, mrrdm_vehid, mrrdm_ispst,
      mrrdm_ispad, mrrdm_isqcp, mrrdm_isapp, mrrdm_crusr, mrrdm_upusr)
    VALUES ($1, $2, $3, $4, $5, $6,
    $7, $8, $9, $10, $11, $12,
      $13, $14, $15, $16, $17, $18,
      $19, $20, $21, $22, $23, $24,
      $25, $26, $27, $28, $29,
      $30, $31, $32)`,
      params: [
        newId,
        user_c,
        user_b,
        mrrdm_dpart,
        mrrdm_crncy,
        mrrdm_cntct,
        mrrdm_ttype,
        newTrnNo,
        mrrdm_trdat,
        mrrdm_refno,
        mrrdm_notes,
        mrrdm_tramt || 0,
        mrrdm_itmds || 0,
        mrrdm_dspct || 0,
        mrrdm_invds || 0,
        mrrdm_ivtmt || 0,
        mrrdm_vtamt || 0,
        mrrdm_txamt || 0,
        mrrdm_fcamt || 0,
        mrrdm_icamt || 0,
        mrrdm_ecamt || 0,
        mrrdm_pyamt || 0,
        mrrdm_pdamt || 0,
        mrrdm_duamt || 0,
        mrrdm_exrat || 1,
        mrrdm_vehid,
        true,
        mrrdm_ispad,
        true,
        true,
        user_s,
        user_s,
      ],
      label: `Created MRR ${newTrnNo}`,
    });

    //Insert MRR details, Stock Details
    for (const det of tmpb_mrrdc) {
      const lineId = uuidv4();
      scripts.push({
        sql: `INSERT INTO tmpb_mrrdc(id, mrrdc_users, mrrdc_bsins, mrrdc_mrrdm, mrrdc_price, mrrdc_items,
        mrrdc_units, mrrdc_itrat, mrrdc_itqty, mrrdc_itamt, mrrdc_dspct, mrrdc_dsamt, mrrdc_edamt,
        mrrdc_ivpct, mrrdc_ivamt, mrrdc_vtpct, mrrdc_vtamt, mrrdc_txpct, mrrdc_txamt,
        mrrdc_fcpct, mrrdc_fcamt, mrrdc_icamt, mrrdc_ecamt, mrrdc_ntamt, mrrdc_notes, mrrdc_csrat,
        mrrdc_refid, mrrdc_crusr, mrrdc_upusr)
        VALUES ($1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11, $12,
      $13, $14, $15, $16, $17, $18,
      $19, $20, $21, $22, $23, $24,
      $25, $26, $27, $28, $29)`,
        params: [
          lineId,
          user_c,
          user_b,
          newId,
          det.mrrdc_price,
          det.mrrdc_items,
          det.mrrdc_units,
          det.mrrdc_itrat || 0,
          det.mrrdc_itqty || 0,
          det.mrrdc_itamt || 0,
          det.mrrdc_dspct || 0,
          det.mrrdc_dsamt || 0,
          det.mrrdc_edamt || 0,
          det.mrrdc_ivpct || 0,
          det.mrrdc_ivamt || 0,
          det.mrrdc_vtpct || 0,
          det.mrrdc_vtamt || 0,
          det.mrrdc_txpct || 0,
          det.mrrdc_txamt || 0,
          det.mrrdc_fcpct || 0,
          det.mrrdc_fcamt || 0,
          det.mrrdc_icamt || 0,
          det.mrrdc_ecamt || 0,
          det.mrrdc_ntamt || 0,
          det.mrrdc_notes || "",
          det.mrrdc_csrat || 0,
          det.mrrdc_refid || "",
          user_s,
          user_s,
        ],
        label: `Created MRR detail ${newTrnNo}`,
      });

      //add condition if no tracking then off
      scripts.push({
        sql: `INSERT INTO tmib_stock(id, stock_users, stock_bsins, stock_dpart, stock_sorce, stock_trnno,
        stock_refid, stock_items, stock_price, stock_brcod, stock_batch, stock_srial,
        stock_wrdat, stock_fgdat, stock_exdat, stock_trqty, stock_ohqty, stock_cprat,
        stock_lprat, stock_notes, stock_crusr, stock_upusr)
        VALUES ($1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11, $12,
      $13, $14, $15, $16, $17, $18,
      $19, $20, $21, $22)`,
        params: [
          uuidv4(),
          user_c,
          user_b,
          mrrdm_dpart,
          mrrdm_ttype,
          newTrnNo,
          lineId,
          det.mrrdc_items,
          det.mrrdc_price,
          det.stock_brcod, //
          det.stock_batch, //
          det.stock_srial, //
          det.stock_wrdat, //
          det.stock_fgdat, //
          det.stock_exdat, //
          det.mrrdc_itqty || 0,
          det.mrrdc_itqty || 0,
          det.mrrdc_csrat || 0,
          det.mrrdc_itrat || 0,
          det.stock_notes || "",
          user_s,
          user_s,
        ],
        label: `Created MRR stock detail ${newTrnNo}`,
      });
      //update summary stock
      scripts.push({
        sql: `UPDATE tmib_price
              SET price_lprat = $1,
                  price_gdstk = price_gdstk + $2,
                  price_upusr = $3,
                  price_updat = CURRENT_TIMESTAMP,
                  price_rvnmr = price_rvnmr + 1
                  WHERE id = $4
                  AND price_users = $5
                  AND price_items = $6`,
        params: [
          det.mrrdc_itrat,
          det.mrrdc_itqty || 0,
          user_s,
          det.mrrdc_price,
          user_c,
          det.mrrdc_items,
        ],
        label: `Update price stock detail ${newTrnNo}`,
      });
    }

    //Insert Costing details
    for (const det of tmpb_mrrcs) {
      scripts.push({
        sql: `INSERT INTO tmpb_mrrcs(id, mrrcs_users, mrrcs_bsins, mrrcs_mrrdm, mrrcs_party, mrrcs_csmod, 
        mrrcs_clmod, mrrcs_value, mrrcs_notes, mrrcs_crusr, mrrcs_upusr)
        VALUES ($1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11)`,
        params: [
          uuidv4(),
          user_c,
          user_b,
          newId,
          det.mrrcs_party,
          det.mrrcs_csmod,
          det.mrrcs_clmod,
          det.mrrcs_value || 0,
          det.mrrcs_notes || "",
          user_s,
          user_s,
        ],
        label: `Created Costing detail ${newTrnNo}`,
      });
    }

    //Insert Payment details
    for (const det of tmpb_mrrpy) {
      scripts.push({
        sql: `INSERT INTO tmpb_mrrpy(id, mrrpy_users, mrrpy_bsins, mrrpy_mrrdm, mrrpy_party, mrrpy_pdamt,
        mrrpy_refno, mrrpy_notes, mrrpy_crusr, mrrpy_upusr)
        VALUES ($1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10)`,
        params: [
          uuidv4(),
          user_c,
          user_b,
          newId,
          det.mrrpy_party,
          det.mrrpy_pdamt || 0,
          det.mrrpy_refno || "",
          det.mrrpy_notes || "",
          user_s,
          user_s,
        ],
        label: `Created Payment detail ${newTrnNo}`,
      });
    }

    //Update supplier credit balance + increase
    scripts.push({
      sql: `UPDATE tmcb_cntct
      SET cntct_crbal = cntct_crbal + $1,      
    cntct_upusr = $2,
    cntct_updat = CURRENT_TIMESTAMP,
    cntct_rvnmr = cntct_rvnmr + 1
    WHERE id = $3
      `,
      params: [mrrdm_duamt, user_s, mrrdm_cntct],
      label: `Update supplier credit balance ${newTrnNo}`,
    });

    await dbRunAll(scripts);

    res.json({
      success: true,
      message: "MRR created successfully",
      data: {
        ...req.body,
        mrrdm_trnno: newTrnNo,
      },
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
      success: true,
      message: `Update feature is unavailable.`,
      data: {},
    });
    const {
      id,
      dpart_users,
      dpart_bsins,
      dpart_ccode,
      dpart_cname,
      dpart_ofadr,
      dpart_emcap,
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
    dpart_upusr = $4,
    dpart_updat = CURRENT_TIMESTAMP,
    dpart_rvnmr = dpart_rvnmr + 1
    WHERE id = $5`;
    const params = [dpart_cname, dpart_ofadr, dpart_emcap, user_s, id];

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

// get-details-by-master
router.post("/get-details-by-master", async (req, res) => {
  try {
    const { mrrdc_mrrdm, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!mrrdc_mrrdm || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT mrd.*,
    itm.items_iname, itm.items_szqty, unt.units_cname AS runit_uname, sunit.units_cname as sunit_cname,
     0 as edit_stop
    FROM tmpb_mrrdc mrd
    LEFT JOIN tmib_items itm ON mrd.mrrdc_items = itm.id
    LEFT JOIN tmib_units unt ON mrd.mrrdc_units = unt.id
    LEFT JOIN tmib_units sunit ON itm.items_sunit = sunit.id
    WHERE mrd.mrrdc_users = $1
    AND mrd.mrrdc_mrrdm = $2
    ORDER BY mrd.mrrdc_items ASC`;

    const params = [user_c, mrrdc_mrrdm];
    const rows = await dbGetAll(sql, params, `get MRR Details- ${user_c}`);
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
// get-costs-by-master
router.post("/get-costs-by-master", async (req, res) => {
  try {
    const { mrrcs_mrrdm, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!mrrcs_mrrdm || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT mrc.*, pty.party_cname
        FROM tmpb_mrrcs mrc
        JOIN tmtb_party pty ON mrc.mrrcs_party = pty.id
        WHERE mrc.mrrcs_users = $1
        AND mrc.mrrcs_mrrdm = $2`;

    const params = [user_c, mrrcs_mrrdm];
    const rows = await dbGetAll(sql, params, `get Cost Details- ${user_c}`);
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
// get-payments-by-master
router.post("/get-payments-by-master", async (req, res) => {
  try {
    const { mrrpy_mrrdm, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!mrrpy_mrrdm || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT mpy.*, pty.party_cname
        FROM tmpb_mrrpy mpy
        JOIN tmtb_party pty ON mpy.mrrpy_party = pty.id
        WHERE mpy.mrrpy_users = $1
        AND mpy.mrrpy_mrrdm = $2`;

    const params = [user_c, mrrpy_mrrdm];
    const rows = await dbGetAll(sql, params, `get Payment Details- ${user_c}`);
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

// get-expenses-payments-heads
router.post("/get-expenses-payments-heads", async (req, res) => {
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
    const sql = `SELECT pty.*, ptn.prtyn_ctype
      FROM tmtb_party pty
      JOIN tmtb_prtyn ptn ON pty.id = ptn.prtyn_party
      WHERE ptn.prtyn_cname = 'SYS_MRR_DIRECT'
      AND pty.party_users = ptn.prtyn_users
      AND pty.party_users = $1
      AND pty.party_actve = TRUE
      AND ptn.prtyn_actve = TRUE
      ORDER BY pty.party_ptype`;

    const params = [user_c];
    const rows = await dbGetAll(
      sql,
      params,
      `get expenses payments heads- ${user_c}`,
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

// get-all-due-mrr
router.post("/get-all-due-mrr", async (req, res) => {
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
    const sql = `SELECT mrr.*,
    dprt.dpart_cname, cntct.cntct_cname,
    csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 as edit_stop
    FROM tmpb_mrrdm mrr
    JOIN tmsb_dpart dprt ON mrr.mrrdm_dpart = dprt.id
    JOIN tmcb_cntct cntct ON mrr.mrrdm_cntct = cntct.id
    LEFT JOIN tmhb_emply csr ON mrr.mrrdm_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON mrr.mrrdm_upusr = usr.id
    WHERE mrr.mrrdm_users = $1
    AND mrr.mrrdm_actve = TRUE
    AND (mrr.mrrdm_pyamt - mrr.mrrdm_pdamt) > 0
    ORDER BY mrr.mrrdm_trdat DESC`;

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
