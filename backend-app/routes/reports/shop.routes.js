const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManager");
const { v4: uuidv4 } = require("uuid");

// summary
router.post("/summary", async (req, res) => {
  try {
    const { trnsc_users, trnsc_bsins, trsrt_trdat, trend_trdat } = req.body;

    // Validate input
    if (!trnsc_users || !trnsc_bsins || !trsrt_trdat || !trend_trdat) {
      return res.json({
        success: false,
        message: "User ID, Business ID, Start date and end date are required",
        data: null,
      });
    }
    //console.log("get:", JSON.stringify(req.body));

    //database action
    const sql = `SELECT 
    paybl_srcnm, 
    SUM(paybl_dbamt) AS paybl_dbamt, 
    SUM(paybl_cramt) AS paybl_cramt
FROM tmtb_paybl
WHERE paybl_trdat >= ?
  AND paybl_trdat <= ?
GROUP BY paybl_srcnm
UNION ALL
SELECT 
    rcvbl_srcnm, 
    SUM(rcvbl_dbamt) AS rcvbl_dbamt, 
    SUM(rcvbl_cramt) AS rcvbl_cramt
FROM tmtb_rcvbl
WHERE rcvbl_trdat >= ?
  AND rcvbl_trdat <= ?
GROUP BY rcvbl_srcnm`;

    // Ensure we cover the full range of the selected days
    const params = [
      `${trsrt_trdat} 00:00:00`,
      `${trend_trdat} 23:59:59`,
      `${trsrt_trdat} 00:00:00`,
      `${trend_trdat} 23:59:59`,
    ];

    const rows = await dbGetAll(
      sql,
      params,
      `Get dashboard for ${trnsc_users}`,
    );
    res.json({
      success: true,
      message: "Dashboard fetched successfully",
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
