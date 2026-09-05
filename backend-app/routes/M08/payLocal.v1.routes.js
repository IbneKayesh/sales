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

    //MRR + Sales Invoice

    const sql = `SELECT mcs.id, mcs.mrrcs_users users_id, mcs.mrrcs_bsins bsins_id,
    mrm.mrrdm_dpart dpart_id, mcs.mrrcs_mrrdm trn_id, mcs.mrrcs_party party_id,
    mcs.mrrcs_csmod csmod, mcs.mrrcs_value due_value, mcs.mrrcs_notes notes,
mrm.mrrdm_ttype ttype, mrm.mrrdm_trnno trnno, mrm.mrrdm_trdat trdat,
pty.party_chtac chtac_id, pty.party_cname, dpt.dpart_cname
FROM tmpb_mrrcs mcs
JOIN tmpb_mrrdm mrm ON mcs.mrrcs_mrrdm = mrm.id
JOIN tmtb_party pty ON mcs.mrrcs_party = pty.id
JOIN tmsb_dpart dpt ON mrm.mrrdm_dpart = dpt.id
WHERE mcs.mrrcs_csmod = 'Exclude'
AND mcs.mrrcs_jrnlm = 'SYS_FOR_PAYMENT'
AND mrm.mrrdm_users = $1
AND mrm.mrrdm_bsins = $2
UNION ALL
SELECT ics.id, ics.invcs_users, ics.invcs_bsins,
ivm.invcm_dpart, ics.invcs_invcm, ics.invcs_party,
ics.invcs_csmod, ics.invcs_value, ics.invcs_notes,
ivm.invcm_ttype, ivm.invcm_trnno, ivm.invcm_trdat,
pty.party_chtac chtac_id, pty.party_cname, dpt.dpart_cname
FROM tmob_invcs ics
JOIN tmob_invcm ivm ON ics.invcs_invcm = ivm.id
JOIN tmtb_party pty ON ics.invcs_party = pty.id
JOIN tmsb_dpart dpt ON ivm.invcm_dpart = dpt.id
WHERE ics.invcs_csmod = 'Exclude'
AND ics.invcs_jrnlm = 'SYS_FOR_PAYMENT'
AND ivm.invcm_users = $1
AND ivm.invcm_bsins = $2`;

    const rows = await dbGetAll(
      sql,
      [user_c, user_b],
      `Get Payables Local - ${user_c}`,
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
// create, same is MRR Direct Payment
// =====================
router.post("/create", async (req, res) => {
  try {
    const {
      id,
      dpart_id,
      ttype,
      trn_id,
      party_id,
      pay_value,
      trnno,
      notes,
      chtac_id,
      party_id_pay,
      chtac_id_pay,
      user_s,
      user_c,
      user_b,
    } = req.body;

    if (
      !id ||
      !dpart_id ||
      !ttype ||
      !trn_id ||
      !party_id ||
      !pay_value ||
      !trnno ||
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
    const acprd = await getCurrentPeriod(user_c, user_b, dpart_id);
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
      "Payment Voucher",
      dpart_id,
    );

    //console.log("p1");

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
    //console.log("p2");

    //build scripts
    const scripts = [];
    if (ttype === "Material Receipt Report") {
      scripts.push({
        sql: `UPDATE tmpb_mrrcs
      SET mrrcs_jrnlm = $1
      WHERE id = $2`,
        params: [newId_JV, id],
        label: `Update Material Receipt Report Journal ${newTrnNo_JV}`,
      });
    } else if (ttype === "Sales Invoice") {
      scripts.push({
        sql: `UPDATE tmob_invcs
      SET invcs_jrnlm = $1
      WHERE id = $2`,
        params: [newId_JV, id],
        label: `Update Sales Invoice Journal ${newTrnNo_JV}`,
      });
    }

    //SYS_PAYMENT
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
        dpart_id,
        fsyar_id,
        acprd_id,
        crncy.crncy_tcrnc,
        "Payment Voucher",
        newTrnNo_JV,
        new Date(),
        trnno,
        ttype,
        pay_value,
        pay_value,
        crncy.crncy_exrat,
        "Posted",
        user_s,
        user_s,
      ],
      label: `create journal master- ${newTrnNo_JV}`,
    });

    //SYS_MRR.SYS_MRR_DIRECT.SYS_LIB_LOCAL_VENDOR
    //SYS_SALES.SYS_SALES_INVOICE.SYS_LIB_LOCAL_VENDOR
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
        dpart_id,
        newId_JV,
        chtac_id,
        party_id,
        pay_value || 0,
        0,
        "Clear Liability / Supplier Payable",
        ttype,
        trn_id,
        "MASTER",
        1,
        user_s,
        user_s,
      ],
      label: `Clear Liability / Supplier / Payable ${newTrnNo_JV}`,
    });
    //SYS_PAYMENT.SYS_PAYMENT_LOCAL.SYS_AST_PAYMENT
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
        dpart_id,
        newId_JV,
        chtac_id_pay,
        party_id_pay,
        0,
        pay_value || 0,
        "Payment Liability / Supplier Payable",
        ttype,
        trn_id,
        "MASTER",
        2,
        user_s,
        user_s,
      ],
      label: `Payment Liability / Supplier / Payable ${newTrnNo_JV}`,
    });

    await dbRunAll(scripts);

    res.json({
      success: true,
      message: "Payment created successfully",
      data: {
        ...req.body,
        jrnlm_trnno: newTrnNo_JV,
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
