const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");

//get all
router.post("/", async (req, res) => {
  try {
    const { dlvan_users, dlvan_bsins } = req.body;

    // Validate input
    if (!dlvan_users || !dlvan_bsins) {
      return res.json({
        success: false,
        message: "User ID and Business ID are required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT dvn.*, 0 as edit_stop
    FROM tmcb_dlvan dvn
    WHERE dvn.dlvan_users = $1
    AND dvn.dlvan_bsins = $2
    ORDER BY dvn.dlvan_vname`;
    const params = [dlvan_users, dlvan_bsins];

    const rows = await dbGetAll(sql, params, `Get delivery vans for ${dlvan_users} and ${dlvan_bsins}`);
    res.json({
      success: true,
      message: "Delivery vans fetched successfully",
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

// create
router.post("/create", async (req, res) => {
  try {
    const {
      id,
      dlvan_users,
      dlvan_bsins,
      dlvan_vname,
      dlvan_dname,
      user_id,
    } = req.body;

    // Validate input
    if (
      !id ||
      !dlvan_users ||
      !dlvan_bsins
    ) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      }); 
    }

    //database action
    const sql = `INSERT INTO tmcb_dlvan
    (id,dlvan_users,dlvan_bsins,dlvan_vname,dlvan_dname,dlvan_crusr,dlvan_upusr)
    VALUES ($1,$2,$3,$4,$5,$6,$7)`;
    const params = [
      id,
      dlvan_users,
      dlvan_bsins,
      dlvan_vname,
      dlvan_dname,
      user_id,
      user_id,
    ];

    await dbRun(sql, params, `Create delivery van for ${dlvan_bsins}`);
    res.json({
      success: true,
      message: "Delivery van created successfully",
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

// update
router.post("/update", async (req, res) => {
  try {
    const {
      id,
      dlvan_users,
      dlvan_bsins,
      dlvan_vname,
      dlvan_dname,
      user_id,
    } = req.body;

    // Validate input
    if (
      !id ||
      !dlvan_users ||
      !dlvan_bsins
    ) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      }); 
    }

    //database action
    const sql = `UPDATE tmcb_dlvan
    SET dlvan_vname = $1,
    dlvan_dname = $2,
    dlvan_upusr = $3,
    dlvan_updat = CURRENT_TIMESTAMP,
    dlvan_rvnmr = dlvan_rvnmr + 1
    WHERE id = $4`;
    const params = [
      dlvan_vname,
      dlvan_dname,
      user_id,
      id,
    ];

    await dbRun(sql, params, `Update delivery van for ${dlvan_bsins}`);
    res.json({
      success: true,
      message: "Delivery van updated successfully",
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

// delete
router.post("/delete", async (req, res) => {
  try {
    const { id, dlvan_bsins} = req.body;

    // Validate input
    if (!id) {
      return res.json({
        success: false,
        message: "Unit ID is required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmcb_dlvan
    SET dlvan_actve = NOT dlvan_actve,
    dlvan_upusr = $1,
    dlvan_updat = CURRENT_TIMESTAMP,
    dlvan_rvnmr = dlvan_rvnmr + 1
    WHERE id = $2`;

    const params = [id];

    await dbRun(sql, params, `Delete delivery van for ${dlvan_bsins}`);
    res.json({
      success: true,
      message: "Delivery van deleted successfully",
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
