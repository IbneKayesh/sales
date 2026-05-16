const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");

// upda

//get-by-type
router.post("/get-by-type", async (req, res) => {
  try {
    const { muser_id, cntct_ctype } = req.body;

    // Validate input
    if (!muser_id || !cntct_ctype) {
      return res.json({
        success: false,
        message: "User ID and Contact Type are required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT cnt.*, 0 as edit_stop
    FROM tmcb_cntct cnt
    WHERE cnt.cntct_users = $1
    AND cnt.cntct_ctype = $2
    ORDER BY cnt.cntct_cntnm`;
    const params = [muser_id, cntct_ctype];

    const rows = await dbGetAll(sql, params, `Get contacts for ${cntct_ctype}`);
    res.json({
      success: true,
      message: "Contacts fetched successfully",
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

// get all
router.post("/ledger", async (req, res) => {
  try {
    const { muser_id, bsins_id, paybl_cntct } = req.body;
    //console.log("req.body ", req.body);

    // Validate input
    if (!muser_id || !bsins_id || !paybl_cntct) {
      return res.json({
        success: false,
        message: "User, Business, Contact are required",
        data: null,
      });
    }

    //database action
    const sql = `
          SELECT paybl_pymod AS pymod, paybl_refno AS refno, paybl_srcnm AS srcnm, paybl_trdat AS trdat,
          paybl_descr AS descr, paybl_notes AS notes, paybl_dbamt AS dbamt, paybl_cramt AS cramt
          FROM (
          SELECT paybl_pymod, paybl_refno, paybl_srcnm, paybl_trdat, paybl_descr, paybl_notes, paybl_dbamt, paybl_cramt
          FROM tmtb_paybl
          WHERE paybl_users = $1
          AND paybl_bsins = $2
          AND paybl_cntct = $3
          UNION ALL
          SELECT rcvbl_pymod, rcvbl_refno, rcvbl_srcnm, rcvbl_trdat, rcvbl_descr, rcvbl_notes, rcvbl_dbamt, rcvbl_cramt
          FROM tmtb_rcvbl
          WHERE rcvbl_users = $1
          AND rcvbl_bsins = $2
          AND rcvbl_cntct = $3
          ) AS ledger
          ORDER BY paybl_trdat DESC, paybl_refno`;
    const params = [muser_id, bsins_id, paybl_cntct];

    const rows = await dbGetAll(sql, params, `Get ledgers for ${paybl_cntct}`);
    res.json({
      success: true,
      message: "Ledgers fetched successfully",
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


//customers
router.post("/customers", async (req, res) => {
  try {
    const { muser_id } = req.body;

    // Validate input
    if (!muser_id) {
      return res.json({
        success: false,
        message: "User ID is required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT cnt.*, 0 as edit_stop
    FROM tmcb_cntct cnt
    WHERE cnt.cntct_users = $1
    AND cnt.cntct_ctype IN ('Customer','Both')
    AND cnt.cntct_actve = TRUE
    ORDER BY cnt.cntct_cntnm`;
    const params = [muser_id];

    const rows = await dbGetAll(
      sql,
      params,
      `Get customers for ${muser_id}`,
    );
    res.json({
      success: true,
      message: "Customers fetched successfully",
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

//distributors
router.post("/distributors", async (req, res) => {
  try {
    const { muser_id } = req.body;

    // Validate input
    if (!muser_id) {
      return res.json({
        success: false,
        message: "User ID is required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT cnt.*, 0 as edit_stop
    FROM tmcb_cntct cnt
    WHERE cnt.cntct_users = $1
    AND cnt.cntct_ctype IN ('Distributor')
    AND cnt.cntct_actve = TRUE
    ORDER BY cnt.cntct_cntnm`;
    const params = [muser_id];

    const rows = await dbGetAll(
      sql,
      params,
      `Get distributor for ${muser_id}`,
    );
    res.json({
      success: true,
      message: "Distributor fetched successfully",
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


//receipt-suppliers
router.post("/receipt-suppliers", async (req, res) => {
  try {
    const { muser_id, bsins_id } = req.body;

    // Validate input
    if (!muser_id || !bsins_id) {
      return res.json({
        success: false,
        message: "User ID and Business ID are required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT cnt.*, 0 as edit_stop
    FROM tmcb_cntct cnt
    JOIN tmpb_mbkng mbkg ON cnt.id = mbkg.mbkng_cntct
    JOIN tmpb_cbkng cbkg ON mbkg.id = cbkg.cbkng_mbkng AND cbkg.cbkng_pnqty > 0
    WHERE cnt.cntct_ctype IN ('Supplier','Both')
    AND mbkg.mbkng_users = $1
    AND mbkg.mbkng_bsins = $2
    ORDER BY cnt.cntct_cntnm`;
    const params = [muser_id, bsins_id];

    const rows = await dbGetAll(
      sql,
      params,
      `Get customers for ${muser_id}`,
    );
    res.json({
      success: true,
      message: "Customers fetched successfully",
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

//route-outlets-available
router.post("/route-outlets-available", async (req, res) => {
  try {
    const { muser_id, bsins_id, cnrut_rutes } = req.body;

    // Validate input
    if (!muser_id || !bsins_id || !cnrut_rutes) {
      return res.json({
        success: false,
        message: "User ID and Business ID and Route ID are required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT cnt.id, cnt.cntct_cntnm, cnt.cntct_cntps, cnt.cntct_cntno, cnt.cntct_ofadr
    FROM tmcb_cntct cnt
    LEFT JOIN tmcb_cntrt trt ON cnt.id = trt.cnrut_utlet AND trt.cnrut_rutes = $1
    WHERE cnt.cntct_ctype = 'Outlet'
    AND trt.cnrut_srlno IS NULL
    AND cnt.cntct_users = $2
    AND cnt.cntct_bsins = $3
    ORDER BY cnt.cntct_cntnm`;
    const params = [cnrut_rutes, muser_id, bsins_id];

    const rows = await dbGetAll(
      sql,
      params,
      `Get route outlets for ${muser_id}`,
    );
    res.json({
      success: true,
      message: "Route outlets fetched successfully",
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


//route-distributors-available
router.post("/route-distributors-available", async (req, res) => {
  try {
    const { muser_id, bsins_id, cnrut_rutes } = req.body;

    // Validate input
    if (!muser_id || !bsins_id || !cnrut_rutes) {
      return res.json({
        success: false,
        message: "User ID and Business ID and Route ID are required",
        data: null,
      });
    }


    //database action
    const sql = `SELECT cnt.*, 0 as edit_stop
    FROM tmcb_cntct cnt
	JOIN tmcb_tarea ara ON cnt.cntct_tarea = ara.id
	JOIN tmcb_trtry trt ON ara.id = trt.trtry_tarea
	JOIN tmcb_rutes rts ON trt.id = rts.rutes_trtry
    WHERE cnt.cntct_users = $1
    AND cnt.cntct_ctype IN ('Distributor')
    AND cnt.cntct_actve = TRUE
	  AND rts.id = $2
    ORDER BY cnt.cntct_cntnm`;
    const params = [muser_id, cnrut_rutes];

    //console.log("params",params)

    const rows = await dbGetAll(
      sql,
      params,
      `Get route distributors for ${muser_id}`,
    );
    res.json({
      success: true,
      message: "Route distributors fetched successfully",
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