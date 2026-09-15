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
const { buildJournalScripts } = require("../../db/journalService");

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
    // ─── OLD: manual period/currency/journal-number lookup (commented out) ───
    // const acprd = await getCurrentPeriod(user_c, user_b, dpart_id);
    // if (!acprd) { return { success: false, message: "No active fiscal year or accounting period found", data: {} }; }
    // if (acprd.length > 1) { return { success: false, message: "Multiple active accounting periods found.", data: {} }; }
    // const { acprd_id, fsyar_id } = acprd[0];
    // const newId_JV = uuidv4();
    // const newTrnNo_JV = await GenNewTrn(user_c, user_b, "tmtb_jrnlm", "Payment Voucher", dpart_id);
    // const crncy = await getCurrencyRate(user_c, user_b);
    // if (!crncy) { return { success: false, message: "No active currency rate found", data: {} }; }
    // if (crncy.length > 1) { return { success: false, message: "Multiple active currency rate found.", data: {} }; }
    // ─── END OLD ───

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

    // ─── NEW: Collect journal details and use centralized helper ───
    const jrnlDetails = [];

    // Local Vendor Payable (DR)
    jrnlDetails.push({
      chtac: chtac_id, party: party_id,
      drval: pay_value || 0, crval: 0,
      descr: "Clear Liability / Local Vendor Payable", sorce: ttype, refid: trn_id,
    });

    // Cash/Bank (CR)
    jrnlDetails.push({
      chtac: chtac_id_pay, party: party_id_pay,
      drval: 0, crval: pay_value || 0,
      descr: "Payment Liability / Local Vendor Payable", sorce: ttype, refid: trn_id,
    });

    // Build journal scripts via centralized helper
    const { scripts: jrnlScripts, masterId: newId_JV, trnNo: newTrnNo_JV } = await buildJournalScripts({
      user_c, user_b, user_s, dpart: dpart_id,
      trtyp: "Payment Voucher", trdat: new Date(),
      refno: trnno, narrt: ttype,
      drval: pay_value, crval: pay_value,
      details: jrnlDetails,
    });
    scripts.push(...jrnlScripts);

    await dbRunAll(scripts);

    res.json({
      success: true,
      message: `${newTrnNo_JV} - Payment created successfully`,
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
