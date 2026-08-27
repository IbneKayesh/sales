const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");
const {
  GenNewCode,
  GenNewTrn,
  getCurrentPeriod,
  getCurrencyRate,
  getCoaAssetInputVat,
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
    const sql = `SELECT trm.*, dpt.dpart_cname, cnt.cntct_cname,
    csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 as edit_stop
    FROM tmib_trnsm trm
    JOIN tmsb_dpart dpt ON trm.trnsm_dpart = dpt.id
    JOIN tmcb_cntct cnt ON trm.trnsm_cntct = cnt.id
    LEFT JOIN tmhb_emply csr ON trm.trnsm_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON trm.trnsm_upusr = usr.id
    WHERE trm.trnsm_users = $1
    ORDER BY trm.trnsm_trdat DESC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get trm- ${user_c}`);
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
    const sql = `SELECT trm.*,
    csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 as edit_stop
    FROM tmib_trnsm trm
    LEFT JOIN tmhb_emply csr ON trm.trnsm_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON trm.trnsm_upusr = usr.id
    WHERE trm.trnsm_users = $1
    AND trm.trnsm_actve = TRUE
    ORDER BY trm.trnsm_trnno ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get trm- ${user_c}`);
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
      trnsm_users,
      trnsm_bsins,
      trnsm_dpart,
      trnsm_cntct,
      trnsm_ttype,
      trnsm_trnno,
      trnsm_trdat,
      trnsm_refno,
      trnsm_notes,
      trnsm_tramt,
      trnsm_itmds,
      trnsm_dspct,
      trnsm_invds,
      trnsm_vtamt,
      trnsm_icamt,
      trnsm_ecamt,
      trnsm_pyamt,
      trnsm_pdamt,
      trnsm_duamt,
      trnsm_stamt,
      trnsm_csamt,
      trnsm_vehid,
      trnsm_ispst,
      trnsm_ispad,
      trnsm_isqcp,
      trnsm_isapp,
      party_id,
      chtac_id,
      tmpb_mrrdc,
      tmpb_mrrcs,
      tmpb_mrrpy,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !trnsm_dpart ||
      !trnsm_cntct ||
      !trnsm_ttype ||
      !tmpb_mrrdc ||
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
    const acprd = await getCurrentPeriod(user_c, user_b, trnsm_dpart);
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
      "Purchase Invoice",
      trnsm_dpart,
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
    //const newCode = await GenNewCode(user_c, "tmib_trnsm");
    const newTrnNo = await GenNewTrn(
      user_c,
      user_b,
      "tmib_trnsm",
      trnsm_ttype, //"Material Receipt Report",
      trnsm_dpart,
    );

    //input vat (purchase)
    const inpVat = await getCoaAssetInputVat(user_c, user_b);
    if (!inpVat) {
      return {
        success: false,
        message: "Input VAT Account is not found",
        data: {},
      };
    }
    //build scripts
    const scripts = [];
    scripts.push({
      sql: `INSERT INTO tmib_trnsm(id, trnsm_users, trnsm_bsins, trnsm_dpart, trnsm_cntct, trnsm_ttype,
      trnsm_trnno, trnsm_trdat, trnsm_refno, trnsm_notes, trnsm_tramt, trnsm_itmds,
      trnsm_dspct, trnsm_invds, trnsm_vtamt, trnsm_icamt, trnsm_ecamt, trnsm_pyamt,
      trnsm_pdamt, trnsm_duamt, trnsm_stamt, trnsm_csamt, trnsm_vehid, trnsm_ispst,
      trnsm_ispad, trnsm_isqcp, trnsm_isapp, trnsm_crusr, trnsm_upusr)
    VALUES ($1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11, $12,
      $13, $14, $15, $16, $17, $18,
      $19, $20, $21, $22, $23, $24,
      $25, $26, $27, $28, $29)`,
      params: [
        newId,
        user_c,
        user_b,
        trnsm_dpart,
        trnsm_cntct,
        trnsm_ttype,
        newTrnNo,
        trnsm_trdat,
        trnsm_refno,
        trnsm_notes,
        trnsm_tramt || 0,
        trnsm_itmds || 0,
        trnsm_dspct || 0,
        trnsm_invds || 0,
        trnsm_vtamt || 0,
        trnsm_icamt || 0,
        trnsm_ecamt || 0,
        trnsm_pyamt || 0,
        trnsm_pdamt || 0,
        trnsm_duamt || 0,
        trnsm_stamt || 0,
        trnsm_csamt || 0,
        trnsm_vehid,
        true,
        trnsm_ispad,
        true,
        true,
        user_s,
        user_s,
      ],
      label: `Created trm ${newTrnNo}`,
    });

    //SYS_MRR_DIRECT
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
        trnsm_dpart,
        fsyar_id,
        acprd_id,
        crncy.crncy_tcrnc,
        "Purchase Invoice",
        newTrnNo_JV,
        trnsm_trdat,
        newTrnNo,
        trnsm_ttype,
        0,
        0,
        crncy.crncy_exrat,
        "Posted",
        user_s,
        user_s,
      ],
      label: `create journal master- ${newTrnNo_JV}`,
    });

    //Insert trm details, Stock Details
    let line = 1;
    for (const det of tmpb_mrrdc) {
      const lineId = uuidv4();
      scripts.push({
        sql: `INSERT INTO tmpb_mrrdc(id, mrrdc_users, mrrdc_bsins, mrrdc_mrrdm, mrrdc_price, mrrdc_items,
                          mrrdc_units, mrrdc_itrat, mrrdc_itqty, mrrdc_itamt, mrrdc_dspct, mrrdc_dsamt,
                          mrrdc_edamt, mrrdc_vtpct, mrrdc_vtamt, mrrdc_vtype, mrrdc_icamt, mrrdc_ecamt,
                          mrrdc_pyamt, mrrdc_stamt, mrrdc_notes, mrrdc_csrat, mrrdc_refid, mrrdc_crusr, mrrdc_upusr)
        VALUES ($1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11, $12,
      $13, $14, $15, $16, $17, $18,
      $19, $20, $21, $22, $23, $24, $25)`,
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
          det.mrrdc_vtpct || 0,
          det.mrrdc_vtamt || 0,
          det.mrrdc_vtype || "-",
          det.mrrdc_icamt || 0,
          det.mrrdc_ecamt || 0,
          det.mrrdc_pyamt || 0,
          det.mrrdc_stamt || 0,
          det.mrrdc_notes || "",
          det.mrrdc_csrat || 0,
          det.mrrdc_refid || "",
          user_s,
          user_s,
        ],
        label: `Created trm detail ${newTrnNo}`,
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
          trnsm_dpart,
          trnsm_ttype,
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
        label: `Created trm stock detail ${newTrnNo}`,
      });

      //update summary stock, last price
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

      //SYS_MRR_DIRECT.SYS_AST_INVENTORY > Asset / Inventory Products - 10101212 (DR)
      // let thisLineAmount =
      //   Number(det.mrrdc_itqty || 0) * Number(det.mrrdc_csrat || 0);
      // scripts.push({
      //   sql: `INSERT INTO tmtb_jrnlc(id, jrnlc_users, jrnlc_bsins, jrnlc_dpart, jrnlc_jrnlm, jrnlc_chtac,
      //   jrnlc_party, jrnlc_drval, jrnlc_crval, jrnlc_descr, jrnlc_sorce, jrnlc_refid,
      //   jrnlc_rtype, jrnlc_lines, jrnlc_crusr, jrnlc_upusr)
      //   VALUES ($1, $2, $3, $4, $5, $6,
      //   $7, $8, $9, $10, $11, $12,
      //   $13, $14, $15, $16)`,
      //   params: [
      //     uuidv4(),
      //     user_c,
      //     user_b,
      //     trnsm_dpart,
      //     newId_JV,
      //     det.chtac_id,
      //     det.party_id,
      //     thisLineAmount,
      //     0,
      //     "To Asset / Inventory / Products",
      //     trnsm_ttype,
      //     newId,
      //     "MASTER",
      //     line,
      //     user_s,
      //     user_s,
      //   ],
      //   label: `Create Asset / Inventory / Products ${newTrnNo_JV}`,
      // });
      // line++;
    }

    const newGroupedProducts = Object.values(
      tmpb_mrrdc.reduce((groups, det) => {
        const key = `${det.chtac_id}_${det.party_id}`;

        if (!groups[key]) {
          groups[key] = {
            chtac_id: det.chtac_id,
            party_id: det.party_id,
            item_amount: 0,
          };
        }

        groups[key].item_amount +=
          Number(det.mrrdc_itqty || 0) * Number(det.mrrdc_csrat || 0);

        return groups;
      }, {}),
    );

    //SYS_MRR_DIRECT.SYS_AST_INVENTORY > Asset / Inventory Products - 10101212 (DR)
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
          trnsm_dpart,
          newId_JV,
          det.chtac_id,
          det.party_id,
          det.item_amount,
          0,
          "To Asset / Inventory / Products",
          trnsm_ttype,
          newId,
          "MASTER",
          line,
          user_s,
          user_s,
        ],
        label: `Create Asset / Inventory / Products ${newTrnNo_JV}`,
      });
      line++;
    }

    //SYS_MRR_DIRECT.SYS_LIB_SUPPLIER > Liability / Supplier Payable - 20101010 (CR)
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
        trnsm_dpart,
        newId_JV,
        chtac_id,
        party_id,
        0,
        trnsm_pyamt || 0,
        "From Liability / Supplier Payable",
        trnsm_ttype,
        newId,
        "MASTER",
        line,
        user_s,
        user_s,
      ],
      label: `Create Liability / Supplier / Payable ${newTrnNo_JV}`,
    });
    line++;

    //SYS_MRR_DIRECT.SYS_AST_INP_VAT > Assets / Current Assets / VAT & Tax Receivable / Input VAT (Purchase VAT) - 10101411 (DR)
    if (Number(trnsm_vtamt) > 0) {
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
          trnsm_dpart,
          newId_JV,
          inpVat.chtac_id,
          inpVat.party_id,
          trnsm_vtamt || 0,
          0,
          "To Assets / Current Assets / VAT & Tax Receivable / Input VAT (Purchase VAT)",
          trnsm_ttype,
          newId,
          "MASTER",
          line,
          user_s,
          user_s,
        ],
        label: `Create Assets / Current Assets / VAT & Tax Receivable / Input VAT (Purchase VAT) ${newTrnNo_JV}`,
      });
      line++;
    }

    //Insert Costing details
    for (const det of tmpb_mrrcs) {
      const costId = uuidv4();
      scripts.push({
        sql: `INSERT INTO tmpb_mrrcs(id, mrrcs_users, mrrcs_bsins, mrrcs_mrrdm, mrrcs_party, mrrcs_csmod, 
        mrrcs_clmod, mrrcs_value, mrrcs_notes, mrrcs_crusr, mrrcs_upusr)
        VALUES ($1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11)`,
        params: [
          costId,
          user_c,
          user_b,
          newId,
          det.mrrcs_party, //party name
          det.mrrcs_csmod, //costing mode
          det.mrrcs_clmod, //calculation mode
          det.mrrcs_value || 0,
          det.mrrcs_notes || "",
          det.mrrcs_csmod === "Exclude" ? "SYS_FOR_PAYMENT" : "SYS_NOT_FOR_PAYMENT",
          user_s,
          user_s,
        ],
        label: `Created Costing detail ${newTrnNo}`,
      });
      //SYS_MRR_DIRECT.SYS_LIB_LOCAL_VENDOR > Liability / Local Vendor/Contractor/Labor - 20101011 (CR)
      if (det.mrrcs_csmod === "Exclude") {
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
            trnsm_dpart,
            newId_JV,
            det.chtac_id,
            det.party_id,
            0,
            det.mrrcs_value || 0,
            "From Liability / Local Vendor Payable",
            trnsm_ttype,
            newId,
            "MASTER",
            line,
            user_s,
            user_s,
          ],
          label: `Create Liability / Local Vendor / Payable ${newTrnNo_JV}`,
        });
        line++;
      }
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
          det.mrrpy_refno || newTrnNo,
          det.mrrpy_notes || "",
          user_s,
          user_s,
        ],
        label: `Created Payment detail ${newTrnNo}`,
      });

      //SYS_MRR_DIRECT.SYS_LIB_SUPPLIER > Liability / Supplier Payable - 20101010 (DR)
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
          trnsm_dpart,
          newId_JV,
          chtac_id,
          party_id,
          det.mrrpy_pdamt || 0,
          0,
          "Clear Liability / Supplier Payable",
          trnsm_ttype,
          newId,
          "MASTER",
          line,
          user_s,
          user_s,
        ],
        label: `Clear Liability / Supplier / Payable ${newTrnNo_JV}`,
      });

      line++;
      //SYS_MRR_DIRECT.SYS_AST_PAY_CASH/SYS_AST_PAY_BANK	> Asset / Cash In Hand - 10101010 (CR)
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
          trnsm_dpart,
          newId_JV,
          det.chtac_id_pay,
          det.party_id_pay,
          0,
          det.mrrpy_pdamt || 0,
          "Payment Liability / Supplier Payable",
          trnsm_ttype,
          newId,
          "MASTER",
          line,
          user_s,
          user_s,
        ],
        label: `Payment Liability / Supplier / Payable ${newTrnNo_JV}`,
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
      params: [trnsm_duamt, user_s, trnsm_cntct],
      label: `Update supplier credit balance ${newTrnNo}`,
    });

    await dbRunAll(scripts);

    res.json({
      success: true,
      message: "trm created successfully",
      data: {
        ...req.body,
        trnsm_trnno: newTrnNo,
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
    const rows = await dbGetAll(sql, params, `get trm Details- ${user_c}`);
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

// get-all-due-trm
router.post("/get-all-due-trm", async (req, res) => {
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
    const sql = `SELECT trm.*,
    dprt.dpart_cname, cntct.cntct_cname,
    csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 as edit_stop
    FROM tmib_trnsm trm
    JOIN tmsb_dpart dprt ON trm.trnsm_dpart = dprt.id
    JOIN tmcb_cntct cntct ON trm.trnsm_cntct = cntct.id
    LEFT JOIN tmhb_emply csr ON trm.trnsm_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON trm.trnsm_upusr = usr.id
    WHERE trm.trnsm_users = $1
    AND trm.trnsm_actve = TRUE
    AND (trm.trnsm_pyamt - trm.trnsm_pdamt) > 0
    ORDER BY trm.trnsm_trdat DESC`;

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
