// server/featureTableRoute.js
import express from 'express';
import { pool } from './db.js';

const router = express.Router();


// get-by-table
router.post('/get-by-table', async (req, res) => {
  const { table_id } = req.body;
  try {
    const result = await pool.query(
      `SELECT ft.*, f.feature_name
       FROM t_feature_table ft
       JOIN t_features f ON ft.feature_id = f.id
       WHERE ft.table_id = $1
       ORDER BY ft.created_at DESC`,
      [table_id]
    );
    res.json({ success: true, message: "Ok", data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: [] });
  }
});

//get-by-feature-without-tables
router.post('/get-by-feature-without-tables', async (req, res) => {
  const { feature_id } = req.body;
  try {
    const result = await pool.query(
      `SELECT tb.*
      FROM t_tables tb
      LEFT JOIN t_feature_table ft ON tb.id = ft.table_id
      AND ft.feature_id = $1
      WHERE ft.table_id is null
      ORDER BY tb.serial_number ASC`,
      [feature_id]
    );
    res.json({ success: true, message: "Ok", data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: [] });
  }
});


// get-by-feature-with-tables
router.post('/get-by-feature-with-tables', async (req, res) => {
  const { feature_id } = req.body;
  try {
    const result = await pool.query(
      `SELECT ft.*, t.table_name
       FROM t_feature_table ft
       JOIN t_tables t ON ft.table_id = t.id
       WHERE ft.feature_id = $1
       ORDER BY ft.created_at DESC`,
      [feature_id]
    );
    res.json({ success: true, message: "Ok", data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: [] });
  }
});


// add
router.post('/add', async (req, res) => {
  const { id, feature_id, table_id } = req.body;
  try {
    const query = `
      INSERT INTO t_feature_table (id, feature_id, table_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await pool.query(query, [id, feature_id, table_id]);
    res.json({ success: true, message: "Ok", data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: [] });
  }
});

// delete
router.post('/delete', async (req, res) => {
  const { id } = req.body;
  try {
    await pool.query('DELETE FROM t_feature_table WHERE id = $1', [id]);
    res.json({ success: true, message: "Feature-Table mapping deleted successfully", data: [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: [] });
  }
});

export default router;