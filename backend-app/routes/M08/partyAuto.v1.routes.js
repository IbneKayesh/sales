const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");
const { GenNewCode } = require("../../db/genHelper");

// get all
router.post("/", async (req, res) => {
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
    const sql = `SELECT ptya.*, cht.chtac_cname, cht.chtac_ctype, cht.chtac_chtno, cht.chtac_ntype,
    csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 as edit_stop
    FROM tmtb_prtya ptya
    JOIN tmtb_chtac cht ON ptya.prtya_chtac = cht.chtac_chtno::text
    LEFT JOIN tmhb_emply csr ON ptya.prtya_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON ptya.prtya_upusr = usr.id
    WHERE ptya.prtya_users = $1
    ORDER BY ptya.prtya_sorce ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get party auto- ${user_c}`);
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
