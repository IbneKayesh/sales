const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");

// dashboard
router.post("/dashboard", async (req, res) => {
  try {
    //console.log("get:", JSON.stringify(req.body));

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
    const sql = `SELECT COUNT(minvc.id) AS id,
SUM(minvc.minvc_odamt) AS odamt, SUM(minvc.minvc_dsamt) AS dsamt,
SUM(minvc.minvc_vtamt) AS vtamt, SUM(minvc.minvc_incst) AS incst,
SUM(minvc.minvc_excst) AS excst, SUM(minvc.minvc_rnamt) AS rnamt, 
SUM(minvc.minvc_ttamt) AS ttamt, SUM(minvc.minvc_pyamt) AS pyamt,
SUM(minvc.minvc_pdamt) AS pdamt, SUM(minvc.minvc_duamt) AS duamt
FROM public.tmpb_minvc minvc
WHERE minvc.minvc_users = $1
AND minvc.minvc_bsins = $2
AND minvc.minvc_trdat >= $3 AND minvc.minvc_trdat <= $4`;

    // Ensure we cover the full range of the selected days
    const params = [
      trnsc_users,
      trnsc_bsins,
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
