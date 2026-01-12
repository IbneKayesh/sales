const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManager");

// get all notes for a user
router.post("/", async (req, res) => {
  try {
    const { notes_users } = req.body;

    // Validate input
    if (!notes_users) {
      return res.json({
        success: false,
        message: "User ID is required",
        data: null,
      });
    }

    // database action
    const sql = `SELECT tbl.*, 0 as edit_stop
      FROM tmub_notes tbl
      WHERE tbl.notes_users = ?
      ORDER BY tbl.notes_dudat DESC`;
    const params = [notes_users];

    const rows = await dbGetAll(sql, params, `Get notes for ${notes_users}`);
    res.json({
      success: true,
      message: "Notes fetched successfully",
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

// create note
router.post("/create", async (req, res) => {
  try {
    const {
      id,
      notes_users,
      notes_title,
      notes_descr,
      notes_dudat,
      notes_stat,
      user_id,
    } = req.body;

    // Validate input
    if (!id || !notes_users || !notes_title) {
      return res.json({
        success: false,
        message: "ID, User ID, and Title are required",
        data: null,
      });
    }

    // database action
    const sql = `INSERT INTO tmub_notes
    (id, notes_users, notes_title, notes_descr, notes_dudat, notes_stat, notes_crusr, notes_upusr)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [
      id,
      notes_users,
      notes_title,
      notes_descr,
      notes_dudat || new Date().toISOString().slice(0, 19).replace("T", " "),
      notes_stat || "In Progress",
      user_id,
      user_id,
    ];

    await dbRun(sql, params, `Create note for ${notes_users}`);
    res.json({
      success: true,
      message: "Note created successfully",
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

// update note
router.post("/update", async (req, res) => {
  try {
    const {
      id,
      notes_title,
      notes_descr,
      notes_dudat,
      notes_stat,
      notes_actve,
      user_id,
    } = req.body;

    // Validate input
    if (!id || !notes_title) {
      return res.json({
        success: false,
        message: "ID and Title are required",
        data: null,
      });
    }

    // database action
    const sql = `UPDATE tmub_notes
    SET notes_title = ?,
    notes_descr = ?,
    notes_dudat = ?,
    notes_stat = ?,
    notes_actve = ?,
    notes_upusr = ?,
    notes_rvnmr = notes_rvnmr + 1
    WHERE id = ?`;
    const params = [
      notes_title,
      notes_descr,
      notes_dudat,
      notes_stat || "In Progress",
      notes_actve !== undefined ? notes_actve : 1,
      user_id,
      id,
    ];

    await dbRun(sql, params, `Update note ${id}`);
    res.json({
      success: true,
      message: "Note updated successfully",
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

// delete/toggle active note
router.post("/delete", async (req, res) => {
  try {
    const { id } = req.body;

    // Validate input
    if (!id) {
      return res.json({
        success: false,
        message: "Note ID is required",
        data: null,
      });
    }

    // database action
    const sql = `UPDATE tmub_notes
    SET notes_actve = 1 - notes_actve
    WHERE id = ?`;
    const params = [id];

    await dbRun(sql, params, `Toggle active for note ${id}`);
    res.json({
      success: true,
      message: "Note status updated successfully",
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
