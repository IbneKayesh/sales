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
      mrrpy_mrrdm,
      mrrpy_party,
      mrrpy_pdamt,
      mrrpy_refno,
      mrrpy_notes,
      user_s,
      user_c,
      user_b,
    } = req.body;

    if (
      !mrrpy_mrrdm ||
      !mrrpy_party ||
      !mrrpy_pdamt ||
      !mrrpy_refno ||
      !user_c
    ) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }
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
