const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManager");
const { v4: uuidv4 } = require("uuid");
const closingSql = require("./closing.sql.js");

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
    scripts.push(
      closingSql.inventory.tmib_bitem.reset_purchase_booking_qty(id),
    );
    scripts.push(
      closingSql.inventory.tmib_bitem.update_purchase_booking_qty(id),
    );
    scripts.push(closingSql.purchase.tmpb_mbkng.update_payment_status(id));

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
    scripts.push(
      closingSql.inventory.tmib_bitem.reset_purchase_booking_and_good_stock_qty(
        id,
      ),
    );
    scripts.push(
      closingSql.purchase.tmpb_cbkng.update_received_and_pending_qty(id),
    );
    scripts.push(
      closingSql.inventory.tmib_bitem.update_purchase_booking_qty(id),
    );

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
    scripts.push(closingSql.purchase.tmpb_mbkng.update_payble_dues(id));
    scripts.push(
      closingSql.purchase.tmpb_mbkng.update_payment_status_by_refId(id),
    );

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

// generate
router.post("/accounts-ledger", async (req, res) => {
  try {
    const { id } = req.body;
    //console.log("id: " + id);

    // Validate input
    if (!id) {
      return res.json({
        success: false,
        message: "User ID is required",
        data: null,
      });
    }

    //database action
    const script = closingSql.accounts.tmtb_bacts.update_current_balance(id);
    await dbRun(script.sql, script.params, script.label);

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

//purchase invoice
router.post("/purchase-invoice", async (req, res) => {
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
    // Example: Purchase invoice also updates good stock quantity
    scripts.push(closingSql.inventory.tmib_bitem.update_good_stock_qty(id));

    // Add other relevant scripts here...

    await dbRunAll(scripts);
    res.json({
      success: true,
      message: "Purchase Invoice generated successfully",
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
