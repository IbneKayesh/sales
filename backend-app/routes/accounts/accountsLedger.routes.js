const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManager");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
  try {
    const { ledgr_users } = req.body;

    // Validate input
    if (!ledgr_users) {
      return res.json({
        success: false,
        message: "User ID is required",
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
      WHERE dgr.ledgr_users = ?
      ORDER BY dgr.ledgr_trdat DESC`;
    const params = [ledgr_users];

    const rows = await dbGetAll(sql, params, `Get ledgers for ${ledgr_users}`);
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

// create
router.post("/create", async (req, res) => {
  try {
    const {
      id,
      ledgr_users,
      ledgr_bsins,
      ledgr_trhed,
      ledgr_cntct,
      ledgr_bacts,
      ledgr_pymod,
      ledgr_trdat,
      ledgr_refno,
      ledgr_notes,
      ledgr_dbamt,
      ledgr_cramt,
      user_id,
    } = req.body;

    // Validate input
    if (
      !id ||
      !ledgr_users ||
      !ledgr_bsins ||
      !ledgr_trhed ||
      !ledgr_cntct ||
      !ledgr_bacts ||
      !ledgr_pymod ||
      !ledgr_trdat ||
      !ledgr_refno ||
      !user_id
    ) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `INSERT INTO tmtb_ledgr
    (id, ledgr_users, ledgr_bsins, ledgr_trhed, ledgr_cntct, ledgr_bacts,
     ledgr_pymod, ledgr_trdat, ledgr_refno, ledgr_notes, ledgr_dbamt,
     ledgr_cramt, ledgr_crusr, ledgr_upusr)
    VALUES (?, ?, ?, ?, ?, ?,
     ?, ?, ?, ?, ?,
     ?, ?, ?)`;
    const params = [
      id,
      ledgr_users,
      ledgr_bsins,
      ledgr_trhed,
      ledgr_cntct,
      ledgr_bacts,
      ledgr_pymod,
      ledgr_trdat,
      ledgr_refno,
      ledgr_notes,
      ledgr_dbamt,
      ledgr_cramt,
      user_id,
      user_id,
    ];

    await dbRun(sql, params, `Create ledger for ${ledgr_refno}`);
    res.json({
      success: true,
      message: "Ledger created successfully",
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
      ledgr_users,
      ledgr_bsins,
      ledgr_trhed,
      ledgr_cntct,
      ledgr_bacts,
      ledgr_pymod,
      ledgr_trdat,
      ledgr_refno,
      ledgr_notes,
      ledgr_dbamt,
      ledgr_cramt,
      user_id,
    } = req.body;

    //console.log("create ledger", req.body);

    // Validate input
    if (
      !id ||
      !ledgr_users ||
      !ledgr_bsins ||
      !ledgr_trhed ||
      !ledgr_cntct ||
      !ledgr_bacts ||
      !ledgr_pymod ||
      !ledgr_trdat ||
      !ledgr_refno ||
      // !ledgr_dbamt ||
      // !ledgr_cramt ||
      !user_id
    ) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmtb_ledgr
    SET ledgr_bsins = ?,
    ledgr_trhed = ?,
    ledgr_cntct = ?,
    ledgr_bacts = ?,
    ledgr_pymod = ?,
    ledgr_trdat = ?,
    ledgr_refno = ?,
    ledgr_notes = ?,
    ledgr_dbamt = ?,
    ledgr_cramt = ?,
    ledgr_upusr = ?,
    ledgr_rvnmr = ledgr_rvnmr + 1
    WHERE id = ?`;
    const params = [
      ledgr_bsins,
      ledgr_trhed,
      ledgr_cntct,
      ledgr_bacts,
      ledgr_pymod,
      ledgr_trdat,
      ledgr_refno,
      ledgr_notes,
      ledgr_dbamt,
      ledgr_cramt,
      user_id,
      id,
    ];

    await dbRun(sql, params, `Update ledger for ${ledgr_refno}`);
    res.json({
      success: true,
      message: "Ledger updated successfully",
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
    const { id, ledgr_refno } = req.body;

    // Validate input
    if (!id) {
      return res.json({
        success: false,
        message: "Ledger ID is required",
        data: null,
      });
    }

    //database action
    const sql = `DELETE FROM tmtb_ledgr
    WHERE id = ?`;
    const params = [id];

    await dbRun(sql, params, `Delete ledger for ${ledgr_refno}`);
    res.json({
      success: true,
      message: "Ledger deleted successfully",
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

// create-transfer
router.post("/create-transfer", async (req, res) => {
  try {
    const {
      id,
      ledgr_users,
      ledgr_bsins,
      ledgr_trhed,
      ledgr_cntct,
      ledgr_bacts_from,
      ledgr_bacts_to,
      ledgr_pymod,
      ledgr_trdat,
      ledgr_refno,
      ledgr_notes,
      ledgr_dbamt,
      ledgr_cramt,
      user_id,
    } = req.body;

    //console.log("create transfer", req.body);

    // Validate input
    if (
      !id ||
      !ledgr_users ||
      !ledgr_bsins ||
      !ledgr_trhed ||
      !ledgr_cntct ||
      !ledgr_bacts_from ||
      !ledgr_bacts_to ||
      !ledgr_pymod ||
      !ledgr_trdat ||
      !ledgr_refno ||
      !user_id
    ) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    const dbId = uuidv4();
    const crId = uuidv4();
    //database action
    const scripts = [];

    scripts.push({
      sql: `INSERT INTO tmtb_ledgr
    (id, ledgr_users, ledgr_bsins, ledgr_trhed, ledgr_cntct, ledgr_bacts,
     ledgr_pymod, ledgr_trdat, ledgr_refno, ledgr_notes, ledgr_dbamt,
     ledgr_cramt, ledgr_crusr, ledgr_upusr)
    VALUES (?, ?, ?, 'Z601', 'internal', ?,
     ?, ?, ?, ?, ?,
     0, ?, ?)`,
      params: [
        dbId,
        ledgr_users,
        ledgr_bsins,
        ledgr_bacts_from,
        ledgr_pymod,
        ledgr_trdat,
        ledgr_refno,
        ledgr_notes,
        ledgr_dbamt,
        user_id,
        user_id,
      ],
      label: `Created debit ${ledgr_refno}`,
    });

    scripts.push({
      sql: `INSERT INTO tmtb_ledgr
    (id, ledgr_users, ledgr_bsins, ledgr_trhed, ledgr_cntct, ledgr_bacts,
     ledgr_pymod, ledgr_trdat, ledgr_refno, ledgr_notes, ledgr_dbamt,
     ledgr_cramt, ledgr_crusr, ledgr_upusr)
    VALUES (?, ?, ?, 'Z602', 'internal', ?,
     ?, ?, ?, ?, 0,
     ?, ?, ?)`,
      params: [
        crId,
        ledgr_users,
        ledgr_bsins,
        ledgr_bacts_to,
        ledgr_pymod,
        ledgr_trdat,
        ledgr_refno,
        ledgr_notes,
        ledgr_dbamt,
        user_id,
        user_id,
      ],
      label: `Created credit ${ledgr_refno}`,
    });

    await dbRunAll(scripts);
    res.json({
      success: true,
      message: "Ledger transfer created successfully",
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
