const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");
const { GenNewCode } = require("../../db/genHelper");

//mrr-payment
router.post("/mrr-payment", async (req, res) => {
  try {
    const {
      id,
      mrrdm_cntct,
      mrrdm_pdamt,
      mrrdm_duamt,
      tmpb_mrrpy,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (!id || !mrrdm_cntct || !tmpb_mrrpy || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    let new_payment = 0;
    //database action
    //build scripts
    const scripts = [];
    //Insert Payment details
    for (const det of tmpb_mrrpy) {
      //only empty added as new
      if (det.mrrpy_mrrdm === "SYS_NEW") {
        scripts.push({
          sql: `INSERT INTO tmpb_mrrpy(id, mrrpy_users, mrrpy_bsins, mrrpy_mrrdm, mrrpy_party, mrrpy_pdamt,
            mrrpy_refno, mrrpy_notes, mrrpy_crusr, mrrpy_upusr)
            VALUES ($1, $2, $3, $4, $5, $6,
              $7, $8, $9, $10)`,
          params: [
            uuidv4(),
            user_c,
            user_b,
            id,
            det.mrrpy_party,
            det.mrrpy_pdamt || 0,
            det.mrrpy_refno || "",
            det.mrrpy_notes || "",
            user_s,
            user_s,
          ],
          label: `Created MRR payment ${id}`,
        });
      }
      new_payment = new_payment + Number(det.mrrpy_pdamt || 0);
    }
    scripts.push({
      sql: `UPDATE tmpb_mrrdm
        SET mrrdm_pdamt = $1,
        mrrdm_duamt =  $2,
        mrrdm_upusr = $3,
        mrrdm_updat = CURRENT_TIMESTAMP,
        mrrdm_rvnmr = mrrdm_rvnmr + 1
        WHERE id = $4`,
      params: [mrrdm_pdamt, mrrdm_duamt, user_s, id],
      label: `Update MRR master ${id}`,
    });

    //Update supplier credit balance - decrease
    scripts.push({
      sql: `UPDATE tmcb_cntct
      SET cntct_crbal = cntct_crbal - $1,      
    cntct_upusr = $2,
    cntct_updat = CURRENT_TIMESTAMP,
    cntct_rvnmr = cntct_rvnmr + 1
    WHERE id = $3
      `,
      params: [new_payment, user_s, mrrdm_cntct],
      label: `Update supplier credit balance is now: ${mrrdm_duamt}`,
    });

    await dbRunAll(scripts);

    res.json({
      success: true,
      message: "MRR payment created successfully",
      data: {
        ...req.body,
      },
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
