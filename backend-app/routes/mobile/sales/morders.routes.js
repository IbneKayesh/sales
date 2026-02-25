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
    const dateObj = new Date(fodrm_trdat);
    const formattedDate =
    dateObj.getFullYear() +
    "-" +
    String(dateObj.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(dateObj.getDate()).padStart(2, "0");

    //database action
    let sql = `SELECT cnt.id, cnt.cntct_cntnm, rts.rutes_rname, trt.cnrut_lvdat, trt.cnrut_srlno, rts.rutes_dname,
    SUM(IFNULL(ord.fodrm_dlamt, 0)) AS fodrm_odamt,
    CASE
    WHEN ord.fodrm_isdlv IS NULL THEN 'Pending'
    WHEN ord.fodrm_isdlv = 0 THEN 'Ordered'
    WHEN ord.fodrm_isdlv = 1 THEN 'Delivered'
    ELSE 'Cancelled'
    END AS fodrm_stats
FROM tmcb_cntrt trt
JOIN tmcb_cntct cnt ON trt.cnrut_cntct = cnt.id
JOIN tmcb_rutes rts ON trt.cnrut_rutes = rts.id
LEFT JOIN toeb_fodrm ord ON trt.cnrut_cntct = ord.fodrm_cntct AND DATE(ord.fodrm_trdat) = ?
WHERE trt.cnrut_actve = 1
AND rts.rutes_users = ?
AND rts.rutes_bsins = ?
AND trt.cnrut_empid = ?
AND rts.rutes_dname = ?
GROUP BY cnt.id, cnt.cntct_cntnm, rts.rutes_rname, trt.cnrut_lvdat, trt.cnrut_srlno, rts.rutes_dname
ORDER BY trt.cnrut_srlno`;
    let params = [formattedDate, emply_users, emply_bsins, user_id, dayName];
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


// get outlet orders
router.post("/get-outlet-orders", async (req, res) => {
  try {
    const { fodrm_cntct, fodrm_users, fodrm_bsins} = req.body;

    // Validate input
    if (!fodrm_cntct || !fodrm_users || !fodrm_bsins) {
      return res.json({
        success: false,
        message: "Outlet ID, User ID and Business ID are required",
        data: null,
      });
    }
    //console.log("get:", JSON.stringify(req.body));
    
    //database action
    let sql = `SELECT id, fodrm_users, fodrm_bsins, fodrm_cntct, fodrm_empid, fodrm_rutes, fodrm_trnno, fodrm_trdat, fodrm_trnte, fodrm_odamt, fodrm_dlamt, fodrm_dsamt, fodrm_vtamt, fodrm_rnamt, fodrm_ttamt, fodrm_pyamt, fodrm_pdamt, fodrm_duamt, fodrm_ispad, fodrm_ispst, fodrm_iscls, fodrm_vatcl, fodrm_isdlv, fodrm_oshpm
    FROM toeb_fodrm
    WHERE fodrm_cntct = ?
    AND fodrm_users = ?
    AND fodrm_bsins = ?
    ORDER BY fodrm_trdat DESC`;
    let params = [fodrm_cntct, fodrm_users, fodrm_bsins];
    //console.log("params: ", params);

    const rows = await dbGetAll(
      sql,
      params,
      `Get orders for ${fodrm_users} and ${fodrm_cntct}`,
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
