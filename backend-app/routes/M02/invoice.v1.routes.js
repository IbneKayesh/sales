const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");
const {
  GenNewCode,
  GenNewTrn,
  getCurrentPeriod,
  getCurrencyRate,
  getCoaLibOutputVat,
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
    const acprd = await getCurrentPeriod(user_c, user_b, invcm_dpart);
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
        message: "Multiple active accounting periods found. Please select one.",
        data: {},
      };
    }
    const { acprd_id, fsyar_id } = acprd[0];
    const newId_JV = uuidv4();
    const newTrnNo_JV = await GenNewTrn(
      user_c,
      user_b,
      "tmtb_jrnlm",
      "Sales Invoice",
      invcm_dpart,
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

    const newId = uuidv4();
    //const newCode = await GenNewCode(user_c, "tmob_invcm");
    const newTrnNo = await GenNewTrn(
      user_c,
      user_b,
      "tmob_invcm",
      invcm_ttype, //"Material Receipt Report",
      invcm_dpart,
    );

    //output vat (sales)
    const outVat = await getCoaLibOutputVat(user_c, user_b);
    if (!outVat) {
      return {
        success: false,
        message: "Output VAT Account is not found",
        data: {},
      };
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

    //SYS_SALES_INVOICE
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
        invcm_dpart,
        fsyar_id,
        acprd_id,
        crncy.crncy_tcrnc,
        "Sales Invoice",
        newTrnNo_JV,
        invcm_trdat,
        newTrnNo,
        invcm_ttype,
        0,
        0,
        crncy.crncy_exrat,
        "Posted",
        user_s,
        user_s,
      ],
      label: `create journal master- ${newTrnNo_JV}`,
    });

    //Insert Sales details, Reduce Stock Details
    let line = 1;
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
                  AND price_items = $5`,
        params: [
          det.invcc_itqty || 0,
          user_s,
          det.invcc_price,
          user_c,
          det.invcc_items,
        ],
        label: `Update reduce price stock detail ${newTrnNo}`,
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

    //SYS_SALES_INVOICE.SYS_AST_INVENTORY > Asset / Inventory Products - 10101212 >> CR (1.1)
    let totalCOGS = 0;
    for (const det of newGroupedProducts) {
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
          invcm_dpart,
          newId_JV,
          det.chtac_id,
          det.party_id,
          0,
          det.item_amount,
          "From Asset / Inventory / Products",
          invcm_ttype,
          newId,
          "MASTER",
          line,
          user_s,
          user_s,
        ],
        label: `Create Asset / Inventory / Products ${newTrnNo_JV}`,
      });
      line++;
      totalCOGS = totalCOGS + Number(det.item_amount);
    }

    //SYS_SALES_INVOICE.SYS_AST_CUSTOMER > Asset / Customer Receivable - 10101110 >> DR (2.1)
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
        invcm_dpart,
        newId_JV,
        chtac_id,
        party_id,
        invcm_pyamt || 0,
        0,
        "To Asset / Customer / Receivable",
        invcm_ttype,
        newId,
        "MASTER",
        line,
        user_s,
        user_s,
      ],
      label: `Create Asset / Customer / Receivable ${newTrnNo_JV}`,
    });
    line++;

    //SYS_SALES_INVOICE.SYS_LIB_OUT_VAT > To Liabilities / Current Liabilities / Taxes Payable / VAT Payable (Sales)
    if (Number(invcm_vtamt) > 0) {
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
          invcm_dpart,
          newId_JV,
          outVat.chtac_id,
          outVat.party_id,
          0,
          invcm_vtamt || 0,
          "To Liabilities / Current Liabilities / Taxes Payable / VAT Payable (Sales)",
          invcm_ttype,
          newId,
          "MASTER",
          line,
          user_s,
          user_s,
        ],
        label: `Create To Liabilities / Current Liabilities / Taxes Payable / VAT Payable (Sales) ${newTrnNo_JV}`,
      });
      line++;
    }
    //SYS_EXP_COGS, PAY_INCOME_PRODUCT_SOLD, PAY_VAT
    const sql_prtyr = `SELECT pty.id party_id, pty.party_chtac chtac_id, ptr.prtyr_sgrup
                FROM tmtb_party pty
                JOIN tmtb_chtac cht ON pty.party_chtac = cht.id
                          AND cht.chtac_jvpst = 'MULTIPLE'
                          AND cht.chtac_actve = TRUE
                JOIN tmtb_prtyr ptr ON cht.chtac_chtno = ptr.prtyr_chtno
                WHERE ptr.prtyr_mgrup = 'SYS_SALES_INVOICE'
                AND pty.party_actve = TRUE
                AND ptr.prtyr_actve = TRUE
                AND ptr.prtyr_users = $1
                AND ptr.prtyr_bsins = $2
				        AND ptr.prtyr_party = 'DIRECT'`;

    const params_prtyr = [user_c, user_b];
    const rows_prtyr = await dbGetAll(
      sql_prtyr,
      params_prtyr,
      "get party routes",
    );
    if (!rows_prtyr.length > 2) {
      return res.json({
        success: false,
        message: `No account party setup for sales COGS, SOLD`,
        data: {},
      });
    }

    //SYS_SALES_INVOICE.SYS_EXP_COGS > Expense / Product COGS - 50101013 >> DR (1.2)
    const prtyn_cogs = rows_prtyr.find(
      (row) => row.prtyr_sgrup === "SYS_EXP_COGS",
    );
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
        invcm_dpart,
        newId_JV,
        prtyn_cogs?.chtac_id || "",
        prtyn_cogs?.party_id || "",
        totalCOGS,
        0,
        "To Expense / Product COGS",
        invcm_ttype,
        newId,
        "MASTER",
        line,
        user_s,
        user_s,
      ],
      label: `Create Expense / Product COGS ${newTrnNo_JV}`,
    });
    line++;

    //SYS_SALES_INVOICE.SYS_INC_PRODUCT > Income / Product Sales - 40101010 >> CR (2.2)
    const prtyn_sold = rows_prtyr.find(
      (row) => row.prtyr_sgrup === "SYS_INC_PRODUCT",
    );
    let totalINCOME = Number(invcm_pyamt || 0) - Number(invcm_vtamt);
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
        invcm_dpart,
        newId_JV,
        prtyn_sold?.chtac_id || "",
        prtyn_sold?.party_id || "",
        0,
        totalINCOME || 0,
        "To Income / Product Sales",
        invcm_ttype,
        newId,
        "MASTER",
        line,
        user_s,
        user_s,
      ],
      label: `Create Income / Product Sales ${newTrnNo_JV}`,
    });
    line++;

    //Insert Costing details
    for (const det of tmob_invcs) {
      const costId = uuidv4();
      scripts.push({
        sql: `INSERT INTO tmob_invcs(id, invcs_users, invcs_bsins, invcs_invcm, invcs_party, invcs_csmod,
        invcs_clmod, invcs_value, invcs_notes, invcs_crusr, invcs_upusr)
        VALUES ($1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11)`,
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
          user_s,
          user_s,
        ],
        label: `Created Costing detail ${newTrnNo}`,
      });

      //SYS_MRR_DIRECT.SYS_LIB_LOCAL_VENDOR > Liability / Local Vendor/Contractor/Labor - 20101011 (CR)
      if (det.invcs_csmod === "Exclude") {
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
            invcm_dpart,
            newId_JV,
            det.chtac_id,
            det.party_id,
            0,
            det.invcs_value || 0,
            "From Liability / Local Vendor Payable",
            invcm_ttype,
            costId,
            "CHILD",
            line,
            user_s,
            user_s,
          ],
          label: `Create Liability / Local Vendor / Payable ${newTrnNo_JV}`,
        });
        line++;
      }
    }

    //SYS_SALES_INVOICE.SYS_EXP_LOCAL_VENDOR > Expense / Direct Cost >> DR
    if (Number(invcm_ecamt) > 0) {
      const prtyr_exp = rows_prtyr.find(
        (row) => row.prtyr_sgrup === "SYS_EXP_LOCAL_VENDOR",
      );
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
          invcm_dpart,
          newId_JV,
          prtyr_exp?.chtac_id || "",
          prtyr_exp?.party_id || "",
          invcm_ecamt || 0,
          0,
          "To Expense / Direct Cost",
          invcm_ttype,
          newId,
          "MASTER",
          line,
          user_s,
          user_s,
        ],
        label: `Create Expense / Direct Cost ${newTrnNo_JV}`,
      });
      line++;
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
          det.invpy_refno || "",
          det.invpy_notes || "",
          user_s,
          user_s,
        ],
        label: `Created Payment detail ${newTrnNo}`,
      });

      //SYS_SALES_INVOICE.SYS_AST_CUSTOMER > Asset / Customer / Receivable -10101110 Clear (CR)
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
          invcm_dpart,
          newId_JV,
          chtac_id,
          party_id,
          0,
          det.invpy_pdamt || 0,
          "Clear Assets / Customer / Receivable",
          invcm_ttype,
          payId,
          "CHILD",
          line,
          user_s,
          user_s,
        ],
        label: `Clear Assets / Customer / Receivable ${newTrnNo_JV}`,
      });

      line++;
      //SYS_SALES_INVOICE.SYS_AST_PAY_CASH / bank	> Asset / Cash In Hand - 10101010 (DR)
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
          invcm_dpart,
          newId_JV,
          det.chtac_id_pay,
          det.party_id_pay,
          det.invpy_pdamt || 0,
          0,
          "Receive Assets / Customer Receivable",
          invcm_ttype,
          payId,
          "CHILD",
          line,
          user_s,
          user_s,
        ],
        label: `Receive Assets / Customer Receivable ${newTrnNo_JV}`,
      });
      line++;
    }

    //Update supplier credit balance + increase
    // scripts.push({
    //   sql: `UPDATE tmcb_cntct
    //   SET cntct_crbal = cntct_crbal + $1,      
    // cntct_upusr = $2,
    // cntct_updat = CURRENT_TIMESTAMP,
    // cntct_rvnmr = cntct_rvnmr + 1
    // WHERE id = $3
    //   `,
    //   params: [invcm_duamt, user_s, invcm_cntct],
    //   label: `Update customer credit balance ${newTrnNo}`,
    // });

    //console.log(scripts)

    await dbRunAll(scripts);

    res.json({
      success: true,
      message: "Sales Invoice created successfully",
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
    itm.items_iname, itm.items_szqty, unt.units_cname AS runit_uname, sunit.units_cname as sunit_cname,
     0 as edit_stop
    FROM tmob_invcc ivc
    LEFT JOIN tmib_items itm ON ivc.invcc_items = itm.id
    LEFT JOIN tmib_units unt ON ivc.invcc_units = unt.id
    LEFT JOIN tmib_units sunit ON itm.items_sunit = sunit.id
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

// get-all-due-invoice
router.post("/get-all-due-invoice", async (req, res) => {
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
    FROM tmpb_invcm mrr
    JOIN tmsb_dpart dprt ON mrr.invcm_dpart = dprt.id
    JOIN tmcb_cntct cntct ON mrr.invcm_cntct = cntct.id
    LEFT JOIN tmhb_emply csr ON mrr.invcm_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON mrr.invcm_upusr = usr.id
    WHERE mrr.invcm_users = $1
    AND mrr.invcm_actve = TRUE
    AND (mrr.invcm_pyamt - mrr.invcm_pdamt) > 0
    ORDER BY mrr.invcm_trdat DESC`;

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
