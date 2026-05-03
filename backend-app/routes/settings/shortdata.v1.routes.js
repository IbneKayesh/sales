const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");

// get
router.post("/", async (req, res) => {
  try {
    const { shtbl_gname, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: null,
      });
    }

    //database action
    const sql = `SELECT shtbl_dtext AS label_text, shtbl_value as value_text, shtbl_dvalu as default_value
    FROM tmcb_shtbl
    WHERE shtbl_apusr= $1
    AND shtbl_gname = $2
    AND shtbl_actve = TRUE
    ORDER BY shtbl_dtext`;

    const params = [user_c, shtbl_gname];
    const rows = await dbGetAll(sql, params, `get short data- ${user_c}`);
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
