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
    ORDER BY mrr.mrrdm_trnno ASC`;

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
      mrrdm_invds, mrrdm_ivtmt, mrrdm_vtamt, mrrdm_txamt, mrrdm_fcamt, mrrdm_icamt, mrrdm_ecamt,
      mrrdm_pyamt, mrrdm_pdamt, mrrdm_duamt, mrrdm_exrat, mrrdm_vehid, mrrdm_ispst,
      mrrdm_ispad, mrrdm_isqcp, mrrdm_isapp, mrrdm_crusr, mrrdm_upusr)
    VALUES ($1, $2, $3, $4, $5, $6,
    $7, $8, $9, $10, $11, $12,
      $13, $14, $15, $16, $17, $18,
      $19, $20, $21, $22, $23, $24,
      $25, $26, $27, $28, $29,
      $30, $31)`,
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

    //Insert MRR details
    for (const det of tmpb_mrrdc) {
      scripts.push({
        sql: `INSERT INTO tmpb_mrrdc(id, mrrdc_users, mrrdc_bsins, mrrdc_mrrdm, mrrdc_price, mrrdc_items,
        mrrdc_units, mrrdc_itrat, mrrdc_itqty, mrrdc_itamt, mrrdc_dspct, mrrdc_dsamt,
        mrrdc_ivpct, mrrdc_ivamt, mrrdc_vtpct, mrrdc_vtamt, mrrdc_txpct, mrrdc_txamt,
        mrrdc_fcpct, mrrdc_fcamt, mrrdc_icamt, mrrdc_ecamt, mrrdc_ntamt, mrrdc_notes, mrrdc_csrat,
        mrrdc_refid, mrrdc_crusr, mrrdc_upusr)
        VALUES ($1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11, $12,
      $13, $14, $15, $16, $17, $18,
      $19, $20, $21, $22, $23, $24,
      $25, $26, $27, $28)`,
        params: [
          uuidv4(),
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
    }

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
    const rows = await dbGetAll(sql, params, `get expenses payments heads- ${user_c}`);
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
