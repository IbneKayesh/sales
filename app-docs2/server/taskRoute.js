import express from 'express';
import { pool } from './db.js';

const router = express.Router();

router.post('/list', async (req, res) => {
  try {
    const { featureId } = req.body || {};
    if (!featureId) return res.status(400).json({ error: 'featureId required' });

    // Filter tasks by feature_id (t_task.feature_id exists in schema)
    const q = `SELECT * FROM t_task WHERE feature_id = $1 ORDER BY created_at DESC`;
    const { rows } = await pool.query(q, [featureId]);
    res.json({ tasks: rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/create', async (req, res) => {
  try {
    const { featureId, task } = req.body || {};
    if (!featureId || !task?.task_name) return res.status(400).json({ error: 'featureId and task_name required' });

    const id = `task_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const q = `INSERT INTO t_task (id, feature_id, task_name, is_done) VALUES ($1,$2,$3,$4) RETURNING *`;
    const { rows } = await pool.query(q, [id, featureId, task.task_name, !!task.is_done]);
    res.json({ task: rows[0] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/update', async (req, res) => {
  try {
    const { taskId, patch } = req.body || {};
    if (!taskId) return res.status(400).json({ error: 'taskId required' });

    const p = patch || {};
    const fields = [];
    const params = [];
    let idx = 1;

    for (const key of ['task_name', 'is_done']) {
      if (Object.prototype.hasOwnProperty.call(p, key)) {
        fields.push(`${key} = $${idx++}`);
        params.push(p[key]);
      }
    }

    if (!fields.length) return res.json({ ok: true });

    params.push(taskId);
    const q = `UPDATE t_task SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${idx} RETURNING *`;
    const { rows } = await pool.query(q, params);
    res.json({ task: rows[0] || null });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/delete', async (req, res) => {
  try {
    const { taskId } = req.body || {};
    if (!taskId) return res.status(400).json({ error: 'taskId required' });
    await pool.query('DELETE FROM t_task WHERE id=$1', [taskId]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;

