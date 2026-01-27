const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManager");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/purchase-booking", async (req, res) => {
  try {
    const { mbkng_bsins } = req.body;

    // Validate input
    if (!mbkng_bsins) {
      return res.json({
        success: false,
        message: "Business ID is required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT cnt.cntct_cntnm, mbkg.mbkng_trnno, itm.items_icode, itm.items_iname, itm.items_dfqty,
cbkg.cbkng_attrb,cbkg.cbkng_itqty,cbkg.cbkng_itamt,cbkg.cbkng_cnqty,cbkg.cbkng_rcqty,cbkg.cbkng_pnqty,
puofm.iuofm_untnm as puofm_untnm, suofm.iuofm_untnm as suofm_untnm
FROM tmpb_mbkng mbkg
JOIN tmpb_cbkng cbkg ON mbkg.id = cbkg.cbkng_mbkng
JOIN tmib_items itm ON cbkg.cbkng_items = itm.id
JOIN tmcb_cntct cnt ON mbkg.mbkng_cntct = cnt.id
LEFT JOIN tmib_iuofm puofm ON itm.items_puofm = puofm.id
LEFT JOIN tmib_iuofm suofm ON itm.items_suofm = suofm.id
WHERE mbkg.mbkng_bsins = ?
AND cbkg.cbkng_pnqty > 0
ORDER BY itm.items_iname`;
    const params = [mbkng_bsins];

    const rows = await dbGetAll(
      sql,
      params,
      `Get stock report for ${mbkng_bsins}`,
    );
    res.json({
      success: true,
      message: "Stock report fetched successfully",
      data: rows,
    });
  } catch (error) {
    console.error("database action error:", error);
    return res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: null,
    });
  }
});

module.exports = router;
