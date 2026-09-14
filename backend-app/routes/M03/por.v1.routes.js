const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");
const {
  GenNewCode,
  GenNewTrn,
  getCurrentPeriod,
  getCurrencyRate,
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
    const sql = `SELECT mrr.*, dpt.dpart_cname, cnt.cntct_cname,
    csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 as edit_stop
    FROM tmpb_prodm mrr
    JOIN tmsb_dpart dpt ON mrr.prodm_dpart = dpt.id
    JOIN tmcb_cntct cnt ON mrr.prodm_cntct = cnt.id
    LEFT JOIN tmhb_emply csr ON mrr.prodm_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON mrr.prodm_upusr = usr.id
    WHERE mrr.prodm_users = $1
    ORDER BY mrr.prodm_trdat DESC`;

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
    FROM tmpb_prodm mrr
    LEFT JOIN tmhb_emply csr ON mrr.prodm_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON mrr.prodm_upusr = usr.id
    WHERE mrr.prodm_users = $1
    AND mrr.prodm_actve = TRUE
    ORDER BY mrr.prodm_trnno ASC`;

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
      prodm_users,
      prodm_bsins,
      prodm_dpart,
      prodm_cntct,
      prodm_ttype,
      prodm_trnno,
      prodm_trdat,
      prodm_refno,
      prodm_notes,
      prodm_tramt,
      prodm_itmds,
      prodm_dspct,
      prodm_invds,
      prodm_vtamt,
      prodm_icamt,
      prodm_ecamt,
      prodm_pyamt,
      prodm_pdamt,
      prodm_duamt,
      prodm_stamt,
      prodm_csamt,
      prodm_ispst,
      prodm_ispad,
      prodm_isapp,
      party_id,
      chtac_id,
      tmpb_prodc,
      tmpb_propy,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !prodm_dpart ||
      !prodm_cntct ||
      !prodm_ttype ||
      !tmpb_prodc ||
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
    //const newCode = await GenNewCode(user_c, "tmpb_prodm");
    const newTrnNo = await GenNewTrn(
      user_c,
      user_b,
      "tmpb_prodm",
      prodm_ttype, //"Material Receipt Report",
      prodm_dpart,
    );

    //build scripts
    const scripts = [];
    scripts.push({
      sql: `INSERT INTO tmpb_prodm(id, prodm_users, prodm_bsins, prodm_dpart, prodm_cntct, prodm_ttype,
      prodm_trnno, prodm_trdat, prodm_refno, prodm_notes, prodm_tramt, prodm_itmds,
      prodm_dspct, prodm_invds, prodm_vtamt, prodm_icamt, prodm_ecamt, prodm_pyamt,
      prodm_pdamt, prodm_duamt, prodm_stamt, prodm_csamt, prodm_ispst, prodm_ispad,
      prodm_isapp, prodm_crusr, prodm_upusr)
    VALUES ($1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11, $12,
      $13, $14, $15, $16, $17, $18,
      $19, $20, $21, $22, $23, $24,
      $25, $26, $27)`,
      params: [
        newId,
        user_c,
        user_b,
        prodm_dpart,
        prodm_cntct,
        prodm_ttype,
        newTrnNo,
        prodm_trdat,
        prodm_refno,
        prodm_notes,
        prodm_tramt || 0,
        prodm_itmds || 0,
        prodm_dspct || 0,
        prodm_invds || 0,
        prodm_vtamt || 0,
        prodm_icamt || 0,
        prodm_ecamt || 0,
        prodm_pyamt || 0,
        prodm_pdamt || 0,
        prodm_duamt || 0,
        prodm_stamt || 0,
        prodm_csamt || 0,
        true,
        prodm_ispad,
        true,
        user_s,
        user_s,
      ],
      label: `Created PO ${newTrnNo}`,
    });

    //Insert MRR details, Stock Details
    let line = 1;
    for (const det of tmpb_prodc) {
      const lineId = uuidv4();
      scripts.push({
        sql: `INSERT INTO tmpb_prodc(id, prodc_users, prodc_bsins, prodc_prodm, prodc_price, prodc_items,
                          prodc_units, prodc_itrat, prodc_itqty, prodc_itamt, prodc_dspct, prodc_dsamt,
                          prodc_edamt, prodc_vtpct, prodc_vtamt, prodc_vtype, prodc_icamt, prodc_ecamt,
                          prodc_pyamt, prodc_stamt, prodc_notes, prodc_csrat, prodc_refid, prodc_crusr, prodc_upusr)
        VALUES ($1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11, $12,
      $13, $14, $15, $16, $17, $18,
      $19, $20, $21, $22, $23, $24, $25)`,
        params: [
          lineId,
          user_c,
          user_b,
          newId,
          det.prodc_price,
          det.prodc_items,
          det.prodc_units,
          det.prodc_itrat || 0,
          det.prodc_itqty || 0,
          det.prodc_itamt || 0,
          det.prodc_dspct || 0,
          det.prodc_dsamt || 0,
          det.prodc_edamt || 0,
          det.prodc_vtpct || 0,
          det.prodc_vtamt || 0,
          det.prodc_vtype || "-",
          det.prodc_icamt || 0,
          det.prodc_ecamt || 0,
          det.prodc_pyamt || 0,
          det.prodc_stamt || 0,
          det.prodc_notes || "",
          det.prodc_csrat || 0,
          det.prodc_refid || "",
          user_s,
          user_s,
        ],
        label: `Created MRR detail ${newTrnNo}`,
      });

      //update summary stock, last price
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
          det.prodc_itqty || 0,
          user_s,
          det.prodc_price,
          user_c,
          det.prodc_items,
          prodm_dpart,
        ],
        label: `Update price purchase booking detail ${newTrnNo}`,
      });
    }

    //SYS_PO.SYS_PURCHASE_ORDER
    if (Number(prodm_pdamt) > 0) {
      const acprd = await getCurrentPeriod(user_c, user_b, prodm_dpart);
      if (!acprd) {
        return {
          success: false,
          message: "No active fiscal year or accounting period found",
          data: {},
        };
      }
      if (acprd.length > 1) {
        return {
          success: false,
          message:
            "Multiple active accounting periods found. Please select one.",
          data: {},
        };
      }
      const { acprd_id, fsyar_id } = acprd[0];

      const newId_JV = uuidv4();
      const newTrnNo_JV = await GenNewTrn(
        user_c,
        user_b,
        "tmtb_jrnlm",
        "Purchase Order",
        prodm_dpart,
      );

      //active currency rate
      const crncy = await getCurrencyRate(user_c, user_b);
      if (!crncy) {
        return {
          success: false,
          message: "No active currency rate found",
          data: {},
        };
      }
      if (crncy.length > 1) {
        return {
          success: false,
          message: "Multiple active currency rate found. Please select one.",
          data: {},
        };
      }

      //SYS_PO.SYS_PURCHASE_ORDER
      scripts.push({
        sql: `INSERT INTO tmtb_jrnlm(id, jrnlm_users, jrnlm_bsins, jrnlm_dpart, jrnlm_fsyar, jrnlm_acprd,
    jrnlm_crncy, jrnlm_trtyp, jrnlm_trnno, jrnlm_trdat, jrnlm_refno, jrnlm_narrt,
    jrnlm_drval, jrnlm_crval, jrnlm_exrat, jrnlm_stats, jrnlm_crusr, jrnlm_upusr)
    VALUES ($1, $2, $3, $4, $5, $6,
    $7, $8, $9, $10, $11, $12,
    $13, $14, $15, $16, $17, $18)`,
        params: [
          newId_JV,
          user_c,
          user_b,
          prodm_dpart,
          fsyar_id,
          acprd_id,
          crncy.crncy_tcrnc,
          "Purchase Order",
          newTrnNo_JV,
          prodm_trdat,
          newTrnNo,
          prodm_ttype,
          prodm_pdamt,
          prodm_pdamt,
          crncy.crncy_exrat,
          "Posted",
          user_s,
          user_s,
        ],
        label: `create journal master- ${newTrnNo_JV}`,
      });

      //SYS_PO.SYS_PURCHASE_ORDER.SYS_AST_SUPPLIER.SYS_EMPTY
      scripts.push({
        sql: `INSERT INTO tmtb_jrnlc(id, jrnlc_users, jrnlc_bsins, jrnlc_dpart, jrnlc_jrnlm, jrnlc_chtac,
        jrnlc_party, jrnlc_drval, jrnlc_crval, jrnlc_descr, jrnlc_sorce, jrnlc_refid,
        jrnlc_rtype, jrnlc_lines, jrnlc_crusr, jrnlc_upusr)
        VALUES ($1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12,
        $13, $14, $15, $16)`,
        params: [
          uuidv4(),
          user_c,
          user_b,
          prodm_dpart,
          newId_JV,
          chtac_id,
          party_id,
          prodm_pyamt || 0,
          0,
          "From Assets / Supplier Advance",
          prodm_ttype,
          newId,
          "MASTER",
          line,
          user_s,
          user_s,
        ],
        label: `Create Assets / Supplier / Advance ${newTrnNo_JV}`,
      });
      line++;
    }

    //Insert Payment details
    for (const det of tmpb_propy) {
      scripts.push({
        sql: `INSERT INTO tmpb_propy(id, propy_users, propy_bsins, propy_prodm, propy_party, propy_pdamt,
        propy_refno, propy_notes, propy_crusr, propy_upusr)
        VALUES ($1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10)`,
        params: [
          uuidv4(),
          user_c,
          user_b,
          newId,
          det.propy_party,
          det.propy_pdamt || 0,
          det.propy_refno || newTrnNo,
          det.propy_notes || "",
          user_s,
          user_s,
        ],
        label: `Created Payment detail ${newTrnNo}`,
      });

      //SYS_PO.SYS_PURCHASE_ORDER.SYS_AST_PAYMENT.SYS_EMPTY
      scripts.push({
        sql: `INSERT INTO tmtb_jrnlc(id, jrnlc_users, jrnlc_bsins, jrnlc_dpart, jrnlc_jrnlm, jrnlc_chtac,
        jrnlc_party, jrnlc_drval, jrnlc_crval, jrnlc_descr, jrnlc_sorce, jrnlc_refid,
        jrnlc_rtype, jrnlc_lines, jrnlc_crusr, jrnlc_upusr)
        VALUES ($1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12,
        $13, $14, $15, $16)`,
        params: [
          uuidv4(),
          user_c,
          user_b,
          prodm_dpart,
          newId_JV,
          det.chtac_id,
          det.party_id,
          0,
          det.propy_pdamt || 0,
          "Payment Advance / Supplier Advance",
          prodm_ttype,
          newId,
          "MASTER",
          line,
          user_s,
          user_s,
        ],
        label: `Payment Advance / Supplier / Advance ${newTrnNo_JV}`,
      });
      line++;
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
      params: [prodm_duamt, user_s, prodm_cntct],
      label: `Update supplier credit balance ${newTrnNo}`,
    });

    
    console.log(scripts)


    //await dbRunAll(scripts);

    res.json({
      success: true,
      message: `${newTrnNo} - PO created successfully`,
      data: {
        ...req.body,
        prodm_trnno: newTrnNo,
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
    const { mrrdc_prodm, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!mrrdc_prodm || !user_c) {
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
    FROM tmpb_prodc mrd
    JOIN tmib_items itm ON mrd.mrrdc_items = itm.id
    JOIN tmib_price prc ON mrd.mrrdc_price = prc.id
                            AND itm.id = prc.price_items
    JOIN tmib_units runit ON mrd.mrrdc_units = runit.id
    JOIN tmib_units punit ON itm.items_punit = punit.id
    JOIN tmib_units sunit ON itm.items_sunit = sunit.id
    JOIN tmib_sgrup sgrup ON itm.items_sgrup = sgrup.id
    JOIN tmib_scatg scatg ON itm.items_scatg = scatg.id
    JOIN tmib_brand brand ON itm.items_brand = brand.id
    WHERE mrd.mrrdc_users = $1
    AND mrd.mrrdc_prodm = $2
    ORDER BY mrd.mrrdc_items ASC`;

    const params = [user_c, mrrdc_prodm];
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
    const { mrrcs_prodm, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!mrrcs_prodm || !user_c) {
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
        AND mrc.mrrcs_prodm = $2`;

    const params = [user_c, mrrcs_prodm];
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
    const { mrrpy_prodm, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!mrrpy_prodm || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT mpy.*, pty.party_cname
        FROM tmpb_propy mpy
        JOIN tmtb_party pty ON mpy.mrrpy_party = pty.id
        WHERE mpy.mrrpy_users = $1
        AND mpy.mrrpy_prodm = $2`;

    const params = [user_c, mrrpy_prodm];
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
    const { mrrdf_prodm, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!mrrdf_prodm || !user_c) {
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
        FROM tmpb_mrrdf mrb
        JOIN tmib_price prcm ON mrb.mrrdf_pricm = prcm.id
        JOIN tmib_units untm ON mrb.mrrdf_unitm = untm.id
        JOIN tmib_price prc ON mrb.mrrdf_pricc = prc.id
        JOIN tmib_units unt ON mrb.mrrdf_unitc = unt.id
        JOIN tmib_bndlm bnm ON mrb.mrrdf_bndlm = bnm.id
        WHERE mrb.mrrdf_users = $1
        AND mrb.mrrdf_prodm = $2`;

    const params = [user_c, mrrdf_prodm];
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
    FROM tmpb_prodm mrr
    JOIN tmsb_dpart dprt ON mrr.prodm_dpart = dprt.id
    JOIN tmcb_cntct cntct ON mrr.prodm_cntct = cntct.id
    LEFT JOIN tmhb_emply csr ON mrr.prodm_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON mrr.prodm_upusr = usr.id
    WHERE mrr.prodm_users = $1
    AND mrr.prodm_actve = TRUE
    AND (mrr.prodm_pyamt - mrr.prodm_pdamt) > 0
    ORDER BY mrr.prodm_trdat DESC`;

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
