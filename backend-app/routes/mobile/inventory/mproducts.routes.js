const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManager");
const { v4: uuidv4 } = require("uuid");

//get-sales-order-items
router.post("/get-sales-order-items", async (req, res) => {
  try {
    const { bitem_users, bitem_bsins } = req.body;

    // Validate input
    if (!bitem_users || !bitem_bsins) {
      return res.json({
        success: false,
        message: "User, Business ID is required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT itm.items_icode, itm.items_bcode, itm.items_iname, itm.items_sdvat,
    bitm.id, bitm.bitem_items, bitm.bitem_lprat, bitm.bitem_dprat, bitm.bitem_mcmrp,
    bitm.bitem_sddsp, bitm.bitem_gstkq, bitm.bitem_istkq,
    bitm.bitem_lprat bitem_csrat, '{}' AS bitem_attrb, '-' AS bitem_srcnm,
    '-' AS bitem_refid, 'Inventory Stock' AS bitem_refno, 
    0 bitem_ohqty,
puofm.iuofm_untnm as puofm_untnm,
itm.items_dfqty,
suofm.iuofm_untnm as suofm_untnm
FROM tmib_items itm
JOIN tmib_bitem bitm ON itm.id = bitm.bitem_items
LEFT JOIN tmib_iuofm puofm ON itm.items_puofm = puofm.id
LEFT JOIN tmib_iuofm suofm ON itm.items_suofm = suofm.id
WHERE itm.items_trcks = 0
AND itm.items_users = ?
AND bitm.bitem_bsins = ?`;
    const params = [bitem_users, bitem_bsins];

    const rows = await dbGetAll(
      sql,
      params,
      `Get sales items for ${bitem_bsins}`,
    );

    res.json({
      success: true,
      message: "Sales items fetched successfully",
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
