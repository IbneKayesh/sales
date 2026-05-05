const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");

// get
router.post("/get-all-active", async (req, res) => {
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
    const sql = `SELECT bsn.*,
    csr.users_uname AS crusr_cname, usr.users_uname AS upusr_cname, 0 as edit_stop
    FROM tmnb_bsins bsn
    LEFT JOIN tmnb_users csr ON bsn.bsins_crusr = csr.id
    LEFT JOIN tmnb_users usr ON bsn.bsins_upusr = usr.id
    WHERE bsn.bsins_actve = TRUE
    AND bsn.bsins_apusr = $1`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get business- ${user_c}`);
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
