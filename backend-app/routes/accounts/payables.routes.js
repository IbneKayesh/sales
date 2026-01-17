const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManager");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
  try {
    const { pmstr_users, pmstr_bsins } = req.body;

    // Validate input
    if (!pmstr_users || !pmstr_bsins) {
      return res.json({
        success: false,
        message: "User ID is required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT '' AS id, str.pmstr_users AS rcvpy_users, str.pmstr_bsins AS rcvpy_bsins, str.pmstr_cntct AS rcvpy_cntct, 'Cash' AS rcvpy_pymod,
    str.id AS rcvpy_refid, str.pmstr_trnno AS rcvpy_refno, str.pmstr_odtyp AS rcvpy_srcnm, current_timestamp() AS rcvpy_trdat, str.pmstr_refno AS rcvpy_notes,
    str.pmstr_duamt AS rcvpy_pyamt,
    str.pmstr_trdat, str.pmstr_pyamt, str.pmstr_pdamt, str.pmstr_duamt, tct.cntct_cntnm, tct.cntct_cntps, tct.cntct_cntno, tct.cntct_email, tct.cntct_ofadr
    FROM tmpb_pmstr str
    LEFT JOIN tmcb_cntct tct ON str.pmstr_cntct = tct.id
    WHERE str.pmstr_odtyp = 'Purchase Booking' AND str.pmstr_duamt > 0
    AND str.pmstr_users = ? AND str.pmstr_bsins = ?
    ORDER BY str.pmstr_cntct, str.pmstr_trnno`;
    const params = [pmstr_users, pmstr_bsins];

    const rows = await dbGetAll(sql, params, `Get payables for ${pmstr_users}`);
    res.json({
      success: true,
      message: "Payables fetched successfully",
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
      rcvpy_users,
      rcvpy_bsins,
      rcvpy_cntct,
      rcvpy_pymod,
      rcvpy_refid,
      rcvpy_refno,
      rcvpy_srcnm,
      rcvpy_trdat,
      rcvpy_notes,
      rcvpy_pyamt,
      user_id,
    } = req.body;
    //console.log("create:", JSON.stringify(req.body));
    // Validate input
    if (
      !id ||
      !rcvpy_users ||
      !rcvpy_bsins ||
      !rcvpy_cntct ||
      !rcvpy_pymod ||
      !rcvpy_refid ||
      !rcvpy_refno ||
      !rcvpy_srcnm ||
      !rcvpy_trdat
    ) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `INSERT INTO tmtb_rcvpy(id, rcvpy_users, rcvpy_bsins, rcvpy_cntct, rcvpy_pymod, rcvpy_refid,
    rcvpy_refno, rcvpy_srcnm, rcvpy_trdat, rcvpy_notes, rcvpy_pyamt, rcvpy_crusr, rcvpy_upusr)
    VALUES (?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?, ?, ?)`;
    const params = [
      uuidv4(),
      rcvpy_users,
      rcvpy_bsins,
      rcvpy_cntct,
      rcvpy_pymod,
      rcvpy_refid,
      rcvpy_refno,
      rcvpy_srcnm,
      rcvpy_trdat,
      rcvpy_notes,
      rcvpy_pyamt,
      user_id,
      user_id,
    ];

    await dbRun(sql, params, `Account payable for ${rcvpy_cntct}`);
    res.json({
      success: true,
      message: "Account payable created successfully",
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
  //console.log("update:", JSON.stringify(req.body));

  try {
    const {
      id,
      bacts_users,
      bacts_bankn,
      bacts_brnch,
      bacts_acnam,
      bacts_acnum,
      bacts_routn,
      bacts_notes,
      bacts_opdat,
      user_id,
    } = req.body;

    // Validate input
    if (!id || !bacts_users || !bacts_bankn) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmtb_bacts
    SET bacts_bankn = ?,
    bacts_brnch = ?,
    bacts_acnam = ?,
    bacts_acnum = ?,
    bacts_routn = ?,
    bacts_notes = ?,
    bacts_opdat = ?,
    bacts_upusr = ?,
    bacts_rvnmr = bacts_rvnmr + 1
    WHERE id = ?`;
    const params = [
      bacts_bankn,
      bacts_brnch,
      bacts_acnam,
      bacts_acnum,
      bacts_routn,
      bacts_notes,
      bacts_opdat,
      user_id,
      id,
    ];

    await dbRun(sql, params, `Update account for ${bacts_bankn}`);
    res.json({
      success: true,
      message: "Account updated successfully",
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
    const { id, bacts_bankn } = req.body;

    // Validate input
    if (!id) {
      return res.json({
        success: false,
        message: "Account ID is required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmtb_bacts
    SET bacts_actve = 1 - bacts_actve
    WHERE id = ?`;
    const params = [id];

    await dbRun(sql, params, `Delete account for ${bacts_bankn}`);
    res.json({
      success: true,
      message: "Account deleted successfully",
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

// set default
router.post("/set-default", async (req, res) => {
  try {
    const { id, bacts_bankn } = req.body;

    // Validate input
    if (!id) {
      return res.json({
        success: false,
        message: "Account ID is required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmtb_bacts
    SET bacts_isdef = 1 - bacts_isdef
    WHERE id = ?`;
    const params = [id];

    await dbRun(sql, params, `Set default account for ${bacts_bankn}`);
    res.json({
      success: true,
      message: "Account set default successfully",
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
