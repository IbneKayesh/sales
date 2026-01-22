const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManager");
const { v4: uuidv4 } = require("uuid");

// generate
router.post("/accounts-ledger", async (req, res) => {
  try {
    const { id } = req.body;
    console.log("id: " + id);

    // Validate input
    if (!id) {
      return res.json({
        success: false,
        message: "User ID is required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmtb_bacts AS b
      JOIN (
          SELECT 
              ledgr_bacts  AS id,
              ledgr_users  AS bacts_users,
              SUM(ledgr_cramt - ledgr_dbamt) AS bacts_crbln
          FROM tmtb_ledgr
          WHERE ledgr_users = ?
          GROUP BY ledgr_bacts, ledgr_users
      ) AS bl
        ON bl.id = b.id
      AND bl.bacts_users = b.bacts_users
      SET b.bacts_crbln = bl.bacts_crbln`;
    const params = [id];
    await dbRun(sql, params, `Account balance generated for ${id}`);
    res.json({
      success: true,
      message: "Account balance generated successfully",
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

//purchase booking
router.post("/purchase-booking", async (req, res) => {
  try {
    const { id } = req.body;

    // Validate input
    if (!id) {
      return res.json({
        success: false,
        message: "Business Id is required",
        data: null,
      });
    }

    //database action
    const scripts = [];
    scripts.push({
      sql: `UPDATE tmib_bitem
      SET bitem_pbqty = 0
      WHERE bitem_bsins = ?
      AND  bitem_pbqty > 0`,
      params: [id],
      label: `Reset Purchase Booking Quantity`,
    });

    scripts.push({
      sql: `UPDATE tmib_bitem AS tgt
      JOIN (
        SELECT cbkg.cbkng_bitem, SUM(cbkg.cbkng_pnqty) AS cbkng_pnqty
        FROM tmpb_cbkng cbkg
        JOIN tmpb_mbkng bkg ON cbkg.cbkng_mbkng = bkg.id
        WHERE cbkg.cbkng_pnqty > 0
        AND bkg.mbkng_bsins = ?
        GROUP BY cbkg.cbkng_bitem
        )AS src
      ON tgt.id = src.cbkng_bitem
      SET tgt.bitem_pbqty = src.cbkng_pnqty`,
      params: [id],
      label: `Update Purchase Booking Quantity`,
    });

    scripts.push({
      sql: `UPDATE tmpb_mbkng
      SET mbkng_ispad = 1
      WHERE mbkng_ispad IN (0,2)
      AND mbkng_duamt = 0
      AND mbkng_bsins = ?`,
      params: [id],
      label: `Update Purchase Booking payment status`,
    });

    await dbRunAll(scripts);
    res.json({
      success: true,
      message: "Purchase Booking Generated successfully",
      data: req.body,
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

//payable-due
router.post("/payable-due", async (req, res) => {
  try {
    const { id } = req.body;

    // Validate input
    if (!id) {
      return res.json({
        success: false,
        message: "Ref Id is required",
        data: null,
      });
    }

    //database action
    const scripts = [];
    scripts.push({
      sql: `UPDATE tmpb_mbkng tgt
      JOIN (
        SELECT paybl_refid, SUM(paybl_dbamt) AS paybl_pyamt
        FROM tmtb_paybl
        WHERE paybl_refid = ?
        GROUP BY paybl_refid
      )src
      ON tgt.id = src.paybl_refid
      SET tgt.mbkng_pdamt = src.paybl_pyamt,
      tgt.mbkng_duamt = tgt.mbkng_pyamt - src.paybl_pyamt`,
      params: [id],
      label: `Update Payable Due`,
    });

    scripts.push({
      sql: `UPDATE tmpb_mbkng
      SET mbkng_ispad = 1
      WHERE mbkng_duamt = 0
      AND id = ?`,
      params: [id],
      label: `Update Payable Due`,
    });

    await dbRunAll(scripts);
    res.json({
      success: true,
      message: "Payable Due Updated successfully",
      data: req.body,
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

//purchase receipt
router.post("/purchase-receipt", async (req, res) => {
  try {
    const { id } = req.body;

    // Validate input
    if (!id) {
      return res.json({
        success: false,
        message: "Business Id is required",
        data: null,
      });
    }

    //database action
    const scripts = [];

    scripts.push({
      sql: `UPDATE tmpb_bking tgt
        JOIN (
        SELECT bking.id, SUM(recpt.recpt_bkqty) AS recpt_bkqty
        FROM tmpb_bking bking
        JOIN tmpb_recpt recpt ON bking.id = recpt.recpt_bking
        JOIN tmpb_pmstr str ON bking.bking_pmstr = str.id
        WHERE bking.bking_pnqty > 0
        AND str.pmstr_bsins = ?
        GROUP BY bking.id
        )src
        ON tgt.id = src.id
        SET tgt.bking_rcqty = src.recpt_bkqty,
        tgt.bking_pnqty = tgt.bking_bkqty - ( tgt.bking_cnqty + src.recpt_bkqty )`,
      params: [id],
      label: `Update Purchase Receipt Quantity`,
    });

    scripts.push({
      sql: `UPDATE tmib_bitem
      SET bitem_pbqty = 0
      WHERE bitem_bsins = ?
      AND  bitem_pbqty > 0`,
      params: [id],
      label: `Reset Purchase Booking Quantity`,
    });

    scripts.push({
      sql: `UPDATE tmib_bitem AS tgt
      JOIN (
          SELECT bking_bitem, SUM(bking_pnqty)as bking_pnqty
        FROM tmpb_bking bk
        JOIN tmpb_pmstr str ON bk.bking_pmstr = str.id
        WHERE str.pmstr_bsins = ?
        GROUP BY bking_bitem
        )AS src
      ON tgt.id = src.bking_bitem
      SET tgt.bitem_pbqty = src.bking_pnqty`,
      params: [id],
      label: `Update Purchase Booking Quantity`,
    });

    scripts.push({
      sql: `UPDATE tmib_bitem tgt
              JOIN (
              SELECT recpt.recpt_bitem,SUM(recpt.recpt_ohqty) AS recpt_ohqty
              FROM tmpb_recpt recpt
              JOIN tmpb_pmstr str ON recpt.recpt_pmstr = str.id
              WHERE recpt.recpt_ohqty > 0
              AND str.pmstr_bsins = ?
              GROUP BY recpt.recpt_bitem
              )src
              ON tgt.id = src.recpt_bitem
              SET tgt.bitem_gstkq = src.recpt_ohqty`,
      params: [id],
      label: `Update Business Item Good Stock Quantity`,
    });

    await dbRunAll(scripts);
    res.json({
      success: true,
      message: "Purchase Booking and Receipt Generated successfully",
      data: req.body,
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
