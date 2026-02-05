const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManager");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
  try {
    const { rcvbl_users, rcvbl_bsins } = req.body;

    // Validate input
    if (!rcvbl_users || !rcvbl_bsins) {
      return res.json({
        success: false,
        message: "User, Business ID is required",
        data: null,
      });
    }

    //database action
    const sql1 = `SELECT '' AS id, bkng.mbkng_users AS rcvbl_users, bkng.mbkng_bsins AS rcvbl_bsins, bkng.mbkng_cntct AS rcvbl_cntct,
    'Cash' AS rcvbl_pymod, bkng.id AS rcvbl_refid, bkng.mbkng_trnno AS rcvbl_refno, 'Sales Booking' AS rcvbl_srcnm,
    current_timestamp() AS rcvbl_trdat, '' AS rcvbl_descr, 'Payment' AS rcvbl_notes, bkng.mbkng_duamt AS rcvbl_dbamt, bkng.mbkng_pyamt AS rcvbl_cramt,
    bkng.mbkng_trdat, bkng.mbkng_pdamt, bkng.mbkng_duamt, tct.cntct_cntnm, tct.cntct_cntps, tct.cntct_cntno, tct.cntct_email, tct.cntct_ofadr
    FROM tmpb_mbkng bkng
    LEFT JOIN tmcb_cntct tct ON bkng.mbkng_cntct = tct.id
    WHERE bkng.mbkng_duamt > 0
    AND bkng.mbkng_ispad IN (0,2)
    AND bkng.mbkng_users = ?
    AND bkng.mbkng_bsins = ?
    UNION ALL
    SELECT '' AS id, minvc.minvc_users AS rcvbl_users, minvc.minvc_bsins AS rcvbl_bsins, minvc.minvc_cntct AS rcvbl_cntct,
    'Cash' AS rcvbl_pymod, minvc.id AS rcvbl_refid, minvc.minvc_trnno AS rcvbl_refno, 'Sales Invoice' AS rcvbl_srcnm,
    current_timestamp() AS rcvbl_trdat, '' AS rcvbl_descr, 'Payment' AS rcvbl_notes, minvc.minvc_duamt AS rcvbl_dbamt, minvc.minvc_pyamt AS rcvbl_cramt,
    minvc.minvc_trdat, minvc.minvc_pdamt, minvc.minvc_duamt, tct.cntct_cntnm, tct.cntct_cntps, tct.cntct_cntno, tct.cntct_email, tct.cntct_ofadr
    FROM tmeb_minvc minvc
    LEFT JOIN tmcb_cntct tct ON minvc.minvc_cntct = tct.id
    WHERE minvc.minvc_duamt > 0
    AND minvc.minvc_ispad IN (0,2)
    AND minvc.minvc_users = ?
    AND minvc.minvc_bsins = ?
    `;

    const sql = `SELECT '' AS id, minvc.minvc_users AS rcvbl_users, minvc.minvc_bsins AS rcvbl_bsins, minvc.minvc_cntct AS rcvbl_cntct,
    'Cash' AS rcvbl_pymod, minvc.id AS rcvbl_refid, minvc.minvc_trnno AS rcvbl_refno, 'Sales Invoice' AS rcvbl_srcnm,
    current_timestamp() AS rcvbl_trdat, '' AS rcvbl_descr, 'Payment' AS rcvbl_notes, minvc.minvc_duamt AS rcvbl_dbamt, minvc.minvc_pyamt AS rcvbl_cramt,
    minvc.minvc_trdat, minvc.minvc_pdamt, minvc.minvc_duamt, tct.cntct_cntnm, tct.cntct_cntps, tct.cntct_cntno, tct.cntct_email, tct.cntct_ofadr
    FROM tmeb_minvc minvc
    LEFT JOIN tmcb_cntct tct ON minvc.minvc_cntct = tct.id
    WHERE minvc.minvc_duamt > 0
    AND minvc.minvc_ispad IN (0,2)
    AND minvc.minvc_users = ?
    AND minvc.minvc_bsins = ?`;

    //ORDER BY bkng.mbkng_cntct, bkng.mbkng_trnno
    //const params = [rcvbl_users, rcvbl_bsins, rcvbl_users, rcvbl_bsins];
    const params = [ rcvbl_users, rcvbl_bsins];

    const rows = await dbGetAll(sql, params, `Get payables for ${rcvbl_users}`);
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
      rcvbl_users,
      rcvbl_bsins,
      rcvbl_cntct,
      rcvbl_pymod,
      rcvbl_refid,
      rcvbl_refno,
      rcvbl_srcnm,
      rcvbl_trdat,
      rcvbl_descr,
      rcvbl_notes,
      rcvbl_dbamt,
      user_id,
    } = req.body;
    //console.log("create:", JSON.stringify(req.body));
    // Validate input
    if (
      !id ||
      !rcvbl_users ||
      !rcvbl_bsins ||
      !rcvbl_cntct ||
      !rcvbl_pymod ||
      !rcvbl_refid ||
      !rcvbl_refno ||
      !rcvbl_srcnm ||
      !rcvbl_trdat
    ) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `INSERT INTO tmtb_paybl(id, rcvbl_users, rcvbl_bsins, rcvbl_cntct, rcvbl_pymod, rcvbl_refid,
    rcvbl_refno, rcvbl_srcnm, rcvbl_trdat, rcvbl_descr, rcvbl_notes, rcvbl_dbamt,
    rcvbl_cramt, rcvbl_crusr, rcvbl_upusr)
    VALUES (?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?, ?,
    ?, ?, ?)`;
    const params = [
      uuidv4(),
      rcvbl_users,
      rcvbl_bsins,
      rcvbl_cntct,
      rcvbl_pymod,
      rcvbl_refid,
      rcvbl_refno,
      "Purchase Booking",
      rcvbl_trdat,
      rcvbl_descr,
      rcvbl_notes,
      rcvbl_dbamt,
      0,
      user_id,
      user_id,
    ];

    await dbRun(sql, params, `Account payable for ${rcvbl_refno}`);
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

