import { Router } from 'express';
import { query } from '../db.js';
import { logActivity } from '../activityLogger.js';

const router = Router();

const FIELDS = `id, submodule_id, feature_name, description, status, priority, owner,
  start_date, end_date, progress, created_at, updated_at`;

router.get('/', async (req, res) => {
  const { submodule_id } = req.query;
  try {
    let result;
    if (submodule_id) {
      result = await query(
        `SELECT f.*, s.name as submodule_name 
         FROM t_features f 
         JOIN t_submodules s ON f.submodule_id = s.id 
         WHERE f.submodule_id = $1 
         ORDER BY f.id ASC`,
        [submodule_id]
      );
    } else {
      result = await query(
        `SELECT f.*, s.name as submodule_name 
         FROM t_features f 
         JOIN t_submodules s ON f.submodule_id = s.id 
         ORDER BY f.id ASC`
      );
    }
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { submodule_id, feature_name, description, status, priority, owner, start_date, end_date, progress } = req.body;
  if (!submodule_id || !feature_name) {
    return res.status(400).json({ error: 'submodule_id and feature_name are required' });
  }
  try {
    const result = await query(
      `INSERT INTO t_features (submodule_id, feature_name, description, status, priority, owner, start_date, end_date, progress, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW()) RETURNING ${FIELDS}`,
      [submodule_id, feature_name, description, status || 'planned', priority || 'medium', owner || null,
       start_date || null, end_date || null, progress ?? 0]
    );
    const row = result.rows[0];
    await logActivity('feature', row.id, row.feature_name, 'created', { status: row.status, priority: row.priority });
    res.status(201).json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { submodule_id, feature_name, description, status, priority, owner, start_date, end_date, progress } = req.body;
  if (!submodule_id || !feature_name) {
    return res.status(400).json({ error: 'submodule_id and feature_name are required' });
  }
  try {
    const result = await query(
      `UPDATE t_features SET submodule_id=$1, feature_name=$2, description=$3, status=$4, priority=$5,
       owner=$6, start_date=$7, end_date=$8, progress=$9, updated_at=NOW()
       WHERE id=$10 RETURNING ${FIELDS}`,
      [submodule_id, feature_name, description, status || 'planned', priority || 'medium', owner || null,
       start_date || null, end_date || null, progress ?? 0, id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Feature not found' });
    const row = result.rows[0];
    await logActivity('feature', row.id, row.feature_name, 'updated', { status: row.status, priority: row.priority, progress: row.progress });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query('DELETE FROM t_features WHERE id=$1 RETURNING id, feature_name', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Feature not found' });
    const row = result.rows[0];
    await logActivity('feature', row.id, row.feature_name, 'deleted', {});
    res.json({ message: 'Feature deleted successfully', deleted: row });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
