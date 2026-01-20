const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManager");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
  try {
    // Validate input
    //database action
    const sql = `SELECT bsn.bsins_bname, bsn.bsins_addrs, bsn.bsins_btags, bsn.bsins_cntry, bsn.bsins_stdat, usr.users_oname
    FROM tmab_bsins bsn
    JOIN tmab_users usr ON bsn.bsins_users = usr.id
    WHERE bsn.bsins_pbviw = 1
    ORDER BY bsn.bsins_crdat DESC`;
    const params = [];

    const rows = await dbGetAll(sql, params, `Get business for public view`);
    res.json({
      success: true,
      message: "Public Business fetched successfully",
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
