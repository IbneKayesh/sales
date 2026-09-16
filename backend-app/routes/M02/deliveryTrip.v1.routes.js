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
    const sql = `SELECT inv.*, dpt.dpart_cname, cnt.cntct_cname,
    csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 as edit_stop
    FROM tmob_invcm inv
    JOIN tmsb_dpart dpt ON inv.invcm_dpart = dpt.id
    JOIN tmcb_cntct cnt ON inv.invcm_cntct = cnt.id
    LEFT JOIN tmhb_emply csr ON inv.invcm_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON inv.invcm_upusr = usr.id
    WHERE inv.invcm_users = $1
    ORDER BY inv.invcm_trdat DESC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get Invoice- ${user_c}`);
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
    const sql = `SELECT inv.*,
    csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 as edit_stop
    FROM tmob_invcm inv
    LEFT JOIN tmhb_emply csr ON inv.invcm_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON inv.invcm_upusr = usr.id
    WHERE inv.invcm_users = $1
    AND inv.invcm_actve = TRUE
    ORDER BY inv.invcm_trnno ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get invoice- ${user_c}`);
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
      invcm_users,
      invcm_bsins,
      invcm_dpart,
      invcm_cntct,
      invcm_ttype,
      invcm_trnno,
      invcm_trdat,
      invcm_refno,
      invcm_notes,
      invcm_tramt,
      invcm_itmds,
      invcm_dspct,
      invcm_invds,
      invcm_lylds,
      invcm_vtamt,
      invcm_icamt,
      invcm_ecamt,
      invcm_pyamt,
      invcm_pdamt,
      invcm_duamt,
      invcm_stamt,
      invcm_csamt,
      invcm_nsamt,
      invcm_vehid,
      invcm_ispst,
      invcm_ispad,
      invcm_isapp,
      party_id,
      chtac_id,
      tmob_invcc,
      tmob_invcs,
      tmob_invpy,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !invcm_dpart ||
      !invcm_cntct ||
      !invcm_ttype ||
      !tmob_invcc ||
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
      "tmob_invcm",
      invcm_ttype, //"Sales Invoice",
      invcm_dpart,
    );

    //output vat (sales)
    const sql_outvat = `SELECT pty.id party_id, cht.id chtac_id, crt.chtrt_grpid
      FROM tmtb_party pty
      JOIN tmtb_chtac cht ON pty.party_chtac = cht.id
      JOIN tmtb_chtrt crt ON cht.chtac_chtno = crt.chtrt_chtno
      WHERE crt.chtrt_trnid = 'SYS_SALES'
      AND crt.chtrt_pegid = 'SYS_SALES_INVOICE'
      AND crt.chtrt_grpid IN ('SYS_LIB_OUT_VAT','SYS_NONE')
      AND pty.party_actve = TRUE
      AND cht.chtac_actve = TRUE
      AND crt.chtrt_actve = TRUE
      AND cht.chtac_users = $1
      AND cht.chtac_bsins = $2`;
    const result_outvat = await dbGet(sql_outvat, [user_c, user_b]);
    // console.log(result);
    if (!result_outvat || result_outvat.length === 0) {
      return res.json({
        success: false,
        message: `No default output vat configured for Sales Invoice`,
        data: {},
      });
    }

    //build scripts
    const scripts = [];
    scripts.push({
      sql: `INSERT INTO tmob_invcm(id, invcm_users, invcm_bsins, invcm_dpart, invcm_cntct, invcm_ttype,
                        invcm_trnno, invcm_trdat, invcm_refno, invcm_notes, invcm_tramt, invcm_itmds,
                        invcm_dspct, invcm_invds, invcm_lylds, invcm_vtamt, invcm_icamt, invcm_ecamt,
                        invcm_pyamt, invcm_pdamt, invcm_duamt, invcm_stamt, invcm_csamt, invcm_nsamt,
                        invcm_vehid, invcm_ispst, invcm_ispad, invcm_isapp, invcm_crusr, invcm_upusr)
            VALUES ($1, $2, $3, $4, $5, $6,
                    $7, $8, $9, $10, $11, $12,
                    $13, $14, $15, $16, $17, $18,
                    $19, $20, $21, $22, $23, $24,
                    $25, $26, $27, $28, $29, $30)`,
      params: [
        newId,
        user_c,
        user_b,
        invcm_dpart,
        invcm_cntct,
        invcm_ttype,
        newTrnNo,
        invcm_trdat,
        invcm_refno,
        invcm_notes,
        invcm_tramt || 0,
        invcm_itmds || 0,
        invcm_dspct || 0,
        invcm_invds || 0,
        invcm_lylds || 0,
        invcm_vtamt || 0,
        invcm_icamt || 0,
        invcm_ecamt || 0,
        invcm_pyamt || 0,
        invcm_pdamt || 0,
        invcm_duamt || 0,
        invcm_stamt || 0,
        invcm_csamt || 0,
        invcm_nsamt || 0,
        invcm_vehid,
        true,
        invcm_ispad,
        true,
        user_s,
        user_s,
      ],
      label: `Created Invoice ${newTrnNo}`,
    });

    //Insert Sales details, Reduce Stock Details
    for (const det of tmob_invcc) {
      const lineId = uuidv4();
      scripts.push({
        sql: `INSERT INTO tmob_invcc(id, invcc_users, invcc_bsins, invcc_invcm, invcc_price, invcc_items,
                          invcc_units, invcc_itrat, invcc_itqty, invcc_itamt, invcc_dspct, invcc_dsamt,
                          invcc_edamt, invcc_vtpct, invcc_vtamt, invcc_vtype, invcc_icamt, invcc_ecamt,
                          invcc_pyamt, invcc_stamt, invcc_notes, invcc_csrat, invcc_nsrat, invcc_refid,
                          invcc_stock, invcc_crusr, invcc_upusr)
        VALUES ($1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11, $12,
      $13, $14, $15, $16, $17, $18,
      $19, $20, $21, $22, $23, $24,
      $25, $26, $27)`,
        params: [
          lineId,
          user_c,
          user_b,
          newId,
          det.invcc_price,
          det.invcc_items,
          det.invcc_units,
          det.invcc_itrat || 0,
          det.invcc_itqty || 0,
          det.invcc_itamt || 0,
          det.invcc_dspct || 0,
          det.invcc_dsamt || 0,
          det.invcc_edamt || 0,
          det.invcc_vtpct || 0,
          det.invcc_vtamt || 0,
          det.invcc_vtype || "-",
          det.invcc_icamt || 0,
          det.invcc_ecamt || 0,
          det.invcc_pyamt || 0,
          det.invcc_stamt || 0,
          det.invcc_notes || "",
          det.invcc_csrat || 0,
          det.invcc_nsrat || 0,
          det.invcc_refid || "",
          det.invcc_stock || "",
          user_s,
          user_s,
        ],
        label: `Created Sales detail ${newTrnNo}`,
      });

      //add condition if no tracking then off
      scripts.push({
        sql: `UPDATE tmib_stock
        SET stock_slqty = stock_slqty + $1,
            stock_ohqty = stock_ohqty - $2,
            stock_upusr = $3,
            stock_updat = CURRENT_TIMESTAMP,
            stock_rvnmr = stock_rvnmr + 1
        WHERE id = $4
        AND stock_users = $5
        AND stock_bsins = $6
        AND stock_dpart = $7`,
        params: [
          det.invcc_itqty || 0,
          det.invcc_itqty || 0,
          user_s,
          det.invcc_stock || "",
          user_c,
          user_b,
          invcm_dpart,
        ],
        label: `Update reduce stock detail ${newTrnNo}`,
      });

      //update summary stock
      scripts.push({
        sql: `UPDATE tmib_price
              SET price_gdstk = price_gdstk - $1,
                  price_upusr = $2,
                  price_updat = CURRENT_TIMESTAMP,
                  price_rvnmr = price_rvnmr + 1
                  WHERE id = $3
                  AND price_users = $4
                  AND price_items = $5
                  AND price_dpart = $6`,
        params: [
          det.invcc_itqty || 0,
          user_s,
          det.invcc_price,
          user_c,
          det.invcc_items,
          invcm_dpart,
        ],
        label: `Update price reduce stock detail ${newTrnNo}`,
      });
    }

    const newGroupedProducts = Object.values(
      tmob_invcc.reduce((groups, det) => {
        const key = `${det.chtac_id}_${det.party_id}`;

        if (!groups[key]) {
          groups[key] = {
            chtac_id: det.chtac_id,
            party_id: det.party_id,
            item_amount: 0,
          };
        }

        groups[key].item_amount +=
          Number(det.invcc_csrat || 0) * Number(det.invcc_itqty || 0);

        return groups;
      }, {}),
    );
   
    //SYS_EXP_COGS, PAY_INCOME_PRODUCT_SOLD, PAY_VAT
    //SYS_SALES.SYS_SALES_INVOICE.SYS_INC_PRODUCT_SALES
    //SYS_SALES.SYS_SALES_INVOICE.SYS_EXP_COGS
    //SYS_SALES.SYS_SALES_INVOICE.SYS_EXP_LOCAL_VENDOR
    const sql_chtrt = `SELECT pty.id party_id, cht.id chtac_id, crt.chtrt_grpid
      FROM tmtb_party pty
      JOIN tmtb_chtac cht ON pty.party_chtac = cht.id
      JOIN tmtb_chtrt crt ON cht.chtac_chtno = crt.chtrt_chtno
      WHERE crt.chtrt_trnid = 'SYS_SALES'
      AND crt.chtrt_pegid = 'SYS_SALES_INVOICE'
      AND crt.chtrt_grpid IN ('SYS_INC_PRODUCT_SALES','SYS_EXP_COGS','SYS_EXP_LOCAL_VENDOR')
      AND pty.party_actve = TRUE
      AND cht.chtac_actve = TRUE
      AND crt.chtrt_actve = TRUE
      AND cht.chtac_users = $1
      AND cht.chtac_bsins = $2`;

    const params_chtrt = [user_c, user_b];
    const rows_chtrt = await dbGetAll(
      sql_chtrt,
      params_chtrt,
      "get party routes",
    );
    if (!rows_chtrt.length > 2) {
      return res.json({
        success: false,
        message: `No account party setup for sales COGS, SOLD`,
        data: {},
      });
    }

    //Insert Costing details
    for (const det of tmob_invcs) {
      const costId = uuidv4();
      scripts.push({
        sql: `INSERT INTO tmob_invcs(id, invcs_users, invcs_bsins, invcs_invcm, invcs_party, invcs_csmod,
                          invcs_clmod, invcs_value, invcs_notes, invcs_jrnlm, invcs_crusr, invcs_upusr)
              VALUES ($1, $2, $3, $4, $5, $6,
                      $7, $8, $9, $10, $11, $12)`,
        params: [
          costId,
          user_c,
          user_b,
          newId,
          det.invcs_party,
          det.invcs_csmod,
          det.invcs_clmod,
          det.invcs_value || 0,
          det.invcs_notes || "",
          det.invcs_csmod === "Exclude"
            ? "SYS_FOR_PAYMENT"
            : "SYS_NOT_FOR_PAYMENT",
          user_s,
          user_s,
        ],
        label: `Created Costing detail ${newTrnNo}`,
      });
    }

    //Insert Payment details
    for (const det of tmob_invpy) {
      const payId = uuidv4();
      scripts.push({
        sql: `INSERT INTO tmob_invpy(id, invpy_users, invpy_bsins, invpy_invcm, invpy_party, invpy_pdamt,
        invpy_refno, invpy_notes, invpy_crusr, invpy_upusr)
        VALUES ($1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10)`,
        params: [
          payId,
          user_c,
          user_b,
          newId,
          det.invpy_party,
          det.invpy_pdamt || 0,
          det.invpy_refno || newTrnNo,
          det.invpy_notes || "",
          user_s,
          user_s,
        ],
        label: `Created Payment detail ${newTrnNo}`,
      });
    }

    //Update customer current balance decrease (-)
    scripts.push({
      sql: `UPDATE tmcb_cntct
      SET cntct_crbal = cntct_crbal - $1,
        cntct_upusr = $2,
        cntct_updat = CURRENT_TIMESTAMP,
        cntct_rvnmr = cntct_rvnmr + 1
      WHERE id = $3`,
      params: [invcm_duamt, user_s, invcm_cntct],
      label: `Update customer credit balance ${newTrnNo}`,
    });

    // ─── NEW: Collect journal details and use centralized helper ───
    const jrnlDetails = [];

    // Asset / Inventory / Products (CR)
    let totalCOGS = 0;
    for (const det of newGroupedProducts) {
      jrnlDetails.push({
        chtac: det.chtac_id,
        party: det.party_id,
        drval: 0,
        crval: det.item_amount,
        descr: "From Asset / Inventory / Products",
        sorce: invcm_ttype,
        refid: newId,
      });
      totalCOGS += Number(det.item_amount);
    }

    // Asset / Customer / Receivable (DR)
    jrnlDetails.push({
      chtac: chtac_id,
      party: party_id,
      drval: invcm_pyamt || 0,
      crval: 0,
      descr: "To Asset / Customer / Receivable",
      sorce: invcm_ttype,
      refid: newId,
    });

    // Output VAT (CR) — conditional
    if (Number(invcm_vtamt) > 0) {
      jrnlDetails.push({
        chtac: outVat?.chtac_id || "",
        party: outVat?.party_id || "",
        drval: 0,
        crval: invcm_vtamt || 0,
        descr: "To Liabilities / Taxes Payable / VAT Payable (Sales)",
        sorce: invcm_ttype,
        refid: newId,
      });
    }

    // Expens / Product COGS (DR)
    const prtyn_cogs = rows_chtrt.find(
      (row) => row.chtrt_grpid === "SYS_EXP_COGS",
    );

    jrnlDetails.push({
      chtac: prtyn_cogs?.chtac_id || "",
      party: prtyn_cogs?.party_id || "",
      drval: totalCOGS,
      crval: 0,
      descr: "To Expense / Product COGS",
      sorce: invcm_ttype,
      refid: newId,
    });

    // Income / Product Sales (CR)
    const prtyn_sold = rows_chtrt.find(
      (row) => row.chtrt_grpid === "SYS_INC_PRODUCT_SALES",
    );
    let totalINCOME = Number(invcm_pyamt || 0) - Number(invcm_vtamt);
    jrnlDetails.push({
      chtac: prtyn_sold?.chtac_id || "",
      party: prtyn_sold?.party_id || "",
      drval: 0,
      crval: totalINCOME || 0,
      descr: "To Income / Product Sales",
      sorce: invcm_ttype,
      refid: newId,
    });

    // Costing exclude (CR)
    for (const det of tmob_invcs) {
      if (det.invcs_csmod === "Exclude") {
        jrnlDetails.push({
          chtac: det.chtac_id,
          party: det.party_id,
          drval: 0,
          crval: det.invcs_value || 0,
          descr: "From Liability / Local Vendor Payable",
          sorce: invcm_ttype,
          refid: newId,
        });
      }
    }

    // Expense / Direct Cost (Local Vendor) (DR) — conditional
    if (Number(invcm_ecamt) > 0) {
      const prtyr_exp = rows_chtrt.find(
        (row) => row.chtrt_grpid === "SYS_EXP_LOCAL_VENDOR",
      );
      jrnlDetails.push({
        chtac: prtyr_exp?.chtac_id || "",
        party: prtyr_exp?.party_id || "",
        drval: invcm_ecamt || 0,
        crval: 0,
        descr: "To Expense / Direct Cost",
        sorce: invcm_ttype,
        refid: newId,
      });
    }

    // Payment details (DR customer, CR cash/bank)
    for (const det of tmob_invpy) {
      jrnlDetails.push({
        chtac: chtac_id,
        party: party_id,
        drval: 0,
        crval: det.invpy_pdamt || 0,
        descr: "Clear - Assets / Customer / Receivable",
        sorce: invcm_ttype,
        refid: newId,
      });
      jrnlDetails.push({
        chtac: det.chtac_id,
        party: det.party_id,
        drval: det.invpy_pdamt || 0,
        crval: 0,
        descr: "Receive - Assets / Customer Receivable",
        sorce: invcm_ttype,
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
      dpart: invcm_dpart,
      trtyp: "Sales Invoice",
      trdat: invcm_trdat,
      refno: newTrnNo,
      narrt: invcm_ttype,
      drval: 0,
      crval: 0,
      details: jrnlDetails,
    });
    scripts.push(...jrnlScripts);

    await dbRunAll(scripts);

    res.json({
      success: true,
      message: `${newTrnNo} - Sales Invoice created successfully`,
      data: {
        ...req.body,
        invcm_trnno: newTrnNo,
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
    const { invcc_invcm, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!invcc_invcm || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT ivc.*,
    itm.items_iname, itm.items_pkqty, itm.items_szqty,
    prc.price_cname,
    runit.units_cname as runit_cname,
    punit.units_cname as punit_cname,
    sunit.units_cname as sunit_cname,
    sgrup.sgrup_cname as sgrup_cname,
    scatg.scatg_cname as scatg_cname,
    brand.brand_cname as brand_cname,
     0 as edit_stop
    FROM tmob_invcc ivc
    JOIN tmib_items itm ON ivc.invcc_items = itm.id
    JOIN tmib_price prc ON ivc.invcc_price = prc.id
                            AND itm.id = prc.price_items
    JOIN tmib_units runit ON ivc.invcc_units = runit.id
    JOIN tmib_units punit ON itm.items_punit = punit.id
    JOIN tmib_units sunit ON itm.items_sunit = sunit.id
    JOIN tmib_sgrup sgrup ON itm.items_sgrup = sgrup.id
    JOIN tmib_scatg scatg ON itm.items_scatg = scatg.id
    JOIN tmib_brand brand ON itm.items_brand = brand.id
    WHERE ivc.invcc_users = $1
    AND ivc.invcc_invcm = $2
    ORDER BY ivc.invcc_items ASC`;

    const params = [user_c, invcc_invcm];
    const rows = await dbGetAll(sql, params, `get Invoice Details- ${user_c}`);
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
    const { invcs_invcm, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!invcs_invcm || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT mrc.*, pty.party_cname
        FROM tmob_invcs mrc
        JOIN tmtb_party pty ON mrc.invcs_party = pty.id
        WHERE mrc.invcs_users = $1
        AND mrc.invcs_invcm = $2`;

    const params = [user_c, invcs_invcm];
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
    const { invpy_invcm, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!invpy_invcm || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT mpy.*, pty.party_cname
        FROM tmob_invpy mpy
        JOIN tmtb_party pty ON mpy.invpy_party = pty.id
        WHERE mpy.invpy_users = $1
        AND mpy.invpy_invcm = $2`;

    const params = [user_c, invpy_invcm];
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
      WHERE ptn.prtyn_cname = 'SYS_SALES_INVOICE'
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

// get-all-due-trip
router.post("/get-all-due-trip", async (req, res) => {
  try {
    const { dpart_id, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!dpart_id || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT ivm.*, cnt.cntct_cname, cnt.cntct_ofadr
            FROM tmob_invcm ivm
            JOIN tmcb_cntct cnt ON ivm.invcm_cntct = cnt.id
            WHERE ivm.invcm_vehid IS NULL
                OR TRIM(ivm.invcm_vehid) = ''
                AND ivm.invcm_dpart = $1
                AND ivm.invcm_users = $2
            ORDER BY ivm.invcm_trdat DESC`;

    const params = [dpart_id, user_c];
    const rows = await dbGetAll(
      sql,
      params,
      `get due invoice for delivery trip- ${user_c}`,
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
