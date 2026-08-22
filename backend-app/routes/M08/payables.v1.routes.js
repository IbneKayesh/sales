const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");
const {
  GenNewCode,
  GenNewTrn,
  getCurrentPeriod,
  getCurrencyRate 
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

    const sql = `SELECT mrm.id mrrpy_mrrdm, '' mrrpy_party,
mrm.mrrdm_pyamt - mrm.mrrdm_pdamt mrrpy_duamt, 0 mrrpy_pdamt,
mrm.mrrdm_trnno mrrpy_refno, mrm.mrrdm_ttype || ' payments' mrrpy_notes,
mrm.mrrdm_ttype, mrm.mrrdm_trnno, mrm.mrrdm_trdat, mrm.mrrdm_dpart, dpt.dpart_cname, cnt.cntct_cname,
pty.id party_id, pty.party_chtac chtac_id
FROM tmpb_mrrdm mrm
JOIN tmsb_dpart dpt ON mrm.mrrdm_dpart = dpt.id
JOIN tmcb_cntct cnt ON mrm.mrrdm_cntct = cnt.id
JOIN tmtb_party pty ON cnt.id = pty.party_vndor
JOIN tmtb_chtac cht ON pty.party_chtac = cht.id
JOIN tmtb_prtyr ptr ON cht.chtac_chtno = ptr.prtyr_chtno
WHERE mrm.mrrdm_pyamt - mrm.mrrdm_pdamt > 0
AND mrm.mrrdm_ttype = 'Material Receipt Report'
AND mrm.mrrdm_users = $1
AND mrm.mrrdm_bsins = $2
AND ptr.prtyr_mgrup = 'SYS_MRR_DIRECT'
AND ptr.prtyr_sgrup = 'SYS_LIB_SUPPLIER'
ORDER BY mrm.mrrdm_trdat DESC`;

    const rows = await dbGetAll(
      sql,
      [user_c, user_b],
      `Get Payables - ${user_c}`,
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
      mrrdm_dpart,
      mrrdm_ttype,
      mrrpy_mrrdm,
      mrrpy_party,
      mrrpy_pdamt,
      mrrpy_refno,
      mrrpy_notes,
      party_id,
      chtac_id,
      party_id_pay,
      chtac_id_pay,
      user_s,
      user_c,
      user_b,
    } = req.body;

    if (
      !mrrdm_dpart ||
      !mrrdm_ttype ||
      !mrrpy_mrrdm ||
      !mrrpy_party ||
      !mrrpy_pdamt ||
      !mrrpy_refno ||
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
    const acprd = await getCurrentPeriod(user_c, user_b, mrrdm_dpart);
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
      mrrdm_dpart,
    );

    console.log("p1");

    //active currency rate
    const crncy = await getCurrencyRate(user_c, user_b);
    console.log("crncy",crncy);
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
console.log("p2");

    //build scripts
    const sql = `SELECT mrm.mrrdm_pyamt-(COALESCE(SUM(mrp.mrrpy_pdamt),0) + $1) mrrdm_duamt
    FROM tmpb_mrrdm mrm
    LEFT JOIN tmpb_mrrpy mrp ON mrm.id = mrp.mrrpy_mrrdm
    WHERE mrm.id = $2
    GROUP BY mrm.mrrdm_pyamt`;
    const params = [mrrpy_pdamt, mrrpy_mrrdm];
    const result = await dbGet(sql, params);
    if (Number(result.mrrdm_duamt) < 0) {
      return res.json({
        success: false,
        message: "Overpaid is not valid",
        data: {},
      });
    }

    const scripts = [];
    scripts.push({
      sql: `INSERT INTO tmpb_mrrpy(id, mrrpy_users, mrrpy_bsins, mrrpy_mrrdm, mrrpy_party, mrrpy_pdamt,
        mrrpy_refno, mrrpy_notes, mrrpy_crusr, mrrpy_upusr)
        VALUES ($1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10)`,
      params: [
        uuidv4(),
        user_c,
        user_b,
        mrrpy_mrrdm,
        mrrpy_party,
        mrrpy_pdamt || 0,
        mrrpy_refno || "",
        mrrpy_notes || "",
        user_s,
        user_s,
      ],
      label: `Created Payment detail ${mrrpy_refno}`,
    });

    scripts.push({
      sql: `UPDATE tmpb_mrrdm
        SET mrrdm_pdamt = mrrdm_pdamt + $1,
        mrrdm_duamt = mrrdm_duamt - $2,
        mrrdm_upusr = $3,
        mrrdm_updat = CURRENT_TIMESTAMP,
        mrrdm_rvnmr = mrrdm_rvnmr + 1
        WHERE id = $4`,
      params: [mrrpy_pdamt, mrrpy_pdamt, user_s, mrrpy_mrrdm],
      label: `Update Sales Invoice master ${mrrpy_refno}`,
    });

    //create journal
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
        mrrdm_dpart,
        fsyar_id,
        acprd_id,
        crncy.crncy_tcrnc,
        "Payment Voucher",
        newTrnNo_JV,
        new Date(),
        mrrpy_refno,
        mrrdm_ttype,
        0,
        0,
        crncy.crncy_exrat,
        "Posted",
        user_s,
        user_s,
      ],
      label: `create journal master- ${newTrnNo_JV}`,
    });

    //SYS_MRR_DIRECT.PAY_SUPPLIER > Liability / Supplier Payable - 20101010 (DR)
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
        mrrdm_dpart,
        newId_JV,
        chtac_id,
        party_id,
        mrrpy_pdamt || 0,
        0,
        "Clear Liability / Supplier Payable",
        mrrdm_ttype,
        mrrpy_mrrdm,
        "MASTER",
        1,
        user_s,
        user_s,
      ],
      label: `Clear Liability / Supplier / Payable ${newTrnNo_JV}`,
    });
    //SYS_MRR_DIRECT.PAY_CASH_BANK	> Asset / Cash In Hand - 10101010 (CR)
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
        mrrdm_dpart,
        newId_JV,
        chtac_id_pay,
        party_id_pay,
        0,
        mrrpy_pdamt || 0,
        "Payment Liability / Supplier Payable",
        mrrdm_ttype,
        mrrpy_mrrdm,
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
        mrrpy_refno: mrrpy_refno,
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
