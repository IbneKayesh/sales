import express from 'express';
import { pool } from './db.js';

const router = express.Router();

function getBody(req) {
  return req.body || {};
}

// features/list
router.post('/list', async (req, res) => {
  try {
    const { parentFeatureId } = getBody(req);
    const where = parentFeatureId ? 'feature_id = $1' : 'TRUE';
    const params = parentFeatureId ? [parentFeatureId] : [];
    const q = `SELECT * FROM t_features WHERE ${where} ORDER BY serial_number ASC NULLS LAST, created_at DESC`;
    const { rows } = await pool.query(q, params);
    res.json({ features: rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/create', async (req, res) => {
  try {
    const {
      feature_name,
      feature_type,
      feature_description,
      feature_status,
      feature_priority,
      work_type,
      work_user,
      parent_feature_id = null,
      serial_number = null,
      start_date = null,
      end_date = null,
      progress_percent = null,
    } = getBody(req);

    if (!feature_name || !feature_type || !feature_status || !feature_priority || !work_type || !work_user) {
      return res.status(400).json({ error: 'Missing required feature fields' });
    }

    const id = `feat_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const q = `INSERT INTO t_features (id, feature_id, feature_type, feature_name, feature_description, feature_status, feature_priority, work_type, work_user, start_date, end_date, progress_percent, serial_number)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`;

    const params = [
      id,
      parent_feature_id,
      feature_type,
      feature_name,
      feature_description || null,
      feature_status,
      feature_priority,
      work_type,
      work_user,
      start_date,
      end_date,
      progress_percent,
      serial_number,
    ];
    const { rows } = await pool.query(q, params);
    res.json({ feature: rows[0] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/update', async (req, res) => {
  try {
    const { featureId, patch } = getBody(req);
    if (!featureId) return res.status(400).json({ error: 'featureId required' });

    const p = patch || {};
    const fields = [];
    const params = [];
    let idx = 1;

    for (const key of [
      'feature_name',
      'feature_type',
      'feature_description',
      'feature_status',
      'feature_priority',
      'work_type',
      'work_user',
      'start_date',
      'end_date',
      'progress_percent',
      'serial_number',
      'parent_feature_id',
    ]) {
      if (Object.prototype.hasOwnProperty.call(p, key)) {
        if (key === 'parent_feature_id') {
          fields.push(`feature_id = $${idx++}`);
          params.push(p[key]);
        } else {
          fields.push(`${key} = $${idx++}`);
          params.push(p[key]);
        }
      }
    }

    if (!fields.length) return res.json({ feature: null });

    params.push(featureId);
    const q = `UPDATE t_features SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${idx} RETURNING *`;
    const { rows } = await pool.query(q, params);
    res.json({ feature: rows[0] || null });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/delete', async (req, res) => {
  try {
    const { featureId } = getBody(req);
    if (!featureId) return res.status(400).json({ error: 'featureId required' });

    await pool.query('DELETE FROM t_features WHERE id = $1', [featureId]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;

