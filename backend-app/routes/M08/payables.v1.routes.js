const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");
const { GenNewCode } = require("../../db/genHelper");

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
mrm.mrrdm_ttype, mrm.mrrdm_trnno, mrm.mrrdm_trdat, dpt.dpart_cname, cnt.cntct_cname
FROM tmpb_mrrdm mrm
JOIN tmsb_dpart dpt ON mrm.mrrdm_dpart = dpt.id
JOIN tmcb_cntct cnt ON mrm.mrrdm_cntct = cnt.id
WHERE mrm.mrrdm_pyamt - mrm.mrrdm_pdamt > 0
AND mrm.mrrdm_ttype = 'Material Receipt Report'
AND mrm.mrrdm_users = $1
AND mrm.mrrdm_bsins = $2
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
      invpy_invcm,
      invpy_party,
      invpy_pdamt,
      invpy_refno,
      invpy_notes,
      user_s,
      user_c,
      user_b,
    } = req.body;

    if (
      !invpy_invcm ||
      !invpy_party ||
      !invpy_pdamt ||
      !invpy_refno ||
      !user_c
    ) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }
    //build scripts
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
