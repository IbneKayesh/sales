const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../../db/sqlManager");
const { v4: uuidv4 } = require("uuid");

//get-by-outlet
router.post("/get-by-outlet", async (req, res) => {
  try {
    const { cnrut_cntct, cnrut_users, cnrut_bsins } = req.body;

    // Validate input
    if (!cnrut_cntct || !cnrut_users || !cnrut_bsins) {
      return res.json({
        success: false,
        message: "User ID and Business ID are required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT rtr.rutes_rname, rtr.rutes_dname, emp.emply_ecode, emp.emply_ename,
trt.cnrut_srlno, trt.cnrut_lvdat
FROM tmcb_cntrt trt
LEFT JOIN tmcb_rutes rtr ON trt.cnrut_rutes = rtr.id
LEFT JOIN tmhb_emply emp ON trt.cnrut_empid = emp.id
WHERE trt.cnrut_cntct = ?
AND trt.cnrut_users = ?
AND trt.cnrut_bsins = ?
LIMIT 0, 25`;
    const params = [cnrut_cntct, cnrut_users, cnrut_bsins];

    const rows = await dbGetAll(sql, params, `Get route for ${cnrut_cntct}`);
    res.json({
      success: true,
      message: "Route fetched successfully",
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
