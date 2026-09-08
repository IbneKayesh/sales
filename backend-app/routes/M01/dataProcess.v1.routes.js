const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");
const { GenNewCode } = require("../../db/genHelper");

// avg-product-cost
router.post("/avg-product-cost", async (req, res) => {
  try {
    const { dpart_id, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!dpart_id || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const scripts = [];
    const params = [user_s, user_c, user_b, dpart_id];
    scripts.push({
      sql: `CALL prc_price_avrat($1,$2,$3,$4)`,
      params: params,
      label: `update AVG price- ${user_c}`,
    });

    await dbRunAll(scripts);
    res.json({
      success: true,
      message: `Process created successfully.`,
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

// sub-ledger-current-balance
router.post("/sub-ledger-current-balance", async (req, res) => {
  try {
    const { dpart_id, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!dpart_id || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const scripts = [];
    const params = [user_s, user_c, user_b, dpart_id];

    scripts.push({
      sql: `CALL prc_jrnlm_drcr($1,$2,$3,$4)`,
      params: params,
      label: `update DR/CR journal- ${user_c}`,
    });

    await dbRunAll(scripts);
    res.json({
      success: true,
      message: `Process created successfully.`,
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

module.exports = router;
