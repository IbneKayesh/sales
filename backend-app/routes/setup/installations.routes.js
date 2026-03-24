const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
  try {
    const { ustal_users, ustal_bsins } = req.body;

    // Validate input
    if (!ustal_users || !ustal_bsins) {
      return res.json({
        success: false,
        message: "User ID and Business ID are required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT DISTINCT *
    FROM (
    SELECT istal_scode,istal_sname,istal_level,istal_notes, istal_usrbs, unst.ustal_scode, unst.ustal_crdat
    FROM tmsb_istal inst
    LEFT JOIN tmsb_ustal unst ON inst.istal_scode = unst.ustal_scode
    AND unst.ustal_users = $1
    AND unst.ustal_bsins = $2
    WHERE inst.istal_actve = TRUE
    AND inst.istal_usrbs = 'BUSINESS'
    UNION ALL
    SELECT istal_scode,istal_sname,istal_level,istal_notes, istal_usrbs, unst.ustal_scode, unst.ustal_crdat
    FROM tmsb_istal inst
    LEFT JOIN tmsb_ustal unst ON inst.istal_scode = unst.ustal_scode
    AND unst.ustal_users = $1
    WHERE inst.istal_actve = TRUE
    AND inst.istal_usrbs = 'USER'
  ) setup`;
    const params = [ustal_users, ustal_bsins];

    const rows = await dbGetAll(
      sql,
      params,
      `Get installation data for ${ustal_users}`,
    );
    res.json({
      success: true,
      message: "Installation data fetched successfully",
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
    const { ustal_users, ustal_bsins, ustal_scode, suser_id } = req.body;

    // Validate input
    if (!ustal_users || !ustal_bsins || !ustal_scode || !suser_id) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    const ustalId = uuidv4();

    //database action
    const scripts = [];


    if (ustal_scode === "70203") {
      scripts.push({
        sql: `INSERT INTO tmsb_ucnfg (id, ucnfg_users, ucnfg_bsins, ucnfg_cname, ucnfg_gname, ucnfg_label, ucnfg_value, ucnfg_notes, ucnfg_crusr, ucnfg_upusr)
      SELECT gen_random_uuid(), $1, $2, ucnfg_cname, ucnfg_gname, ucnfg_label, ucnfg_value, ucnfg_notes, $3, $4
      FROM tmsb_ucnfg
      WHERE ucnfg_crusr = 'sgd-data'`,
        params: [ustal_users, ustal_bsins, suser_id, suser_id],
        label: `Created installation for - ${ustal_scode}`,
      });
    }



    //update setup config
    scripts.push({
      sql: `INSERT INTO tmsb_ustal(id, ustal_users, ustal_bsins, ustal_scode,
      ustal_crusr, ustal_upusr)
      VALUES ($1, $2, $3, $4,
      $5, $6)`,
      params: [
        ustalId,
        ustal_users,
        ustal_bsins,
        ustal_scode,
        suser_id,
        suser_id,
      ],
      label: `Created installation for - ${ustal_scode}`,
    });

    await dbRunAll(scripts);

    res.json({
      success: true,
      message: "Installation successfully",
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
