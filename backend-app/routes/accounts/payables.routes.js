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
    UNION ALL
    SELECT '' AS id, minvc.minvc_users AS paybl_users, minvc.minvc_bsins AS paybl_bsins, minvc.minvc_cntct AS paybl_cntct,
    'Cash' AS paybl_pymod, minvc.id AS paybl_refid, minvc.minvc_trnno AS paybl_refno, 'Purchase Invoice' AS paybl_srcnm,
    current_timestamp() AS paybl_trdat, '' AS paybl_descr, 'Payment' AS paybl_notes, minvc.minvc_duamt AS paybl_dbamt, minvc.minvc_pyamt AS paybl_cramt,
    minvc.minvc_trdat, minvc.minvc_pdamt, minvc.minvc_duamt, tct.cntct_cntnm, tct.cntct_cntps, tct.cntct_cntno, tct.cntct_email, tct.cntct_ofadr
    FROM tmpb_minvc minvc
    LEFT JOIN tmcb_cntct tct ON minvc.minvc_cntct = tct.id
    WHERE minvc.minvc_duamt > 0
    AND minvc.minvc_ispad IN (0,2)
    AND minvc.minvc_users = ?
    AND minvc.minvc_bsins = ?
    `;

    //ORDER BY bkng.mbkng_cntct, bkng.mbkng_trnno
    const params = [paybl_users, paybl_bsins, paybl_users, paybl_bsins];

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
    const scripts = [];
    scripts.push({
      sql: `INSERT INTO tmtb_paybl(id, paybl_users, paybl_bsins, paybl_cntct, paybl_pymod, paybl_refid,
      paybl_refno, paybl_srcnm, paybl_trdat, paybl_descr, paybl_notes, paybl_dbamt,
      paybl_cramt, paybl_crusr, paybl_upusr)
      VALUES (?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?)`,
      params: [
        uuidv4(),
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
        0,
        user_id,
        user_id,
      ],
      label: `Create payable for ${paybl_refno}`,
    });

    if (paybl_srcnm === "Purchase Booking") {
      scripts.push({
        sql: `UPDATE tmpb_mbkng SET mbkng_pdamt = mbkng_pdamt + ?, mbkng_duamt = mbkng_duamt - ? WHERE id = ?`,
        params: [paybl_dbamt, paybl_dbamt, paybl_refid],
        label: `Update Purchase Booking ${paybl_refno}`,
      });

      scripts.push({
        sql: `UPDATE tmpb_mbkng
        SET mbkng_ispad = 
        CASE
          WHEN mbkng_duamt <= 0 THEN 1
          WHEN mbkng_duamt > 0 AND mbkng_duamt < mbkng_pyamt THEN 2
          ELSE 0
        END WHERE id = ?`,
        params: [paybl_refid],
        label: `Update Purchase Booking Status ${paybl_refno}`,
      });
    }
    if (paybl_srcnm === "Purchase Invoice") {
      scripts.push({
        sql: `UPDATE tmpb_minvc SET minvc_pdamt = minvc_pdamt + ?, minvc_duamt = minvc_duamt - ? WHERE id = ?`,
        params: [paybl_dbamt, paybl_dbamt, paybl_refid],
        label: `Update Purchase Invoice ${paybl_refno}`,
      });

      scripts.push({
        sql: `UPDATE tmpb_minvc
        SET minvc_ispad = 
        CASE
          WHEN minvc_duamt <= 0 THEN 1
          WHEN minvc_duamt > 0 AND minvc_duamt < minvc_pyamt THEN 2
          ELSE 0
        END WHERE id = ?`,
        params: [paybl_refid],
        label: `Update Purchase Invoice Status ${paybl_refno}`,
      });
    }
    await dbRunAll(scripts);

    res.json({
      success: true,
      message: "Account payable created successfully",
      data: {
        ...req.body,
      },
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

//payment-summary
router.post("/payment-summary", async (req, res) => {
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
    let sql = `SELECT cnt.cntct_cntnm, pbl.paybl_refno, pbl.paybl_srcnm, SUM(pbl.paybl_dbamt) AS paybl_dbamt, SUM(pbl.paybl_cramt) AS paybl_cramt
    FROM tmtb_paybl pbl
    LEFT JOIN tmcb_cntct cnt ON pbl.paybl_cntct = cnt.id
    WHERE pbl.paybl_bsins = ?
    `;
    let params = [paybl_bsins];

    // Optional filters
    if (paybl_refno) {
      sql += ` AND pbl.paybl_refno LIKE ?`;
      params.push(`%${paybl_refno}%`);
    }
    if (paybl_cntct) {
      sql += ` AND cnt.cntct_cntnm LIKE ?`;
      params.push(`%${paybl_cntct}%`);
    }

    if (paybl_descr) {
      sql += ` AND pbl.paybl_descr LIKE ?`;
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

      sql += ` AND DATE(pbl.paybl_trdat) = ?`;
      params.push(formattedDate);
    }

    if (search_option) {
      switch (search_option) {
        case "last_3_days":
          sql += ` AND pbl.paybl_trdat >= DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY)`;
          break;
        case "last_7_days":
          sql += ` AND pbl.paybl_trdat >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)`;
          break;
        default:
          sql += ``;
          break;
      }
      //params.push(`%${search_option}%`);
    }

    sql += ` GROUP BY cnt.cntct_cntnm, pbl.paybl_refno, pbl.paybl_srcnm`;
    sql += ` ORDER BY pbl.paybl_refno`;

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
