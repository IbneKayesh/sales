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
      cntct_ofadr,
      cntct_fcadr,
      cntct_cntry,
      cntct_cntad,
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
    const sql = `INSERT INTO tmcb_cntct
    (id,cntct_users,cntct_bsins,cntct_ctype,cntct_sorce,cntct_cntnm,
    cntct_cntps,cntct_cntno,cntct_email,cntct_ofadr,cntct_fcadr,cntct_cntry,cntct_cntad,
    cntct_crlmt,cntct_crusr,cntct_upusr)
    VALUES (?,?,?,?,?,?,
    ?,?,?,?,?,?,?,
    ?,?,?)`;
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
      cntct_ofadr,
      cntct_fcadr,
      cntct_cntry,
      cntct_cntad,
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
      cntct_ofadr,
      cntct_fcadr,
      cntct_cntry,
      cntct_cntad,
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
    cntct_ofadr = ?,
    cntct_fcadr = ?,
    cntct_cntry = ?,
    cntct_cntad = ?,
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
      cntct_ofadr,
      cntct_fcadr,
      cntct_cntry,
      cntct_cntad,
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
    const { id, ledgr_users } = req.body;
    //console.log("req.body ", req.body);

    // Validate input
    if (!id || !ledgr_users) {
      return res.json({
        success: false,
        message: "Contact ID is required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT dgr.*,bsns.bsins_bname, thed.trhed_hednm,
    cntc.cntct_cntnm, acts.bacts_bankn,
     0 as edit_stop
      FROM tmtb_ledgr dgr
      LEFT JOIN tmab_bsins bsns ON dgr.ledgr_bsins = bsns.id
      LEFT JOIN tmtb_trhed thed ON dgr.ledgr_trhed = thed.id
      LEFT JOIN tmcb_cntct cntc ON dgr.ledgr_cntct = cntc.id
      LEFT JOIN tmtb_bacts acts ON dgr.ledgr_bacts = acts.id
      WHERE dgr.ledgr_cntct = ?
      AND dgr.ledgr_users = ?
      ORDER BY dgr.ledgr_crdat DESC`;
    const params = [id, ledgr_users];

    const rows = await dbGetAll(sql, params, `Get ledgers for ${id}`);
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

    const rows = await dbGetAll(sql, params, `Get suppliers for ${cntct_users}`);
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

module.exports = router;
