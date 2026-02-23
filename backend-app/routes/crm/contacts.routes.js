const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManager");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
  try {
    const { cntct_users } = req.body;

    // Validate input
    if (!cntct_users) {
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
    WHERE cnt.cntct_users = ?
    ORDER BY cnt.cntct_cntnm`;
    const params = [cntct_users];

    const rows = await dbGetAll(sql, params, `Get contacts for ${cntct_users}`);
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
      user_id,
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
    VALUES (?, ?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?, ?,
    ?, ?, ?,
    ?, ?, ?, ?, ?)`;
    const params = [
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
      user_id,
      user_id,
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
      user_id,
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
    SET cntct_ctype = ?,
    cntct_sorce = ?,
    cntct_cntnm = ?,
    cntct_cntps = ?,
    cntct_cntno = ?,
    cntct_email = ?,
    cntct_tinno = ?,
    cntct_trade = ?,
    cntct_ofadr = ?,
    cntct_fcadr = ?,
    cntct_tarea = ?,
    cntct_dzone = ?,
    cntct_cntry = ?,
    cntct_cntad = ?,
    cntct_dspct = ?,
    cntct_crlmt = ?,
    cntct_upusr = ?,
    cntct_rvnmr = cntct_rvnmr + 1
    WHERE id = ?`;
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
      user_id,
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
    const { id, cntct_cntnm } = req.body;

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
    SET cntct_actve = 1 - cntct_actve
    WHERE id = ?`;
    const params = [id];

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
    const { cntct_users, cntct_ctype } = req.body;

    // Validate input
    if (!cntct_users || !cntct_ctype) {
      return res.json({
        success: false,
        message: "User ID and Contact Type are required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT cnt.*, 0 as edit_stop
    FROM tmcb_cntct cnt
    WHERE cnt.cntct_users = ?
    AND cnt.cntct_ctype = ?
    ORDER BY cnt.cntct_cntnm`;
    const params = [cntct_users, cntct_ctype];

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
    const { paybl_users, paybl_bsins, paybl_cntct } = req.body;
    //console.log("req.body ", req.body);

    // Validate input
    if (!paybl_users || !paybl_bsins || !paybl_cntct) {
      return res.json({
        success: false,
        message: "User, Business, Contact are required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT paybl_pymod, paybl_refno, paybl_srcnm, paybl_trdat, paybl_descr, paybl_notes, paybl_dbamt, paybl_cramt
          FROM tmtb_paybl
          WHERE paybl_users = ?
          AND paybl_bsins = ?
          AND paybl_cntct = ?
          ORDER BY paybl_refno DESC, paybl_trdat DESC`;
    const params = [paybl_users, paybl_bsins, paybl_cntct];

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
    const { cntct_users } = req.body;

    // Validate input
    if (!cntct_users) {
      return res.json({
        success: false,
        message: "User ID is required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT cnt.*, 0 as edit_stop
    FROM tmcb_cntct cnt
    WHERE cnt.cntct_users = ?
    AND cnt.cntct_ctype IN ('Supplier','Both')
    ORDER BY cnt.cntct_cntnm`;
    const params = [cntct_users];

    const rows = await dbGetAll(
      sql,
      params,
      `Get suppliers for ${cntct_users}`,
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
    const { cntct_users } = req.body;

    // Validate input
    if (!cntct_users) {
      return res.json({
        success: false,
        message: "User ID is required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT cnt.*, 0 as edit_stop
    FROM tmcb_cntct cnt
    WHERE cnt.cntct_users = ?
    AND cnt.cntct_ctype IN ('Customer','Both')
    ORDER BY cnt.cntct_cntnm`;
    const params = [cntct_users];

    const rows = await dbGetAll(
      sql,
      params,
      `Get customers for ${cntct_users}`,
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


//receipt-suppliers
router.post("/receipt-suppliers", async (req, res) => {
  try {
    const { cntct_users, cntct_bsins } = req.body;

    // Validate input
    if (!cntct_users || !cntct_bsins) {
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
    AND mbkg.mbkng_users = ?
    AND mbkg.mbkng_bsins = ?
    ORDER BY cnt.cntct_cntnm`;
    const params = [cntct_users, cntct_bsins];

    const rows = await dbGetAll(
      sql,
      params,
      `Get customers for ${cntct_users}`,
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
    const { cntct_users, cntct_bsins, cnrut_rutes } = req.body;

    // Validate input
    if (!cntct_users || !cntct_bsins || !cnrut_rutes) {
      return res.json({
        success: false,
        message: "User ID and Business ID and Route ID are required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT cnt.id, cnt.cntct_cntnm, cnt.cntct_cntps, cnt.cntct_cntno, cnt.cntct_ofadr
    FROM tmcb_cntct cnt
    LEFT JOIN tmcb_cntrt trt ON cnt.id = trt.cnrut_cntct AND trt.cnrut_rutes = ?
    WHERE cnt.cntct_ctype = 'Outlet'
    AND trt.cnrut_srlno IS NULL
    AND cnt.cntct_users = ?
    AND cnt.cntct_bsins = ?
    ORDER BY cnt.cntct_cntnm`;
    const params = [cnrut_rutes, cntct_users, cntct_bsins];

    const rows = await dbGetAll(
      sql,
      params,
      `Get route outlets for ${cntct_users}`,
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

module.exports = router;
