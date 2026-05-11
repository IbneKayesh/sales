const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");
const { GenNewCode } = require("../../db/genHelper");


// get-trial-balance
router.post("/get-trial-balance", async (req, res) => {
  try {
    const { user_s, user_c, user_b } = req.body;

    // Validate input
    if (!user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT cht.chtac_ctype, cht.chtac_cname,
    SUM(djr.djrnl_drval)dr, SUM(djr.djrnl_crval)cr
    from tmtb_djrnl djr
    JOIN tmtb_chtac cht ON djr.djrnl_chtac = cht.id
    WHERE djr.djrnl_apusr = $1
    GROUP BY cht.chtac_ctype, cht.chtac_cname
    ORDER BY cht.chtac_ctype, cht.chtac_cname`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get trial balance- ${user_c}`);
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
      data: [],
    });
  }
});


module.exports = router;
