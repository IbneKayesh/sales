import { Router } from 'express';
import { query } from '../db.js';
import { logActivity } from '../activityLogger.js';

const router = Router();

const FIELDS = `id, module_id, name, description, sequence, status, priority, owner,
  start_date, end_date, progress, created_at, updated_at`;

router.get('/', async (req, res) => {
  const { module_id, project_id } = req.query;
  try {
    let result;
    if (module_id) {
      result = await query(
        `SELECT s.*, m.name as module_name, p.name as project_name
         FROM t_submodules s
         JOIN t_modules m ON s.module_id = m.id
         JOIN t_projects p ON m.project_id = p.id
         WHERE s.module_id = $1
         ORDER BY s.sequence ASC, s.id ASC`,
        [module_id]
      );
    } else if (project_id) {
      result = await query(
        `SELECT s.*, m.name as module_name, p.name as project_name
         FROM t_submodules s
         JOIN t_modules m ON s.module_id = m.id
         JOIN t_projects p ON m.project_id = p.id
         WHERE m.project_id = $1
         ORDER BY s.sequence ASC, s.id ASC`,
        [project_id]
      );
    } else {
      result = await query(
        `SELECT s.*, m.name as module_name, p.name as project_name
         FROM t_submodules s
         JOIN t_modules m ON s.module_id = m.id
         JOIN t_projects p ON m.project_id = p.id
         ORDER BY s.sequence ASC, s.id ASC`
      );
    }
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { module_id, name, description, sequence, status, priority, owner, start_date, end_date, progress } = req.body;
  if (!module_id || !name) {
    return res.status(400).json({ error: 'module_id and name are required' });
  }
  try {
    const result = await query(
      `INSERT INTO t_submodules (module_id, name, description, sequence, status, priority, owner, start_date, end_date, progress, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW()) RETURNING ${FIELDS}`,
      [module_id, name, description, sequence || 0, status || 'planning', priority || 'medium', owner || null,
       start_date || null, end_date || null, progress ?? 0]
    );
    const row = result.rows[0];
    await logActivity('submodule', row.id, row.name, 'created', { status: row.status, priority: row.priority });
    res.status(201).json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { module_id, name, description, sequence, status, priority, owner, start_date, end_date, progress } = req.body;
  if (!module_id || !name) {
    return res.status(400).json({ error: 'module_id and name are required' });
  }
  try {
    const result = await query(
      `UPDATE t_submodules SET module_id=$1, name=$2, description=$3, sequence=$4, status=$5, priority=$6,
       owner=$7, start_date=$8, end_date=$9, progress=$10, updated_at=NOW()
       WHERE id=$11 RETURNING ${FIELDS}`,
      [module_id, name, description, sequence || 0, status || 'planning', priority || 'medium', owner || null,
       start_date || null, end_date || null, progress ?? 0, id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Submodule not found' });
    const row = result.rows[0];
    await logActivity('submodule', row.id, row.name, 'updated', { status: row.status, priority: row.priority, progress: row.progress });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query('DELETE FROM t_submodules WHERE id=$1 RETURNING id, name', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Submodule not found' });
    const row = result.rows[0];
    await logActivity('submodule', row.id, row.name, 'deleted', {});
    res.json({ message: 'Submodule deleted successfully', deleted: row });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
