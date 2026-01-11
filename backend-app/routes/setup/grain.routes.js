const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManager");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
  try {
    const { users_users } = req.body;

    // Validate input
    if (!users_users) {
      return res.json({
        success: false,
        message: "User ID is required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT usr.*, 0 as edit_stop
      FROM tmsb_crgrn usr
      WHERE usr.crgrn_users = ?
      ORDER BY usr.crgrn_tbltx`;
    const params = [users_users];

    const rows = await dbGetAll(sql, params, `Get grain for ${users_users}`);
    res.json({
      success: true,
      message: "Grain fetched successfully",
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


// generate
router.post("/generate", async (req, res) => {
  try {
    const { id } = req.body;

    // Validate input
    if (!id) {
      return res.json({
        success: false,
        message: "User ID is required",
        data: null,
      });
    }

    //database action
    const sql = `INSERT tmsb_crgrn (id, crgrn_users, crgrn_bsins, crgrn_tblnm, crgrn_tbltx,
                   crgrn_dbgrn, crgrn_crusr, crgrn_upusr)
SELECT UUID() as id, bsins_users as crgrn_users, id as crgrn_bsins, 'tmab_bsins' as crgrn_tblnm, 'Business' as crgrn_tbltx,
COUNT(*) AS crgrn_dbgrn, 'sys' as crgrn_crusr, 'sys' as crgrn_upusr
FROM tmab_bsins
WHERE bsins_updat >= CURDATE()
  AND bsins_updat < CURDATE() + INTERVAL 1 DAY
GROUP BY  bsins_users,id`;
    const params = [id];

    await dbRun(sql, params, `Generate grain for ${id}`);
    res.json({
      success: true,
      message: "Grain generated successfully",
      data: null,
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