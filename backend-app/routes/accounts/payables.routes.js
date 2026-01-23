const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManager");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
  try {
    const { paybl_users, paybl_bsins } = req.body;

    // Validate input
    if (!paybl_users || !paybl_bsins) {
      return res.json({
        success: false,
        message: "User, Business ID is required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT '' AS id, bkng.mbkng_users AS paybl_users, bkng.mbkng_bsins AS paybl_bsins, bkng.mbkng_cntct AS paybl_cntct,
    'Cash' AS paybl_pymod, bkng.id AS paybl_refid, bkng.mbkng_trnno AS paybl_refno, 'Purchase Booking' AS paybl_srcnm,
    current_timestamp() AS paybl_trdat, '' AS paybl_descr, 'Payment' AS paybl_notes, bkng.mbkng_duamt AS paybl_dbamt, bkng.mbkng_pyamt AS paybl_cramt,
    bkng.mbkng_trdat, bkng.mbkng_pdamt, bkng.mbkng_duamt, tct.cntct_cntnm, tct.cntct_cntps, tct.cntct_cntno, tct.cntct_email, tct.cntct_ofadr
    FROM tmpb_mbkng bkng
    LEFT JOIN tmcb_cntct tct ON bkng.mbkng_cntct = tct.id
    WHERE bkng.mbkng_duamt > 0
    AND bkng.mbkng_ispad IN (0,2)
    AND bkng.mbkng_users = ?
    AND bkng.mbkng_bsins = ?
    ORDER BY bkng.mbkng_cntct, bkng.mbkng_trnno`;
    const params = [paybl_users, paybl_bsins];

    const rows = await dbGetAll(sql, params, `Get payables for ${paybl_users}`);
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
      paybl_users,
      paybl_bsins,
      paybl_cntct,
      paybl_pymod,
      paybl_refid,
      paybl_refno,
      paybl_srcnm,
      paybl_trdat,
      paybl_descr,
      paybl_notes,
      paybl_dbamt,
      user_id,
    } = req.body;
    //console.log("create:", JSON.stringify(req.body));
    // Validate input
    if (
      !id ||
      !paybl_users ||
      !paybl_bsins ||
      !paybl_cntct ||
      !paybl_pymod ||
      !paybl_refid ||
      !paybl_refno ||
      !paybl_srcnm ||
      !paybl_trdat
    ) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `INSERT INTO tmtb_paybl(id, paybl_users, paybl_bsins, paybl_cntct, paybl_pymod, paybl_refid,
    paybl_refno, paybl_srcnm, paybl_trdat, paybl_descr, paybl_notes, paybl_dbamt,
    paybl_cramt, paybl_crusr, paybl_upusr)
    VALUES (?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?, ?,
    ?, ?, ?)`;
    const params = [
      uuidv4(),
      paybl_users,
      paybl_bsins,
      paybl_cntct,
      paybl_pymod,
      paybl_refid,
      paybl_refno,
      "Purchase Booking",
      paybl_trdat,
      paybl_descr,
      paybl_notes,
      paybl_dbamt,
      0,
      user_id,
      user_id,
    ];

    await dbRun(sql, params, `Account payable for ${paybl_refno}`);
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
      paybl_users,
      paybl_bsins,
      paybl_refno,
      paybl_cntct,
      paybl_trdat,
      paybl_descr,
      search_option,
    } = req.body;

    // Validate input
    if (!paybl_users || !paybl_bsins) {
      return res.json({
        success: false,
        message: "Business ID is required",
        data: null,
      });
    }
    //console.log("get:", JSON.stringify(req.body));

    //database action
    let sql = `SELECT paybl_cntct, paybl_pymod, paybl_refid, paybl_refno, paybl_srcnm, paybl_trdat, paybl_descr, paybl_notes, paybl_dbamt, paybl_cramt
              FROM tmtb_paybl
              WHERE paybl_bsins = ?
              `;
    let params = [paybl_bsins];

    // Optional filters
    if (paybl_refno) {
      sql += ` AND paybl_refno LIKE ?`;
      params.push(`%${paybl_refno}%`);
    }
    if (paybl_cntct) {
      sql += ` AND paybl_cntct LIKE ?`;
      params.push(`%${paybl_cntct}%`);
    }

    if (paybl_descr) {
      sql += ` AND paybl_descr LIKE ?`;
      params.push(`%${paybl_descr}%`);
    }

    if (paybl_trdat) {
      const dateObj = new Date(paybl_trdat);
      const formattedDate =
        dateObj.getFullYear() +
        "-" +
        String(dateObj.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(dateObj.getDate()).padStart(2, "0");

      // console.log("formattedDate", formattedDate);

      sql += ` AND DATE(paybl_trdat) = ?`;
      params.push(formattedDate);
    }

    if (search_option) {
      switch (search_option) {
        case "last_3_days":
          sql += ` AND paybl_trdat >= DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY)`;
          break;
        case "last_7_days":
          sql += ` AND paybl_trdat >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)`;
          break;
        default:
          sql += ``;
          break;
      }
      //params.push(`%${search_option}%`);
    }

    sql += ` ORDER BY paybl_refno`;

    const rows = await dbGetAll(sql, params, `Get payments for ${paybl_bsins}`);
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
