const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
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
    const sql = `SELECT cnt.*, 0 as edit_stop,
    ta.tarea_tname, dz.dzone_dname
    FROM tmcb_cntct cnt
    LEFT JOIN tmcb_tarea ta ON ta.id = cnt.cntct_tarea
    LEFT JOIN tmcb_dzone dz ON dz.id = cnt.cntct_dzone
    WHERE cnt.cntct_users = $1
    ORDER BY cnt.cntct_cntnm`;
    const params = [muser_id];

    const rows = await dbGetAll(sql, params, `Get contacts for ${muser_id}`);
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

// create
router.post("/create", async (req, res) => {
  try {
    const {
      id,
      cntct_users,
      cntct_bsins,
      cntct_ctype,
      cntct_sorce,
      cntct_cntnm,
      cntct_cntps,
      cntct_cntno,
      cntct_email,
      cntct_tinno,
      cntct_trade,
      cntct_ofadr,
      cntct_fcadr,
      cntct_tarea,
      cntct_dzone,
      cntct_cntry,
      cntct_cntad,
      cntct_dspct,
      cntct_crlmt,
      muser_id,
      bsins_id,
      suser_id,
    } = req.body;

    // Validate input
    if (
      !id ||
      !cntct_users ||
      !cntct_bsins ||
      !cntct_ctype ||
      !cntct_sorce ||
      !cntct_cntnm ||
      //!cntct_cntps ||
      //!cntct_cntno ||
      //!cntct_email ||
      //!cntct_ofadr ||
      //!cntct_fcadr ||
      !cntct_cntry ||
      !cntct_cntad ||
      !cntct_crlmt
    ) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `INSERT INTO tmcb_cntct(id, cntct_users, cntct_bsins, cntct_ctype, cntct_sorce, cntct_cntnm, cntct_cntps,
    cntct_cntno, cntct_email, cntct_tinno, cntct_trade, cntct_ofadr, cntct_fcadr,
    cntct_tarea, cntct_dzone, cntct_cntry,
    cntct_cntad, cntct_dspct, cntct_crlmt, cntct_crusr, cntct_upusr)
    VALUES ($1, $2, $3, $4, $5, $6, $7,
    $8, $9, $10, $11, $12, $13,
    $14, $15, $16,
    $17, $18, $19, $20, $21)`;
    const params = [
      id,
      muser_id,
      bsins_id,
      cntct_ctype,
      cntct_sorce,
      cntct_cntnm,
      cntct_cntps,
      cntct_cntno,
      cntct_email,
      cntct_tinno,
      cntct_trade,
      cntct_ofadr,
      cntct_fcadr,
      cntct_tarea,
      cntct_dzone,
      cntct_cntry,
      cntct_cntad,
      cntct_dspct,
      cntct_crlmt,
      suser_id,
      suser_id,
    ];

    await dbRun(sql, params, `Create contact for ${cntct_cntnm}`);
    res.json({
      success: true,
      message: "Contact created successfully",
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
      cntct_users,
      cntct_bsins,
      cntct_ctype,
      cntct_sorce,
      cntct_cntnm,
      cntct_cntps,
      cntct_cntno,
      cntct_email,
      cntct_tinno,
      cntct_trade,
      cntct_ofadr,
      cntct_fcadr,
      cntct_tarea,
      cntct_dzone,
      cntct_cntry,
      cntct_cntad,
      cntct_dspct,
      cntct_crlmt,
      muser_id,
      bsins_id,
      suser_id,
    } = req.body;

    // Validate input
    if (
      !id ||
      !cntct_users ||
      !cntct_bsins ||
      !cntct_ctype ||
      !cntct_sorce ||
      !cntct_cntnm ||
      //!cntct_cntps ||
      //!cntct_cntno ||
      //!cntct_email ||
      //!cntct_ofadr ||
      //!cntct_fcadr ||
      !cntct_cntry ||
      !cntct_cntad ||
      !cntct_crlmt
    ) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmcb_cntct
    SET cntct_ctype = $1,
    cntct_sorce = $2,
    cntct_cntnm = $3,
    cntct_cntps = $4,
    cntct_cntno = $5,
    cntct_email = $6,
    cntct_tinno = $7,
    cntct_trade = $8,
    cntct_ofadr = $9,
    cntct_fcadr = $10,
    cntct_tarea = $11,
    cntct_dzone = $12,
    cntct_cntry = $13,
    cntct_cntad = $14,
    cntct_dspct = $15,
    cntct_crlmt = $16,
    cntct_upusr = $17,
    cntct_updat = CURRENT_TIMESTAMP,
    cntct_rvnmr = cntct_rvnmr + 1
    WHERE id = $18`;
    const params = [
      cntct_ctype,
      cntct_sorce,
      cntct_cntnm,
      cntct_cntps,
      cntct_cntno,
      cntct_email,
      cntct_tinno,
      cntct_trade,
      cntct_ofadr,
      cntct_fcadr,
      cntct_tarea,
      cntct_dzone,
      cntct_cntry,
      cntct_cntad,
      cntct_dspct,
      cntct_crlmt,
      suser_id,
      id,
    ];

    await dbRun(sql, params, `Update contact for ${cntct_cntnm}`);
    res.json({
      success: true,
      message: "Contact updated successfully",
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
    const { id, muser_id, cntct_cntnm, suser_id } = req.body;

    // Validate input
    if (!id) {
      return res.json({
        success: false,
        message: "Contact ID is required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmcb_cntct
    SET cntct_actve = NOT cntct_actve,
    cntct_upusr = $1,
    cntct_updat = CURRENT_TIMESTAMP,
    cntct_rvnmr = cntct_rvnmr + 1
    WHERE id = $2`;
    const params = [suser_id, id];


    await dbRun(sql, params, `Delete contact for ${cntct_cntnm}`);
    res.json({
      success: true,
      message: "Contact deleted successfully",
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
    const sql = `SELECT paybl_pymod, paybl_refno, paybl_srcnm, paybl_trdat, paybl_descr, paybl_notes, paybl_dbamt, paybl_cramt
          FROM tmtb_paybl
          WHERE paybl_users = $1
          AND paybl_bsins = $2
          AND paybl_cntct = $3
          ORDER BY paybl_refno DESC, paybl_trdat DESC`;
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

//suppliers
router.post("/suppliers", async (req, res) => {
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
    AND cnt.cntct_ctype IN ('Supplier','Both')
    AND cnt.cntct_actve = TRUE
    ORDER BY cnt.cntct_cntnm`;
    const params = [muser_id];

    const rows = await dbGetAll(
      sql,
      params,
      `Get suppliers for ${muser_id}`,
    );
    res.json({
      success: true,
      message: "Suppliers fetched successfully",
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