// server/taskRoute.js
import express from 'express';
import { pool } from './db.js';

const router = express.Router();

// get-by-feature
router.post('/get-by-feature', async (req, res) => {
  const { feature_id } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM t_task WHERE feature_id = $1 ORDER BY created_at ASC',
      [feature_id]
    );
    res.json({ success: true, message: "Ok", data: result.rows });
  } catch (error) {
   res.status(500).json({ success: false, message: error.message, data: [] });
  }
});

// add
router.post('/add', async (req, res) => {
  const { id, feature_id, task_name, is_done } = req.body;
  try {
    const query = `
      INSERT INTO t_task (id, feature_id, task_name, is_done)
      VALUES ($1, $2, $3, COALESCE($4, FALSE))
      RETURNING *
    `;
    const result = await pool.query(query, [id, feature_id, task_name, is_done]);
    res.json({ success: true, message: "Ok", data: result.rows[0] });
  } catch (error) {
   res.status(500).json({ success: false, message: error.message, data: [] });
  }
});

// edit
router.post('/edit', async (req, res) => {
  const { id, task_name, is_done } = req.body;
  try {
    const query = `
      UPDATE t_task 
      SET task_name = $2, is_done = $3, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(query, [id, task_name, is_done]);
    res.json({ success: true, message: "Ok", data: result.rows[0] });
  } catch (error) {
   res.status(500).json({ success: false, message: error.message, data: [] });
  }
});

// delete
router.post('/delete', async (req, res) => {
  const { id } = req.body;
  try {
    await pool.query('DELETE FROM t_task WHERE id = $1', [id]);
    res.json({ success: true, message: "Task deleted successfully", data: [] });
  } catch (error) {
   res.status(500).json({ success: false, message: error.message, data: [] });
  }
});

export default router;