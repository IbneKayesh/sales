const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");
const {
  GenNewCode,
  GenNewTrn,
  getCurrentPeriod,
  getCurrencyRate,
} = require("../../db/genHelper");

// =====================
// Get All
// =====================
router.post("/", async (req, res) => {
  try {
    const { user_s, user_c, user_b } = req.body;

    if (!user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    const sql = `SELECT ivm.id invpy_invcm, '' invpy_party,
ivm.invcm_pyamt - ivm.invcm_pdamt invpy_duamt, 0 invpy_pdamt,
ivm.invcm_trnno invpy_refno, ivm.invcm_ttype || ' collections' invpy_notes,
ivm.invcm_ttype, ivm.invcm_trnno, ivm.invcm_trdat, ivm.invcm_dpart, dpt.dpart_cname, cnt.cntct_cname,
pty.id party_id, pty.party_chtac chtac_id
FROM tmob_invcm ivm
JOIN tmsb_dpart dpt ON ivm.invcm_dpart = dpt.id
JOIN tmcb_cntct cnt ON ivm.invcm_cntct = cnt.id
JOIN tmtb_party pty ON cnt.id = pty.party_vndor
JOIN tmtb_chtac cht ON pty.party_chtac = cht.id
JOIN tmtb_prtyr ptr ON cht.chtac_chtno = ptr.prtyr_chtno
WHERE ivm.invcm_pyamt - ivm.invcm_pdamt > 0
AND ivm.invcm_ttype = 'Sales Invoice'
AND ivm.invcm_users = $1
AND ivm.invcm_bsins = $2
AND ptr.prtyr_mgrup = 'SYS_SALES_INVOICE'
AND ptr.prtyr_sgrup = 'SYS_AST_CUSTOMER'
AND ptr.prtyr_party = 'USER-CHOICE'
ORDER BY ivm.invcm_trdat DESC`;

    const rows = await dbGetAll(
      sql,
      [user_c, user_b],
      `Get Receivables - ${user_c}`,
    );

    res.json({
      success: true,
      message: "Query executed successfully.",
      data: rows,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: [],
    });
  }
});

// =====================
// create
// =====================
router.post("/create", async (req, res) => {
  try {
    const {
      invcm_dpart,
      invcm_ttype,
      invpy_invcm,
      invpy_party,
      invpy_pdamt,
      invpy_refno,
      invpy_notes,
      party_id,
      chtac_id,
      party_id_pay,
      chtac_id_pay,
      user_s,
      user_c,
      user_b,
    } = req.body;

    if (
      !invcm_dpart ||
      !invcm_ttype ||
      !invpy_invcm ||
      !invpy_party ||
      !invpy_pdamt ||
      !invpy_refno ||
      !party_id ||
      !chtac_id ||
      !party_id_pay ||
      !chtac_id_pay ||
      !user_c
    ) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }
    //database actions
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
      "Receipt Voucher",
      invcm_dpart,
    );
    //active currency rate
    const crncy = await getCurrencyRate(user_c, user_b);
    //console.log("crncy",crncy);
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

    const sql = `SELECT ivm.invcm_pyamt-(COALESCE(SUM(ivp.invpy_pdamt),0) + $1) invcm_duamt
FROM tmob_invcm ivm
LEFT JOIN tmob_invpy ivp ON ivm.id = ivp.invpy_invcm
WHERE ivm.id = $2
GROUP BY ivm.invcm_pyamt`;
    const params = [invpy_pdamt, invpy_invcm];
    const result = await dbGet(sql, params);
    if (Number(result.invcm_duamt) < 0) {
      return res.json({
        success: false,
        message: "Overpaid is not valid",
        data: {},
      });
    }

    //build scripts
    const scripts = [];
    scripts.push({
      sql: `INSERT INTO tmob_invpy(id, invpy_users, invpy_bsins, invpy_invcm, invpy_party, invpy_pdamt,
        invpy_refno, invpy_notes, invpy_crusr, invpy_upusr)
        VALUES ($1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10)`,
      params: [
        uuidv4(),
        user_c,
        user_b,
        invpy_invcm,
        invpy_party,
        invpy_pdamt || 0,
        invpy_refno || "",
        invpy_notes || "",
        user_s,
        user_s,
      ],
      label: `Created Payment detail ${invpy_refno}`,
    });

    scripts.push({
      sql: `UPDATE tmob_invcm
        SET invcm_pdamt = invcm_pdamt + $1,
        invcm_duamt = invcm_duamt - $2,
        invcm_upusr = $3,
        invcm_updat = CURRENT_TIMESTAMP,
        invcm_rvnmr = invcm_rvnmr + 1
        WHERE id = $4`,
      params: [invpy_pdamt, invpy_pdamt, user_s, invpy_invcm],
      label: `Update Sales Invoice master ${invpy_refno}`,
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
        "Receipt Voucher",
        newTrnNo_JV,
        new Date(),
        invpy_refno,
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
        invpy_pdamt || 0,
        "Clear Assets / Customer / Receivable",
        invcm_ttype,
        invpy_invcm,
        "MASTER",
        1,
        user_s,
        user_s,
      ],
      label: `Clear Assets / Customer / Receivable ${newTrnNo_JV}`,
    });

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
        chtac_id_pay,
        party_id_pay,
        invpy_pdamt || 0,
        0,
        "Receive Assets / Customer Receivable",
        invcm_ttype,
        invpy_invcm,
        "MASTER",
        2,
        user_s,
        user_s,
      ],
      label: `Receive Assets / Customer Receivable ${newTrnNo_JV}`,
    });

    await dbRunAll(scripts);

    res.json({
      success: true,
      message: "Payment created successfully",
      data: {
        ...req.body,
        invpy_refno: invpy_refno,
      },
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: [],
    });
  }
});

module.exports = router;
