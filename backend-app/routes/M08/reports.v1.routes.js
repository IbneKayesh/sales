const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");
const { GenNewCode } = require("../../db/genHelper");
const { getJournalData, getContactsLedger, getPartyLedger } = require("../../db/journalService");

// get-journal-data
router.post("/get-journal-data", async (req, res) => {
  try {
    const { user_s, user_c, user_b, user_d, fsyar, acprd } = req.body;

    // Validate input
    if (!user_c || !user_b || !user_d || !fsyar || !acprd) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const rows = await getJournalData(user_c, user_b, user_d, fsyar, acprd);
    res.json({
      success: true,
      message: "Query executed successfully.",
      data: rows,
    });
  } catch (error) {
    console.error("database action error:", error);
    return res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: [],
    });
  }
});

// get-contacts-ledger
router.post("/get-contacts-ledger", async (req, res) => {
  try {
    const { cntct_id, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!cntct_id || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const rows = await getContactsLedger(cntct_id, user_c);
    res.json({
      success: true,
      message: "Query executed successfully.",
      data: rows,
    });
  } catch (error) {
    console.error("database action error:", error);
    return res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: [],
    });
  }
});

// get-party-ledger
router.post("/get-party-ledger", async (req, res) => {
  try {
    const { party_id, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!party_id || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const rows = await getPartyLedger(party_id, user_c);
    res.json({
      success: true,
      message: "Query executed successfully.",
      data: rows,
    });
  } catch (error) {
    console.error("database action error:", error);
    return res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: [],
    });
  }
});

module.exports = router;
