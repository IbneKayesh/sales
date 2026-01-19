const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManager");

// get all tickets for a user
router.post("/", async (req, res) => {
  try {
    const { tickt_users } = req.body;

    // Validate input
    if (!tickt_users) {
      return res.json({
        success: false,
        message: "User ID is required",
        data: null,
      });
    }

    // database action
    const sql = `SELECT tbl.*, 0 as edit_stop
      FROM tmub_tickt tbl
      WHERE tbl.tickt_users = ?
      ORDER BY tbl.tickt_cmdat DESC`;
    const params = [tickt_users];

    const rows = await dbGetAll(sql, params, `Get tickets for ${tickt_users}`);
    res.json({
      success: true,
      message: "Tickets fetched successfully",
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

// create ticket
router.post("/create", async (req, res) => {
  try {
    const {
      id,
      tickt_users,
      tickt_types,
      tickt_cmnte,
      tickt_cmdat,
      tickt_cmsts,
      user_id,
    } = req.body;

    // Validate input
    if (!id || !tickt_users || !tickt_cmnte) {
      return res.json({
        success: false,
        message: "ID, User ID, and Comment are required",
        data: null,
      });
    }

    // database action
    const sql = `INSERT INTO tmub_tickt
    (id, tickt_users, tickt_types, tickt_cmnte, tickt_cmdat, tickt_cmsts, tickt_crusr, tickt_upusr)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [
      id,
      tickt_users,
      tickt_types,
      tickt_cmnte,
      tickt_cmdat || new Date().toISOString().slice(0, 19).replace("T", " "),
      tickt_cmsts || "Opened",
      user_id,
      user_id,
    ];

    await dbRun(sql, params, `Create ticket for ${tickt_users}`);
    res.json({
      success: true,
      message: "Ticket created successfully",
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

// update ticket
router.post("/update", async (req, res) => {
  try {
    const {
      id,
      tickt_types,
      tickt_cmnte,
      tickt_cmdat,
      tickt_rsnte,
      tickt_rspnt,
      tickt_cmsts,
      tickt_rsdat,
      tickt_actve,
      user_id,
    } = req.body;

    // Validate input
    if (!id || !tickt_cmnte) {
      return res.json({
        success: false,
        message: "ID and Comment are required",
        data: null,
      });
    }

    // database action
    const sql = `UPDATE tmub_tickt
    SET tickt_types = ?,
    tickt_cmnte = ?,
    tickt_cmdat = ?,
    tickt_rsnte = ?,
    tickt_rspnt = ?,
    tickt_cmsts = ?,
    tickt_rsdat = ?,
    tickt_actve = ?,
    tickt_upusr = ?,
    tickt_rvnmr = tickt_rvnmr + 1
    WHERE id = ?`;
    const params = [
      tickt_types,
      tickt_cmnte,
      tickt_cmdat,
      tickt_rsnte,
      tickt_rspnt || 0,
      tickt_cmsts || "Opened",
      tickt_rsdat,
      tickt_actve !== undefined ? tickt_actve : 1,
      user_id,
      id,
    ];

    await dbRun(sql, params, `Update ticket ${id}`);
    res.json({
      success: true,
      message: "Ticket updated successfully",
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

// delete/toggle active ticket
router.post("/delete", async (req, res) => {
  try {
    const { id } = req.body;

    // Validate input
    if (!id) {
      return res.json({
        success: false,
        message: "Ticket ID is required",
        data: null,
      });
    }

    // database action
    const sql = `UPDATE tmub_tickt
    SET tickt_actve = 1 - tickt_actve
    WHERE id = ?`;
    const params = [id];

    await dbRun(sql, params, `Toggle active for ticket ${id}`);
    res.json({
      success: true,
      message: "Ticket status updated successfully",
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
