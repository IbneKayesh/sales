const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManager");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
  try {
    const { attrb_users } = req.body;

    // Validate input
    if (!attrb_users) {
      return res.json({
        success: false,
        message: "User ID is required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT atb.*, 0 as edit_stop
      FROM tmib_attrb atb
      WHERE atb.attrb_users = ?
      ORDER BY atb.attrb_aname`;
    const params = [attrb_users];

    const rows = await dbGetAll(
      sql,
      params,
      `Get attributes for ${attrb_users}`,
    );
    res.json({
      success: true,
      message: "Attributes fetched successfully",
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

module.exports = router;
