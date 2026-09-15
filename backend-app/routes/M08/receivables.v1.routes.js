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
JOIN tmtb_chtrt crt ON cht.chtac_chtno = crt.chtrt_chtno
WHERE ivm.invcm_pyamt - ivm.invcm_pdamt > 0
AND ivm.invcm_ttype = 'Sales Invoice'
AND ivm.invcm_users = $1
AND ivm.invcm_bsins = $2
AND crt.chtrt_trnid = 'SYS_SALES'
AND crt.chtrt_pegid = 'SYS_SALES_INVOICE'
AND crt.chtrt_grpid = 'SYS_AST_CUSTOMER'
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
    // ─── OLD: manual period/currency/journal-number lookup (commented out) ───
    // const acprd = await getCurrentPeriod(user_c, user_b, invcm_dpart);
    // if (!acprd) { return { success: false, message: "No active fiscal year or accounting period found", data: {} }; }
    // if (acprd.length > 1) { return { success: false, message: "Multiple active accounting periods found.", data: {} }; }
    // const { acprd_id, fsyar_id } = acprd[0];
    // const newId_JV = uuidv4();
    // const newTrnNo_JV = await GenNewTrn(user_c, user_b, "tmtb_jrnlm", "Receipt Voucher", invcm_dpart);
    // const crncy = await getCurrencyRate(user_c, user_b);
    // if (!crncy) { return { success: false, message: "No active currency rate found", data: {} }; }
    // if (crncy.length > 1) { return { success: false, message: "Multiple active currency rate found.", data: {} }; }
    // ─── END OLD ───

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

    // ─── NEW: Collect journal details and use centralized helper ───
    const jrnlDetails = [];

    // Customer Receivable (CR)
    jrnlDetails.push({
      chtac: chtac_id, party: party_id,
      drval: 0, crval: invpy_pdamt || 0,
      descr: "Clear Assets / Customer / Receivable", sorce: invcm_ttype, refid: invpy_invcm,
    });

    // Cash/Bank (DR)
    jrnlDetails.push({
      chtac: chtac_id_pay, party: party_id_pay,
      drval: invpy_pdamt || 0, crval: 0,
      descr: "Receive Assets / Customer Receivable", sorce: invcm_ttype, refid: invpy_invcm,
    });

    // Build journal scripts via centralized helper
    const { scripts: jrnlScripts, masterId: newId_JV, trnNo: newTrnNo_JV } = await buildJournalScripts({
      user_c, user_b, user_s, dpart: invcm_dpart,
      trtyp: "Receipt Voucher", trdat: new Date(),
      refno: invpy_refno, narrt: invcm_ttype,
      drval: 0, crval: 0,
      details: jrnlDetails,
    });
    scripts.push(...jrnlScripts);

    await dbRunAll(scripts);

    res.json({
      success: true,
      message: `${newTrnNo_JV} - Payment created successfully`,
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
