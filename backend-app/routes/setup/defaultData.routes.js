const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
  try {
    const { ucnfg_users, ucnfg_bsins } = req.body;

    // Validate input
    if (!ucnfg_users || !ucnfg_bsins) {
      return res.json({
        success: false,
        message: "User ID and Business ID are required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT id, ucnfg_users, ucnfg_bsins, ucnfg_cname, ucnfg_gname, ucnfg_label, ucnfg_value, ucnfg_notes
    FROM tmsb_ucnfg
    WHERE ucnfg_users = $1
    AND ucnfg_bsins = $2
    ORDER BY ucnfg_cname, ucnfg_gname, ucnfg_label `;
    const params = [ucnfg_users, ucnfg_bsins];

    const rows = await dbGetAll(sql, params, `Get default data for ${ucnfg_users} and ${ucnfg_bsins}`);
    res.json({
      success: true,
      message: "Default data fetched successfully",
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


// update
router.post("/update", async (req, res) => {
  try {
    const {
      id,
      ucnfg_users,
      ucnfg_bsins,
      ucnfg_cname,
      ucnfg_gname,
      ucnfg_label,
      ucnfg_value,
      user_id,
    } = req.body;

    // Validate input
    if (
      !id ||
      !ucnfg_users ||
      !ucnfg_bsins ||
      !ucnfg_cname ||
      !ucnfg_gname ||
      !ucnfg_label ||
      !ucnfg_value
    ) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      }); 
    }

    //database action
    const sql = `UPDATE tmsb_ucnfg
    SET ucnfg_value = $1,
    ucnfg_upusr = $2,
    ucnfg_rvnmr = ucnfg_rvnmr + 1
    WHERE id = $3
    AND ucnfg_users = $4
    AND ucnfg_bsins = $5
    AND ucnfg_cname = $6
    AND ucnfg_gname = $7
    AND ucnfg_label = $8`;
    const params = [
      ucnfg_value,
      user_id,
      id,
      ucnfg_users,
      ucnfg_bsins,
      ucnfg_cname,
      ucnfg_gname,
      ucnfg_label,
    ];

    await dbRun(sql, params, `Update default data for ${ucnfg_users} and ${ucnfg_bsins}`);
    res.json({
      success: true,
      message: "Default data updated successfully",
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
