const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");

const SYS_RPT_PENDING_MRR = async (req, res) => {
  try {
    const { user_s, user_c, user_b } = req.body;

    // Validate input
    if (!user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    //apply logic
    const sql = `SELECT cnt.cntct_cname supplier_name, pom.pordm_trnno po_no, TO_CHAR(pom.pordm_trdat,'YYYY-MM-DD') po_date,
      itm.items_iname item_name, prc.price_cname price_name, poc.pordc_itrat po_rate, poc.pordc_itqty po_qty, poc.pordc_itamt po_amt, poc.pordc_mrqty mrr_qty,
      poc.pordc_itqty - poc.pordc_mrqty pending_mrr_qty, poc.pordc_itrat * (poc.pordc_itqty - poc.pordc_mrqty) pending_mrr_amount
      FROM tmpb_pordc poc
      JOIN tmpb_pordm pom ON poc.pordc_pordm = pom.id 
      JOIN tmib_items itm ON poc.pordc_items = itm.id
      JOIN tmib_price prc ON poc.pordc_price = prc.id
                      AND itm.id = prc.price_items
      JOIN tmib_units runit ON poc.pordc_units = runit.id
      JOIN tmib_units punit ON itm.items_punit = punit.id
      JOIN tmib_units sunit ON itm.items_sunit = sunit.id
      JOIN tmib_sgrup sgrup ON itm.items_sgrup = sgrup.id
      JOIN tmib_scatg scatg ON itm.items_scatg = scatg.id
      JOIN tmib_brand brand ON itm.items_brand = brand.id
      JOIN tmcb_cntct cnt ON pom.pordm_cntct = cnt.id
      WHERE poc.pordc_itqty > poc.pordc_mrqty
      AND pom.pordm_users = $1`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get pending mrr - ${user_c}`);
    res.json({
      success: true,
      message: "Query executed successfully.",
      data: rows,
    });
  } catch (error) {
    console.error("database action error:", error);
    return res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: [],
    });
  }
};

router.post("/standard", async (req, res) => {
  const { rpt_name } = req.body;
  if (rpt_name === "SYS_RPT_PENDING_MRR") {
    return SYS_RPT_PENDING_MRR(req, res);
  } else {
    return res.json({
      success: false,
      message: "Invalid Report Name.",
      data: [],
    });
  }
});

module.exports = router;
