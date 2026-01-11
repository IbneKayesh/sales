const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManager");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
  try {
    const { trhed_users } = req.body;

    // Validate input
    if (!trhed_users) {
      return res.json({
        success: false,
        message: "User ID is required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT acts.*, 0 as edit_stop
      FROM tmtb_trhed acts
      WHERE acts.trhed_users = ?
      ORDER BY acts.trhed_grpnm, acts.trhed_grtyp`;
    const params = [trhed_users];

    const rows = await dbGetAll(sql, params, `Get account heads for ${trhed_users}`);
    res.json({
      success: true,
      message: "Account heads fetched successfully",
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

// delete
router.post("/delete", async (req, res) => {
  try {
    const { id, trhed_hednm } = req.body;

    // Validate input
    if (!id) {
      return res.json({
        success: false,
        message: "Account ID is required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmtb_trhed
    SET trhed_actve = 1 - trhed_actve
    WHERE id = ?`;
    const params = [id];

    await dbRun(sql, params, `Delete account head for ${trhed_hednm}`);
    res.json({
      success: true,
      message: "Account head deleted successfully",
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
