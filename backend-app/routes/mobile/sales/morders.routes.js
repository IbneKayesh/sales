const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../../db/sqlManager");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
  try {
    const { emply_users, emply_bsins, user_id, fodrm_trdat} = req.body;

    // Validate input
    if (!emply_users || !emply_bsins || !user_id || !fodrm_trdat) {
      return res.json({
        success: false,
        message: "Staff ID and Day Name are required",
        data: null,
      });
    }
    //console.log("get:", JSON.stringify(req.body));

    const dayName = new Date(fodrm_trdat).toLocaleDateString('en-US', { weekday: 'long' });

    //database action
    let sql = `SELECT cnt.id, cnt.cntct_cntnm, rts.rutes_rname, trt.cnrut_lvdat, trt.cnrut_srlno, rts.rutes_dname, 0 AS fodrm_odamt, 'Pending' AS fodrm_stats
FROM tmcb_cntrt trt
JOIN tmcb_cntct cnt ON trt.cnrut_cntct = cnt.id
JOIN tmcb_rutes rts ON trt.cnrut_rutes = rts.id
WHERE trt.cnrut_actve = 1
AND rts.rutes_users = ?
AND rts.rutes_bsins = ?
AND trt.cnrut_empid = ?
AND rts.rutes_dname = ?
ORDER BY trt.cnrut_srlno`;
    let params = [emply_users, emply_bsins, user_id, dayName];
    //console.log("params: ", params);

    const rows = await dbGetAll(
      sql,
      params,
      `Get orders for ${emply_users} and ${dayName}`,
    );
    res.json({
      success: true,
      message: "Orders fetched successfully",
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
