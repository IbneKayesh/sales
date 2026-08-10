const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");
const { GenNewCode } = require("../../db/genHelper");

// update
router.post("/update", async (req, res) => {
  try {
    const { id, tabcl_visbu, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!id || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `UPDATE tmsb_tabcl
    SET tabcl_visbu = $1,
    tabcl_upusr = $2,
    tabcl_updat = CURRENT_TIMESTAMP,
    tabcl_rvnmr = tabcl_rvnmr + 1
    WHERE id = $3`;
    const params = [tabcl_visbu, user_s, id];
    await dbRun(sql, params, `update tab columns- ${user_c}`);
    res.json({
      success: true,
      message: `Column visibilty updated successfully.`,
      data: {},
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

// /get-by-page
router.post("/get-by-page", async (req, res) => {
  try {
    const { tabcl_cname, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!tabcl_cname || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT *
    FROM tmsb_tabcl
    WHERE tabcl_actve = TRUE
    AND tabcl_users = $1
    AND tabcl_cname = $2
    ORDER BY tabcl_cname, tabcl_colmn`;

    const params = [user_c, tabcl_cname];
    const rows = await dbGetAll(sql, params, `get table columns- ${user_c}`);
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

// get-by-table
router.post("/get-by-table", async (req, res) => {
  try {
    const { tabcl_table, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!tabcl_table || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT *
    FROM tmsb_tabcl
    WHERE tabcl_actve = TRUE
    AND tabcl_users = $1
    AND tabcl_table = $2
    ORDER BY tabcl_table, tabcl_colmn`;

    const params = [user_c, tabcl_table];
    const rows = await dbGetAll(sql, params, `get table columns- ${user_c}`);
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
