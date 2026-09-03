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

    //mrr (+), sales (-), production (-), batch (+), adjustment (+)
    const sql = `SELECT stk.*, stk.mrrdc_itqty * stk.mrrdc_csrat line_value,
    COALESCE(cnt.cntct_cname, stk.mrrdm_cntct) as cntct_cname, itm.items_iname, prc.price_cname, unt.units_cname
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
      UNION ALL
      SELECT prm.promf_trnno, prm.promf_trdat, prm.promf_cname,
      rpm.prrpm_price, rpm.prrpm_items, rpm.prrpm_units, 0 - rpm.prrpm_rmqty, rpm.prrpm_rmrat
      FROM tmmb_prrpm rpm
      JOIN tmmb_promf prm ON rpm.prrpm_promf = prm.id
      WHERE rpm.prrpm_price = $1
      AND rpm.prrpm_users = $2
      UNION ALL
      SELECT prm.promf_trnno || ', ' || btc.prbtc_batch , prm.promf_trdat, prm.promf_cname,
      btc.prbtc_price, btc.prbtc_items, btc.prbtc_units, btc.prbtc_gdstk, btc.prbtc_fgrat
      FROM tmmb_prbtc btc
      JOIN tmmb_promf prm ON btc.prbtc_promf = prm.id
      WHERE btc.prbtc_price = $1
      AND btc.prbtc_users = $2
      UNION ALL
      SELECT ajm.adjsm_trnno, ajm.adjsm_trdat, ajm.adjsm_ttype,
      ajc.adjsc_price, ajc.adjsc_items, ajc.adjsc_units, 0 - ajc.adjsc_itqty, ajc.adjsc_itrat
      FROM tmib_adjsc ajc
      JOIN tmib_adjsm ajm ON ajc.adjsc_adjsm = ajm.id
      WHERE ajm.adjsm_ttype = 'Adjustment Out'
      AND ajc.adjsc_price = $1
      AND ajm.adjsm_users = $2
      UNION ALL
      SELECT ajm.adjsm_trnno, ajm.adjsm_trdat, ajm.adjsm_ttype,
      ajc.adjsc_price, ajc.adjsc_items, ajc.adjsc_units, ajc.adjsc_itqty, ajc.adjsc_itrat
      FROM tmib_adjsc ajc
      JOIN tmib_adjsm ajm ON ajc.adjsc_adjsm = ajm.id
      WHERE ajm.adjsm_ttype = 'Adjustment In'
      AND ajc.adjsc_price = $1
      AND ajm.adjsm_users = $2
    )stk
    LEFT JOIN tmcb_cntct cnt ON stk.mrrdm_cntct = cnt.id
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

// =====================
// get item price stock fr process
// =====================
router.post("/get-item-price-stock-fr-process", async (req, res) => {
  try {
    const { stock_dpart, stock_price, user_s, user_c, user_b } = req.body;

    if (!stock_dpart || !stock_price || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    const sql = `SELECT stk.id stock_id, stk.stock_batch, stk.stock_cprat, stk.stock_ohqty,
prc.id price_id, prc.price_cname, itm.id items_id, itm.items_runit, unt.units_cname
FROM tmib_stock stk
JOIN tmib_price prc ON stk.stock_price = prc.id
JOIN tmib_items itm ON stk.stock_items = itm.id
JOIN tmib_units unt ON itm.items_runit = unt.id
WHERE stk.stock_dpart = $1
AND stk.stock_price = $2
AND stk.stock_users = $3
AND stk.stock_ohqty > 0
ORDER BY stk.stock_trdat`;

    //ORDER BY mrm.mrrdm_trdat
    const params = [stock_dpart, stock_price, user_c];
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
