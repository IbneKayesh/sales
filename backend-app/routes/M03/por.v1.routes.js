const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");
const { GenNewTrn } = require("../../db/genHelper");
const { buildJournalScripts } = require("../../db/journalService");

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
    FROM tmpb_pordm mrr
    JOIN tmsb_dpart dpt ON mrr.pordm_dpart = dpt.id
    JOIN tmcb_cntct cnt ON mrr.pordm_cntct = cnt.id
    LEFT JOIN tmhb_emply csr ON mrr.pordm_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON mrr.pordm_upusr = usr.id
    WHERE mrr.pordm_users = $1
    ORDER BY mrr.pordm_trdat DESC`;

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
    FROM tmpb_pordm mrr
    LEFT JOIN tmhb_emply csr ON mrr.pordm_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON mrr.pordm_upusr = usr.id
    WHERE mrr.pordm_users = $1
    AND mrr.pordm_actve = TRUE
    ORDER BY mrr.pordm_trnno ASC`;

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

const create = async (req, res) => {
  try {
    const {
      id,
      pordm_users,
      pordm_bsins,
      pordm_dpart,
      pordm_cntct,
      pordm_ttype,
      pordm_trnno,
      pordm_trdat,
      pordm_refno,
      pordm_notes,
      pordm_tramt,
      pordm_itmds,
      pordm_vtamt,
      pordm_icamt,
      pordm_ecamt,
      pordm_pyamt,
      pordm_pdamt,
      pordm_duamt,
      pordm_stamt,
      pordm_csamt,
      pordm_dlvry,
      pordm_ispst,
      pordm_ispad,
      pordm_ispnd,
      pordm_isapp,
      party_id,
      chtac_id,
      tmpb_pordc,
      tmpb_porcs,
      tmpb_porpy,
      tmpb_pordf,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !pordm_dpart ||
      !pordm_cntct ||
      !pordm_ttype ||
      !tmpb_pordc ||
      !party_id ||
      !chtac_id ||
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
    const newTrnNo = await GenNewTrn(
      user_c,
      user_b,
      "tmpb_pordm",
      pordm_ttype, //"Purchase Order",
      pordm_dpart,
    );

    //build scripts
    const scripts = [];
    scripts.push({
      sql: `INSERT INTO tmpb_pordm(id, pordm_users, pordm_bsins, pordm_dpart, pordm_cntct, pordm_ttype,
      pordm_trnno, pordm_trdat, pordm_refno, pordm_notes, pordm_tramt, pordm_itmds,
      pordm_vtamt, pordm_icamt, pordm_ecamt, pordm_pyamt,
      pordm_pdamt, pordm_duamt, pordm_stamt, pordm_csamt, pordm_dlvry, pordm_ispst,
      pordm_ispad, pordm_ispnd, pordm_isapp, pordm_crusr, pordm_upusr)
    VALUES ($1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11, $12,
      $13, $14, $15, $16, $17, $18,
      $19, $20, $21, $22, $23, $24,
      $25, $26, $27)`,
      params: [
        newId,
        user_c,
        user_b,
        pordm_dpart,
        pordm_cntct,
        pordm_ttype,
        newTrnNo,
        pordm_trdat,
        pordm_refno,
        pordm_notes,
        pordm_tramt || 0,
        pordm_itmds || 0,
        pordm_vtamt || 0,
        pordm_icamt || 0,
        pordm_ecamt || 0,
        pordm_pyamt || 0,
        pordm_pdamt || 0,
        pordm_duamt || 0,
        pordm_stamt || 0,
        pordm_csamt || 0,
        pordm_dlvry,
        true,
        pordm_ispad,
        true,
        true,
        user_s,
        user_s,
      ],
      label: `Created PO ${newTrnNo}`,
    });

    for (const det of tmpb_pordc) {
      const lineId = uuidv4();
      scripts.push({
        sql: `INSERT INTO tmpb_pordc(id, pordc_users, pordc_bsins, pordc_pordm, pordc_price, pordc_items,
                          pordc_units, pordc_itrat, pordc_itqty, pordc_itamt, pordc_dspct, pordc_dsamt,
                          pordc_vtpct, pordc_vtamt, pordc_vtype, pordc_icamt, pordc_ecamt,
                          pordc_pyamt, pordc_stamt, pordc_notes, pordc_csrat, pordc_refid, pordc_crusr, pordc_upusr)
        VALUES ($1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11, $12,
      $13, $14, $15, $16, $17, $18,
      $19, $20, $21, $22, $23, $24)`,
        params: [
          lineId,
          user_c,
          user_b,
          newId,
          det.pordc_price,
          det.pordc_items,
          det.pordc_units,
          det.pordc_itrat || 0,
          det.pordc_itqty || 0,
          det.pordc_itamt || 0,
          det.pordc_dspct || 0,
          det.pordc_dsamt || 0,
          det.pordc_vtpct || 0,
          det.pordc_vtamt || 0,
          det.pordc_vtype || "-",
          det.pordc_icamt || 0,
          det.pordc_ecamt || 0,
          det.pordc_pyamt || 0,
          det.pordc_stamt || 0,
          det.pordc_notes || "",
          det.pordc_csrat || 0,
          det.pordc_refid || "",
          user_s,
          user_s,
        ],
        label: `Created MRR detail ${newTrnNo}`,
      });

      //update purchase booking stock increase
      scripts.push({
        sql: `UPDATE tmib_price
              SET price_pbqty = price_pbqty + $1,
                  price_upusr = $2,
                  price_updat = CURRENT_TIMESTAMP,
                  price_rvnmr = price_rvnmr + 1
                  WHERE id = $3
                  AND price_users = $4
                  AND price_items = $5
                  AND price_dpart = $6`,
        params: [
          det.pordc_itqty || 0,
          user_s,
          det.pordc_price,
          user_c,
          det.pordc_items,
          pordm_dpart,
        ],
        label: `Update price purchase order detail ${newTrnNo}`,
      });
    }

    //Insert Costing details :: DON'T create any Journal for COSTING
    for (const det of tmpb_porcs) {
      const costId = uuidv4();
      scripts.push({
        sql: `INSERT INTO tmpb_porcs(id, porcs_users, porcs_bsins, porcs_pordm, porcs_party, porcs_csmod, 
        porcs_clmod, porcs_value, porcs_notes, porcs_jrnlm, porcs_crusr, porcs_upusr)
        VALUES ($1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11, $12)`,
        params: [
          costId,
          user_c,
          user_b,
          newId,
          det.porcs_party, //party id
          det.porcs_csmod, //costing mode
          det.porcs_clmod, //calculation mode
          det.porcs_value || 0,
          det.porcs_notes || "",
          det.porcs_csmod === "Exclude"
            ? "SYS_FOR_PAYMENT"
            : "SYS_NOT_FOR_PAYMENT",
          user_s,
          user_s,
        ],
        label: `Created PO Costing detail ${newTrnNo}`,
      });
    }

    //Insert Payment details :: IF ANY CREATE ASSETS / SUPPLIER ADVANCE
    for (const det of tmpb_porpy) {
      scripts.push({
        sql: `INSERT INTO tmpb_porpy(id, porpy_users, porpy_bsins, porpy_pordm, porpy_party, porpy_pdamt,
        porpy_refno, porpy_notes, porpy_crusr, porpy_upusr)
        VALUES ($1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10)`,
        params: [
          uuidv4(),
          user_c,
          user_b,
          newId,
          det.porpy_party,
          det.porpy_pdamt || 0,
          det.porpy_refno || newTrnNo,
          det.porpy_notes || "",
          user_s,
          user_s,
        ],
        label: `Created Payment detail ${newTrnNo}`,
      });
    }

    // ─── NEW: Journal entry via centralized helper (conditional on payment) ───
    if (Number(pordm_pdamt) > 0) {
      const jrnlDetails = [];

      // FROM :: Assets / CASH BANK (CR)
      for (const det of tmpb_porpy) {
        jrnlDetails.push({
          chtac: det.chtac_id,
          party: det.party_id,
          drval: 0,
          crval: det.porpy_pdamt || 0,
          descr: "From Assets / Cash Bank",
          sorce: pordm_ttype,
          refid: newId,
        });
      }

      // TO :: Assets / Supplier advance (DR)
      jrnlDetails.push({
        chtac: chtac_id,
        party: party_id,
        drval: pordm_pdamt || 0,
        crval: 0,
        descr: "To Assets / Supplier Advance",
        sorce: pordm_ttype,
        refid: newId,
      });

      const { scripts: jrnlScripts } = await buildJournalScripts({
        user_c,
        user_b,
        user_s,
        dpart: pordm_dpart,
        trtyp: "Purchase Order",
        trdat: pordm_trdat,
        refno: newTrnNo,
        narrt: pordm_ttype,
        drval: pordm_pdamt || 0, //Default total paid amount
        crval: pordm_pdamt || 0, //Default total paid amount
        details: jrnlDetails,
      });
      scripts.push(...jrnlScripts);

      // Update supplier credit balance - decrease
      scripts.push({
        sql: `UPDATE tmcb_cntct
          SET cntct_crbal = cntct_crbal - $1,      
          cntct_upusr = $2,
          cntct_updat = CURRENT_TIMESTAMP,
          cntct_rvnmr = cntct_rvnmr + 1
          WHERE id = $3`,
        params: [pordm_pyamt, user_s, pordm_cntct],
        label: `Update supplier credit balance ${newTrnNo}`,
      });
    }
    //offer pack items
    for (const det of tmpb_pordf) {
      const lineId = uuidv4();
      scripts.push({
        sql: `INSERT INTO tmpb_pordf(id, pordf_users, pordf_bsins, pordf_pordm, pordf_bndlm, pordf_pricm,
                          pordf_itemm, pordf_unitm, pordf_bnqty, pordf_bndlc, pordf_pricc, pordf_itemc,
                          pordf_unitc, pordf_pkqty, pordf_trqty, pordf_ofcnt, pordf_ofqty, pordf_notes,
                          pordf_csrat, pordf_refid, pordf_crusr, pordf_upusr)
        VALUES ($1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11, $12,
      $13, $14, $15, $16, $17, $18,
      $19, $20, $21, $22)`,
        params: [
          lineId,
          user_c,
          user_b,
          newId,
          det.pordf_bndlm,
          det.pordf_pricm,
          det.pordf_itemm,
          det.pordf_unitm,
          det.pordf_bnqty || 1,
          det.pordf_bndlc,
          det.pordf_pricc,
          det.pordf_itemc,
          det.pordf_unitc,
          det.pordf_pkqty || 1,
          det.pordf_trqty || 1,
          det.pordf_ofcnt || 1,
          det.pordf_ofqty || 1,
          det.pordf_notes || "",
          det.pordf_csrat || 0,
          det.pordf_refid || "",
          user_s,
          user_s,
        ],
        label: `Created MRR offer detail ${newTrnNo}`,
      });
    }

    //console.log(scripts);
    await dbRunAll(scripts);

    res.json({
      success: true,
      message: `${newTrnNo} - PO created successfully`,
      data: {
        ...req.body,
        pordm_trnno: newTrnNo,
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
    const { pordc_pordm, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!pordc_pordm || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT mrd.*,
    itm.items_iname, itm.items_pkqty, itm.items_szqty,
    prc.price_cname,
    runit.units_cname as runit_cname,
    punit.units_cname as punit_cname,
    sunit.units_cname as sunit_cname,
    sgrup.sgrup_cname as sgrup_cname,
    scatg.scatg_cname as scatg_cname,
    brand.brand_cname as brand_cname,  
     0 as edit_stop
    FROM tmpb_pordc mrd
    JOIN tmib_items itm ON mrd.pordc_items = itm.id
    JOIN tmib_price prc ON mrd.pordc_price = prc.id
                            AND itm.id = prc.price_items
    JOIN tmib_units runit ON mrd.pordc_units = runit.id
    JOIN tmib_units punit ON itm.items_punit = punit.id
    JOIN tmib_units sunit ON itm.items_sunit = sunit.id
    JOIN tmib_sgrup sgrup ON itm.items_sgrup = sgrup.id
    JOIN tmib_scatg scatg ON itm.items_scatg = scatg.id
    JOIN tmib_brand brand ON itm.items_brand = brand.id
    WHERE mrd.pordc_users = $1
    AND mrd.pordc_pordm = $2
    ORDER BY mrd.pordc_items ASC`;

    const params = [user_c, pordc_pordm];
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
    const { porcs_pordm, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!porcs_pordm || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT mrc.*, pty.party_cname
        FROM tmpb_porcs mrc
        JOIN tmtb_party pty ON mrc.porcs_party = pty.id
        WHERE mrc.porcs_users = $1
        AND mrc.porcs_pordm = $2`;

    const params = [user_c, porcs_pordm];
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
    const { porpy_pordm, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!porpy_pordm || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT mpy.*, pty.party_cname
        FROM tmpb_porpy mpy
        JOIN tmtb_party pty ON mpy.porpy_party = pty.id
        WHERE mpy.porpy_users = $1
        AND mpy.porpy_pordm = $2`;

    const params = [user_c, porpy_pordm];
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
// get-bundles-by-master
router.post("/get-bundles-by-master", async (req, res) => {
  try {
    const { pordf_pordm, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!pordf_pordm || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT mrb.*, prcm.price_cname as bndlm_price_cname,
        untm.units_cname as bndlm_units_cname, prc.price_cname, unt.units_cname,
        bnm.bndlm_ccode, bnm.bndlm_cname, bnm.bndlm_itype
        FROM tmpb_pordf mrb
        JOIN tmib_price prcm ON mrb.pordf_pricm = prcm.id
        JOIN tmib_units untm ON mrb.pordf_unitm = untm.id
        JOIN tmib_price prc ON mrb.pordf_pricc = prc.id
        JOIN tmib_units unt ON mrb.pordf_unitc = unt.id
        JOIN tmib_bndlm bnm ON mrb.pordf_bndlm = bnm.id
        WHERE mrb.pordf_users = $1
        AND mrb.pordf_pordm = $2`;

    const params = [user_c, pordf_pordm];
    const rows = await dbGetAll(sql, params, `get Bundle Details- ${user_c}`);
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
    FROM tmpb_pordm mrr
    JOIN tmsb_dpart dprt ON mrr.pordm_dpart = dprt.id
    JOIN tmcb_cntct cntct ON mrr.pordm_cntct = cntct.id
    LEFT JOIN tmhb_emply csr ON mrr.pordm_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON mrr.pordm_upusr = usr.id
    WHERE mrr.pordm_users = $1
    AND mrr.pordm_actve = TRUE
    AND (mrr.pordm_pyamt - mrr.pordm_pdamt) > 0
    ORDER BY mrr.pordm_trdat DESC`;

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

// cancel-po
router.post("/cancel-po", async (req, res) => {
  try {
    const { id, pordm_cnrsn, pordm_cnjrn, tmpb_pordc, user_s, user_c, user_b } =
      req.body;

    // Validate input
    if (
      !id ||
      !pordm_cnrsn ||
      !pordm_cnjrn ||
      tmpb_pordc === null ||
      tmpb_pordc.length === 0 ||
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
    //build scripts
    const scripts = [];
    scripts.push({
      sql: `UPDATE tmpb_pordm
        SET pordm_ispnd = false,
        pordm_iscnl = true,
        pordm_cndat = CURRENT_TIMESTAMP,
        pordm_cnusr = $1,
        pordm_cnrsn = $2,
        pordm_cnval = 0,
        pordm_cnjrn = $3,
        pordm_upusr = $1,
        pordm_updat = CURRENT_TIMESTAMP,
        pordm_rvnmr = pordm_rvnmr + 1
    WHERE id = $4`,
      params: [user_s, pordm_cnrsn, pordm_cnjrn, id],
      label: `Cancelled PO - ${id}`,
    });
    for (const det of tmpb_pordc) {
      scripts.push({
        sql: `UPDATE tmpb_pordc
        SET pordc_cnqty = pordc_itqty - pordc_mrqty,
          pordc_upusr = $1,
          pordc_updat = CURRENT_TIMESTAMP,
          pordc_rvnmr = pordc_rvnmr + 1
        WHERE id = $2`,
        params: [user_s, det.id],
        label: `Cancelled PO detail ${det.id}`,
      });
    }
    await dbRunAll(scripts);

    res.json({
      success: true,
      message: `PO cancelled successfully`,
      data: {
        ...req.body,
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
});

module.exports = router;
