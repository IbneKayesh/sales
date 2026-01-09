const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManager");
const { v4: uuidv4 } = require("uuid");



// generate
router.post("/accounts-ledger", async (req, res) => {
  try {
    const { user_id } = req.body;

    // Validate input
    if (!user_id) {
      return res.json({
        success: false,
        message: "User ID is required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmtb_bacts AS b
      JOIN (
          SELECT 
              ledgr_bacts  AS id,
              ledgr_users  AS bacts_users,
              SUM(ledgr_cramt - ledgr_dbamt) AS bacts_crbln
          FROM tmtb_ledgr
          WHERE ledgr_users = ?
          GROUP BY ledgr_bacts, ledgr_users
      ) AS bl
        ON bl.id = b.id
      AND bl.bacts_users = b.bacts_users
      SET b.bacts_crbln = bl.bacts_crbln`;
    const params = [user_id];
    await dbRun(sql, params, `Account balance generated for ${user_id}`);
    res.json({
      success: true,
      message: "Account balance generated successfully",
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
