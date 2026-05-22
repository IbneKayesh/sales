import express from 'express';
import { pool } from './db.js';

const router = express.Router();

router.post('/list', async (req, res) => {
  try {
    const { featureId } = req.body || {};
    if (!featureId) return res.status(400).json({ error: 'featureId required' });

    const q = `SELECT t.id, t.table_id, t.feature_id, tb.table_name, tb.table_description
      FROM t_feature_table t
      JOIN t_tables tb ON tb.id = t.table_id
      WHERE t.feature_id = $1
      ORDER BY t.created_at DESC`;

    const { rows } = await pool.query(q, [featureId]);
    res.json({ featureTables: rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;

