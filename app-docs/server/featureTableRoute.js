// server/featureTableRoute.js
import express from 'express';
import { pool } from './db.js';

const router = express.Router();

// get-by-feature
router.post('/get-by-feature', async (req, res) => {
  const { feature_id } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM t_feature_table WHERE feature_id = $1 ORDER BY created_at DESC',
      [feature_id]
    );
    res.json({ ok: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// get-by-table
router.post('/get-by-table', async (req, res) => {
  const { table_id } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM t_feature_table WHERE table_id = $1 ORDER BY created_at DESC',
      [table_id]
    );
    res.json({ ok: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
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
    res.json({ ok: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// delete
router.post('/delete', async (req, res) => {
  const { id } = req.body;
  try {
    await pool.query('DELETE FROM t_feature_table WHERE id = $1', [id]);
    res.json({ ok: true, message: 'Feature-Table mapping deleted successfully' });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

export default router;