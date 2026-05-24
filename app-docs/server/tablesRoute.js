// server/tableRoute.js
import express from "express";
import { pool } from "./db.js";
import { normalizeTableBody } from "./normalize.js";

const router = express.Router();

// get-all
router.post("/get-all", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM t_tables ORDER BY serial_number ASC, created_at DESC",
    );
    res.json({ success: true, message: "Ok", data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: [] });
  }
});

// add
router.post("/add", async (req, res) => {
  const { id, table_name, table_description, serial_number } =
    normalizeTableBody(req.body);
  if (!table_name) {
    return res.status(400).json({
      success: false,
      message: "table_name is required",
      data: [],
    });
  }
  try {
    const query = `
      INSERT INTO t_tables (id, table_name, table_description, serial_number)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await pool.query(query, [
      id,
      table_name,
      table_description,
      serial_number,
    ]);
    res.json({ success: true, message: "Ok", data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: [] });
  }
});

// edit
router.post("/edit", async (req, res) => {
  const { id, table_name, table_description, serial_number } =
    normalizeTableBody(req.body);
  if (!table_name) {
    return res.status(400).json({
      success: false,
      message: "table_name is required",
      data: [],
    });
  }
  try {
    const query = `
      UPDATE t_tables 
      SET table_name = $2, table_description = $3, serial_number = $4, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(query, [
      id,
      table_name,
      table_description,
      serial_number,
    ]);
    res.json({ success: true, message: "Ok", data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: [] });
  }
});

// delete
router.post("/delete", async (req, res) => {
  const { id } = req.body;
  try {
    await pool.query("DELETE FROM t_tables WHERE id = $1", [id]);
    res.json({
      success: true,
      message: "Table record deleted successfully",
      data: [],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: [] });
  }
});

export default router;
