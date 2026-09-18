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
    const sql = `SELECT odr.*, dpt.dpart_cname, cnt.cntct_cname, COALESCE(tpm.tripm_trnno, 'Delivery Trip is not assigned') tripm_trnno,
    csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 as edit_stop
    FROM tmob_odrdm odr
    JOIN tmsb_dpart dpt ON odr.odrdm_dpart = dpt.id
    JOIN tmcb_cntct cnt ON odr.odrdm_cntct = cnt.id
    LEFT JOIN tmob_tripc tpc ON odr.id = tpc.tripc_refid
    LEFT JOIN tmob_tripm tpm ON tpc.tripc_tripm = tpm.id
    LEFT JOIN tmhb_emply csr ON odr.odrdm_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON odr.odrdm_upusr = usr.id
    WHERE odr.odrdm_users = $1
    ORDER BY odr.odrdm_trdat DESC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get odr- ${user_c}`);
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
    const sql = `SELECT odr.*,
    csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 as edit_stop
    FROM tmob_odrdm odr
    LEFT JOIN tmhb_emply csr ON odr.odrdm_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON odr.odrdm_upusr = usr.id
    WHERE odr.odrdm_users = $1
    AND odr.odrdm_actve = TRUE
    ORDER BY odr.odrdm_trnno ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get odr- ${user_c}`);
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
      odrdm_users,
      odrdm_bsins,
      odrdm_dpart,
      odrdm_cntct,
      odrdm_ttype,
      odrdm_trnno,
      odrdm_trdat,
      odrdm_refno,
      odrdm_notes,
      odrdm_tramt,
      odrdm_itmds,
      odrdm_dspct,
      odrdm_invds,
      odrdm_vtamt,
      odrdm_icamt,
      odrdm_ecamt,
      odrdm_pyamt,
      odrdm_pdamt,
      odrdm_duamt,
      odrdm_stamt,
      odrdm_csamt,
      odrdm_vehid,
      odrdm_ispst,
      odrdm_ispad,
      odrdm_isqcp,
      odrdm_isapp,
      party_id,
      chtac_id,
      tmob_odrdc,
      tmob_odrcs,
      tmob_odrpy,
      tmob_odrdf,
      fromPO,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !odrdm_dpart ||
      !odrdm_cntct ||
      !odrdm_ttype ||
      !tmob_odrdc ||
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
      "tmob_odrdm",
      odrdm_ttype, //"Sales Order",
      odrdm_dpart,
    );

    //build scripts
    const scripts = [];
    scripts.push({
      sql: `INSERT INTO tmob_odrdm(id, odrdm_users, odrdm_bsins, odrdm_dpart, odrdm_cntct, odrdm_ttype,
                        odrdm_trnno, odrdm_trdat, odrdm_refno, odrdm_notes, odrdm_tramt, odrdm_itmds,
                        odrdm_dspct, odrdm_invds, odrdm_vtamt, odrdm_icamt, odrdm_ecamt, odrdm_pyamt,
                        odrdm_pdamt, odrdm_duamt, odrdm_stamt, odrdm_csamt, odrdm_vehid, odrdm_ispst,
                        odrdm_ispad, odrdm_isqcp, odrdm_isapp, odrdm_crusr, odrdm_upusr)
    VALUES ($1, $2, $3, $4, $5, $6,
            $7, $8, $9, $10, $11, $12,
            $13, $14, $15, $16, $17, $18,
            $19, $20, $21, $22, $23, $24,
            $25, $26, $27, $28, $29)`,
      params: [
        newId,
        user_c,
        user_b,
        odrdm_dpart,
        odrdm_cntct,
        odrdm_ttype,
        newTrnNo,
        odrdm_trdat,
        odrdm_refno,
        odrdm_notes,
        odrdm_tramt || 0,
        odrdm_itmds || 0,
        odrdm_dspct || 0,
        odrdm_invds || 0,
        odrdm_vtamt || 0,
        odrdm_icamt || 0,
        odrdm_ecamt || 0,
        odrdm_pyamt || 0,
        odrdm_pdamt || 0,
        odrdm_duamt || 0,
        odrdm_stamt || 0,
        odrdm_csamt || 0,
        odrdm_vehid,
        true,
        odrdm_ispad,
        true,
        true,
        user_s,
        user_s,
      ],
      label: `Create sales order ${newTrnNo}`,
    });

    //Insert odr details, Increase Stock Details
    for (const det of tmob_odrdc) {
      const lineId = uuidv4();
      scripts.push({
        sql: `INSERT INTO tmob_odrdc(id, odrdc_users, odrdc_bsins, odrdc_odrdm, odrdc_price, odrdc_items,
                          odrdc_units, odrdc_itrat, odrdc_itqty, odrdc_itamt, odrdc_dspct, odrdc_dsamt,
                          odrdc_edamt, odrdc_vtpct, odrdc_vtamt, odrdc_vtype, odrdc_icamt, odrdc_ecamt,
                          odrdc_pyamt, odrdc_stamt, odrdc_notes, odrdc_csrat, odrdc_refid, odrdc_crusr, odrdc_upusr)
            VALUES ($1, $2, $3, $4, $5, $6,
                      $7, $8, $9, $10, $11, $12,
                      $13, $14, $15, $16, $17, $18,
                      $19, $20, $21, $22, $23, $24, $25)`,
        params: [
          lineId,
          user_c,
          user_b,
          newId,
          det.odrdc_price,
          det.odrdc_items,
          det.odrdc_units,
          det.odrdc_itrat || 0,
          det.odrdc_itqty || 0,
          det.odrdc_itamt || 0,
          det.odrdc_dspct || 0,
          det.odrdc_dsamt || 0,
          det.odrdc_edamt || 0,
          det.odrdc_vtpct || 0,
          det.odrdc_vtamt || 0,
          det.odrdc_vtype || "-",
          det.odrdc_icamt || 0,
          det.odrdc_ecamt || 0,
          det.odrdc_pyamt || 0,
          det.odrdc_stamt || 0,
          det.odrdc_notes || "",
          det.odrdc_csrat || 0,
          det.odrdc_refid || "",
          user_s,
          user_s,
        ],
        label: `Created odr detail ${newTrnNo}`,
      });

      //update sales booking
      scripts.push({
        sql: `UPDATE tmib_price
              SET price_lprat = $1,
                  price_sbqty = price_sbqty + $2,
                  price_upusr = $3,
                  price_updat = CURRENT_TIMESTAMP,
                  price_rvnmr = price_rvnmr + 1
                  WHERE id = $4
                  AND price_users = $5
                  AND price_items = $6
                  AND price_dpart = $7`,
        params: [
          det.odrdc_itrat,
          det.odrdc_itqty || 0,
          user_s,
          det.odrdc_price,
          user_c,
          det.odrdc_items,
          odrdm_dpart,
        ],
        label: `Update price sales booking ${newTrnNo}`,
      });
    }

    //Insert Costing details
    for (const det of tmob_odrcs) {
      const costId = uuidv4();
      scripts.push({
        sql: `INSERT INTO tmob_odrcs(id, odrcs_users, odrcs_bsins, odrcs_odrdm, odrcs_party, odrcs_csmod, 
                          odrcs_clmod, odrcs_value, odrcs_notes, odrcs_jrnlm, odrcs_crusr, odrcs_upusr)
        VALUES ($1, $2, $3, $4, $5, $6,
                $7, $8, $9, $10, $11, $12)`,
        params: [
          costId,
          user_c,
          user_b,
          newId,
          det.odrcs_party, //party id
          det.odrcs_csmod, //costing mode
          det.odrcs_clmod, //calculation mode
          det.odrcs_value || 0,
          det.odrcs_notes || "",
          det.odrcs_csmod === "Exclude"
            ? "SYS_FOR_PAYMENT"
            : "SYS_NOT_FOR_PAYMENT",
          user_s,
          user_s,
        ],
        label: `Created Costing detail ${newTrnNo}`,
      });
    }

    //Insert Payment details
    for (const det of tmob_odrpy) {
      scripts.push({
        sql: `INSERT INTO tmob_odrpy(id, odrpy_users, odrpy_bsins, odrpy_odrdm, odrpy_party, odrpy_pdamt,
        odrpy_refno, odrpy_notes, odrpy_crusr, odrpy_upusr)
        VALUES ($1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10)`,
        params: [
          uuidv4(),
          user_c,
          user_b,
          newId,
          det.odrpy_party,
          det.odrpy_pdamt || 0,
          det.odrpy_refno || newTrnNo,
          det.odrpy_notes || "",
          user_s,
          user_s,
        ],
        label: `Created Payment detail ${newTrnNo}`,
      });
    }

    //Update supplier current balance increase (+)
    scripts.push({
      sql: `UPDATE tmcb_cntct
      SET cntct_crbal = cntct_crbal + $1,
          cntct_upusr = $2,
          cntct_updat = CURRENT_TIMESTAMP,
          cntct_rvnmr = cntct_rvnmr + 1
      WHERE id = $3`,
      params: [odrdm_duamt, user_s, odrdm_cntct],
      label: `Update supplier credit balance ${newTrnNo}`,
    });

    //offer pack
    for (const det of tmob_odrdf) {
      const lineId = uuidv4();
      scripts.push({
        sql: `INSERT INTO tmob_odrdf(id, mrrdf_users, mrrdf_bsins, mrrdf_odrdm, mrrdf_bndlm, mrrdf_pricm,
                          mrrdf_itemm, mrrdf_unitm, mrrdf_bnqty, mrrdf_bndlc, mrrdf_pricc, mrrdf_itemc,
                          mrrdf_unitc, mrrdf_pkqty, mrrdf_trqty, mrrdf_ofcnt, mrrdf_ofqty, mrrdf_notes,
                          mrrdf_csrat, mrrdf_refid, mrrdf_crusr, mrrdf_upusr)
            VALUES ($1, $2, $3, $4, $5, $6,
                        $7, $8, $9, $10, $11, $12,
                        $13, $14, $15, $16, $17, $18,
                        $19, $20, $21, $22)`,
        params: [
          lineId,
          user_c,
          user_b,
          newId,
          det.mrrdf_bndlm,
          det.mrrdf_pricm,
          det.mrrdf_itemm,
          det.mrrdf_unitm,
          det.mrrdf_bnqty || 1,
          det.mrrdf_bndlc,
          det.mrrdf_pricc,
          det.mrrdf_itemc,
          det.mrrdf_unitc,
          det.mrrdf_pkqty || 1,
          det.mrrdf_trqty || 1,
          det.mrrdf_ofcnt || 1,
          det.mrrdf_ofqty || 1,
          det.mrrdf_notes || "",
          det.mrrdf_csrat || 0,
          det.mrrdf_refid || "",
          user_s,
          user_s,
        ],
        label: `Created odr offer detail ${newTrnNo}`,
      });
    }

    if (Number(odrdm_pdamt) > 0) {
      // ─── NEW: Collect journal details and use centralized helper ───
      const jrnlDetails = [];

      // Liability / Customer Advances (CR)
      jrnlDetails.push({
        chtac: chtac_id,
        party: party_id,
        drval: 0,
        crval: odrdm_pyamt || 0,
        descr: "From Liability / Customer Advances",
        sorce: odrdm_ttype,
        refid: newId,
      });

      // Payment details (DR supplier, CR cash/bank)
      for (const det of tmob_odrpy) {
        jrnlDetails.push({
          chtac: chtac_id,
          party: party_id,
          drval: det.odrpy_pdamt || 0,
          crval: 0,
          descr: "To - Assets / Cash - Bank",
          sorce: odrdm_ttype,
          refid: newId,
        });
      }

      // Build journal scripts via centralized helper
      const {
        scripts: jrnlScripts,
        masterId: newId_JV,
        trnNo: newTrnNo_JV,
      } = await buildJournalScripts({
        user_c,
        user_b,
        user_s,
        dpart: odrdm_dpart,
        trtyp: "Sales Order",
        trdat: odrdm_trdat,
        refno: newTrnNo,
        narrt: odrdm_ttype,
        drval: 0,
        crval: 0,
        details: jrnlDetails,
      });
      scripts.push(...jrnlScripts);
    }

    // console.log("req.body", scripts);
    // return;

    // execute all sql scripts
    await dbRunAll(scripts);

    res.json({
      success: true,
      message: `${newTrnNo} - sales order created successfully`,
      data: {
        ...req.body,
        odrdm_trnno: newTrnNo,
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
    const { odrdc_odrdm, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!odrdc_odrdm || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT odc.*,
    itm.items_iname, itm.items_pkqty, itm.items_szqty,
    prc.price_cname,
    runit.units_cname as runit_cname,
    punit.units_cname as punit_cname,
    sunit.units_cname as sunit_cname,
    sgrup.sgrup_cname as sgrup_cname,
    scatg.scatg_cname as scatg_cname,
    brand.brand_cname as brand_cname,  
     0 as edit_stop
    FROM tmob_odrdc odc
    JOIN tmib_items itm ON odc.odrdc_items = itm.id
    JOIN tmib_price prc ON odc.odrdc_price = prc.id
                            AND itm.id = prc.price_items
    JOIN tmib_units runit ON odc.odrdc_units = runit.id
    JOIN tmib_units punit ON itm.items_punit = punit.id
    JOIN tmib_units sunit ON itm.items_sunit = sunit.id
    JOIN tmib_sgrup sgrup ON itm.items_sgrup = sgrup.id
    JOIN tmib_scatg scatg ON itm.items_scatg = scatg.id
    JOIN tmib_brand brand ON itm.items_brand = brand.id
    WHERE odc.odrdc_users = $1
    AND odc.odrdc_odrdm = $2
    ORDER BY odc.odrdc_items ASC`;

    const params = [user_c, odrdc_odrdm];
    const rows = await dbGetAll(sql, params, `get odr Details- ${user_c}`);
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
    const { odrcs_odrdm, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!odrcs_odrdm || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT mrc.*, pty.party_cname
        FROM tmob_odrcs mrc
        JOIN tmtb_party pty ON mrc.odrcs_party = pty.id
        WHERE mrc.odrcs_users = $1
        AND mrc.odrcs_odrdm = $2`;

    const params = [user_c, odrcs_odrdm];
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
    const { odrpy_odrdm, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!odrpy_odrdm || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT mpy.*, pty.party_cname
        FROM tmob_odrpy mpy
        JOIN tmtb_party pty ON mpy.odrpy_party = pty.id
        WHERE mpy.odrpy_users = $1
        AND mpy.odrpy_odrdm = $2`;

    const params = [user_c, odrpy_odrdm];
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
    const { mrrdf_odrdm, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!mrrdf_odrdm || !user_c) {
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
        FROM tmob_odrdf mrb
        JOIN tmib_price prcm ON mrb.mrrdf_pricm = prcm.id
        JOIN tmib_units untm ON mrb.mrrdf_unitm = untm.id
        JOIN tmib_price prc ON mrb.mrrdf_pricc = prc.id
        JOIN tmib_units unt ON mrb.mrrdf_unitc = unt.id
        JOIN tmib_bndlm bnm ON mrb.mrrdf_bndlm = bnm.id
        WHERE mrb.mrrdf_users = $1
        AND mrb.mrrdf_odrdm = $2`;

    const params = [user_c, mrrdf_odrdm];
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

// get-all-due-odr
router.post("/get-all-due-odr", async (req, res) => {
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
    const sql = `SELECT odr.*,
    dprt.dpart_cname, cntct.cntct_cname,
    csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 as edit_stop
    FROM tmob_odrdm odr
    JOIN tmsb_dpart dprt ON odr.odrdm_dpart = dprt.id
    JOIN tmcb_cntct cntct ON odr.odrdm_cntct = cntct.id
    LEFT JOIN tmhb_emply csr ON odr.odrdm_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON odr.odrdm_upusr = usr.id
    WHERE odr.odrdm_users = $1
    AND odr.odrdm_actve = TRUE
    AND (odr.odrdm_pyamt - odr.odrdm_pdamt) > 0
    ORDER BY odr.odrdm_trdat DESC`;

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
