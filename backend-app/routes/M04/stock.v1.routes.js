const express = require("express");
const router = express.Router();
const { dbGetAll, dbRun } = require("../../db/sqlManagerpg");

// =====================
// Get Available
// =====================
router.post("/get-available", async (req, res) => {
  try {
    const { user_s, user_c, user_b } = req.body;

    if (!user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    const sql = `SELECT *
            FROM tmib_price prc
            WHERE (prc.price_gdstk > 0
            OR prc.price_bdstk > 0)
            AND prc.price_users = $1`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `Get stock - ${user_c}`);

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
// Get All
// =====================
router.post("/get-price-ledger", async (req, res) => {
  try {
    const { price_id, user_s, user_c, user_b } = req.body;

    if (!price_id || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    const sql = `SELECT stk.*, stk.mrrdc_itqty * stk.mrrdc_csrat line_value,
    cnt.cntct_cname, itm.items_iname, prc.price_cname, unt.units_cname
    FROM(
      SELECT mrm.mrrdm_trnno, mrm.mrrdm_trdat, mrm.mrrdm_cntct,
      mrc.mrrdc_price, mrc.mrrdc_items, mrc.mrrdc_units, mrc.mrrdc_itqty, mrc.mrrdc_csrat
      FROM tmpb_mrrdc mrc
      JOIN tmpb_mrrdm mrm ON mrc.mrrdc_mrrdm = mrm.id
      WHERE mrc.mrrdc_price = $1
      AND mrm.mrrdm_users = $2
      UNION ALL
      SELECT ivm.invcm_trnno, ivm.invcm_trdat, ivm.invcm_cntct,
      ivc.invcc_price, ivc.invcc_items, ivc.invcc_units, 0 - ivc.invcc_itqty, ivc.invcc_csrat
      FROM tmob_invcc ivc
      JOIN tmob_invcm ivm ON ivc.invcc_invcm = ivm.id
      WHERE ivc.invcc_price = $1
      AND ivm.invcm_users = $2
    )stk
    JOIN tmcb_cntct cnt ON stk.mrrdm_cntct = cnt.id
    JOIN tmib_items itm ON stk.mrrdc_items = itm.id
    JOIN tmib_price prc ON stk.mrrdc_price = prc.id
    JOIN tmib_units unt ON stk.mrrdc_units = unt.id
    ORDER BY 2 DESC
    `;

    //ORDER BY mrm.mrrdm_trdat
    const params = [price_id, user_c];
    const rows = await dbGetAll(sql, params, `Get stock - ${user_c}`);

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

module.exports = router;
