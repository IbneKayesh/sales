const express = require("express");
const router = express.Router();
const { dbGetAll, dbRun } = require("../../db/sqlManagerpg");

// =====================
// Get All
// =====================
router.post("/available", async (req, res) => {
  try {
    const { user_s, user_c, user_b } = req.body;

    if (!user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    const sql = `SELECT *
            FROM tmib_price prc
            WHERE (prc.price_gdstk > 0
            OR prc.price_bdstk > 0)
            AND prc.price_users = $1`;

    const params = [user_c];
    const rows = await dbGetAll(sql,params, `Get stock - ${user_c}`);

    res.json({
      success: true,
      message: "Query executed successfully.",
      data: rows,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: [],
    });
  }
});

module.exports = router;
