const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManager");
const { v4: uuidv4 } = require("uuid");

// purchase-booking
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


//purchase-receipt
router.post("/purchase-receipt", async (req, res) => {
  try {
    const { mrcpt_bsins } = req.body;

    // Validate input
    if (!mrcpt_bsins) {
      return res.json({
        success: false,
        message: "Business ID is required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT cnt.cntct_cntnm, mrcpt.mrcpt_trnno, itm.items_icode, itm.items_iname, itm.items_dfqty,
rcpt.crcpt_attrb,rcpt.crcpt_itqty,rcpt.crcpt_itamt,rcpt.crcpt_rtqty,rcpt.crcpt_slqty,rcpt.crcpt_ohqty,
puofm.iuofm_untnm as puofm_untnm, suofm.iuofm_untnm as suofm_untnm
FROM tmpb_mrcpt mrcpt
JOIN tmpb_crcpt rcpt ON mrcpt.id = rcpt.crcpt_mrcpt
JOIN tmib_items itm ON rcpt.crcpt_items = itm.id AND itm.items_trcks = 1
JOIN tmcb_cntct cnt ON mrcpt.mrcpt_cntct = cnt.id
LEFT JOIN tmib_iuofm puofm ON itm.items_puofm = puofm.id
LEFT JOIN tmib_iuofm suofm ON itm.items_suofm = suofm.id
WHERE mrcpt.mrcpt_bsins = ?
AND rcpt.crcpt_ohqty > 0
ORDER BY itm.items_iname`;
    const params = [mrcpt_bsins];

    const rows = await dbGetAll(
      sql,
      params,
      `Get stock report for ${mrcpt_bsins}`,
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



//purchase-invoice
router.post("/purchase-invoice", async (req, res) => {
  try {
    const { mrcpt_bsins } = req.body;

    // Validate input
    if (!mrcpt_bsins) {
      return res.json({
        success: false,
        message: "Business ID is required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT cnt.cntct_cntnm, minv.minvc_trnno, itm.items_icode, itm.items_iname, itm.items_dfqty,
cinv.cinvc_attrb,cinv.cinvc_itqty,cinv.cinvc_itamt,cinv.cinvc_rtqty,cinv.cinvc_slqty,cinv.cinvc_ohqty,
puofm.iuofm_untnm as puofm_untnm, suofm.iuofm_untnm as suofm_untnm
FROM tmpb_minvc minv
JOIN tmpb_cinvc cinv ON minv.id = cinv.cinvc_minvc
JOIN tmib_items itm ON cinv.cinvc_items = itm.id AND itm.items_trcks = 1
JOIN tmcb_cntct cnt ON minv.minvc_cntct = cnt.id
LEFT JOIN tmib_iuofm puofm ON itm.items_puofm = puofm.id
LEFT JOIN tmib_iuofm suofm ON itm.items_suofm = suofm.id
WHERE minv.minvc_bsins = ?
AND cinv.cinvc_ohqty > 0
ORDER BY itm.items_iname`;
    const params = [mrcpt_bsins];

    const rows = await dbGetAll(
      sql,
      params,
      `Get stock report for ${mrcpt_bsins}`,
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


//inventory-transfer
router.post("/inventory-transfer", async (req, res) => {
  try {
    const { mtrsf_bsins } = req.body;

    // Validate input
    if (!mtrsf_bsins) {
      return res.json({
        success: false,
        message: "Business ID is required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT bsn.bsins_bname, mts.mtrsf_trnno, itm.items_icode, itm.items_iname, itm.items_dfqty,
cts.ctrsf_attrb,cts.ctrsf_itqty,cts.ctrsf_itamt,cts.ctrsf_rtqty,cts.ctrsf_slqty,cts.ctrsf_ohqty,
puofm.iuofm_untnm as puofm_untnm, suofm.iuofm_untnm as suofm_untnm
FROM tmib_mtrsf mts
JOIN tmib_ctrsf cts ON mts.id = cts.ctrsf_mtrsf
JOIN tmib_items itm ON cts.ctrsf_items = itm.id AND itm.items_trcks = 1
JOIN tmsb_bsins bsn ON mts.mtrsf_bsins_to = bsn.id
LEFT JOIN tmib_iuofm puofm ON itm.items_puofm = puofm.id
LEFT JOIN tmib_iuofm suofm ON itm.items_suofm = suofm.id
WHERE mts.mtrsf_bsins_to = ?
AND cts.ctrsf_ohqty > 0
ORDER BY itm.items_iname`;
    const params = [mtrsf_bsins];

    const rows = await dbGetAll(
      sql,
      params,
      `Get stock report for ${mtrsf_bsins}`,
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
