const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
  try {
    const { user_s, user_c, user_b } = req.body;

    // Validate input
    if (!user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: null,
      });
    }

    //database action
    const sql = `SELECT cnt.*, 0 as edit_stop,
    ta.tarea_tname, dz.dzone_dname
    FROM tmrb_cntct cnt
    LEFT JOIN tmcb_tarea ta ON ta.id = cnt.cntct_tarea
    LEFT JOIN tmcb_dzone dz ON dz.id = cnt.cntct_dzone
    WHERE cnt.cntct_apusr = $1
    ORDER BY cnt.cntct_cntnm`;
    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get contacts- ${user_c}`);
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
      data: null,
    });
  }
});

module.exports = router;