// payment details
router.post("/payment-details", async (req, res) => {
  try {
    const {
      rcvbl_users,
      rcvbl_bsins,
      rcvbl_refno,
      rcvbl_cntct,
      rcvbl_trdat,
      rcvbl_descr,
      search_option,
    } = req.body;

    // Validate input
    if (!rcvbl_users || !rcvbl_bsins) {
      return res.json({
        success: false,
        message: "Business ID is required",
        data: null,
      });
    }
    //console.log("get:", JSON.stringify(req.body));

    //database action
    let sql = `SELECT rcvbl_cntct, rcvbl_pymod, rcvbl_refid, rcvbl_refno, rcvbl_srcnm, rcvbl_trdat, rcvbl_descr, rcvbl_notes, rcvbl_dbamt, rcvbl_cramt
              FROM tmtb_paybl
              WHERE rcvbl_bsins = ?
              `;
    let params = [rcvbl_bsins];

    // Optional filters
    if (rcvbl_refno) {
      sql += ` AND rcvbl_refno LIKE ?`;
      params.push(`%${rcvbl_refno}%`);
    }
    if (rcvbl_cntct) {
      sql += ` AND rcvbl_cntct LIKE ?`;
      params.push(`%${rcvbl_cntct}%`);
    }

    if (rcvbl_descr) {
      sql += ` AND rcvbl_descr LIKE ?`;
      params.push(`%${rcvbl_descr}%`);
    }

    if (rcvbl_trdat) {
      const dateObj = new Date(rcvbl_trdat);
      const formattedDate =
        dateObj.getFullYear() +
        "-" +
        String(dateObj.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(dateObj.getDate()).padStart(2, "0");

      // console.log("formattedDate", formattedDate);

      sql += ` AND DATE(rcvbl_trdat) = ?`;
      params.push(formattedDate);
    }

    if (search_option) {
      switch (search_option) {
        case "last_3_days":
          sql += ` AND rcvbl_trdat >= DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY)`;
          break;
        case "last_7_days":
          sql += ` AND rcvbl_trdat >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)`;
          break;
        default:
          sql += ``;
          break;
      }
      //params.push(`%${search_option}%`);
    }

    sql += ` ORDER BY rcvbl_refno`;

    const rows = await dbGetAll(sql, params, `Get payments for ${rcvbl_bsins}`);
    res.json({
      success: true,
      message: "Payments fetched successfully",
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
