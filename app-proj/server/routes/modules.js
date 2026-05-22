import { Router } from 'express';
import { query } from '../db.js';
import { logActivity } from '../activityLogger.js';

const router = Router();

const FIELDS = `id, project_id, name, description, sequence, status, priority, owner,
  start_date, end_date, progress, created_at, updated_at`;

router.get('/', async (req, res) => {
  const { project_id } = req.query;
  try {
    let result;
    if (project_id) {
      result = await query(
        `SELECT m.*, p.name as project_name 
         FROM t_modules m 
         JOIN t_projects p ON m.project_id = p.id 
         WHERE m.project_id = $1 
         ORDER BY m.sequence ASC, m.id ASC`,
        [project_id]
      );
    } else {
      result = await query(
        `SELECT m.*, p.name as project_name 
         FROM t_modules m 
         JOIN t_projects p ON m.project_id = p.id 
         ORDER BY m.sequence ASC, m.id ASC`
      );
    }
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { project_id, name, description, sequence, status, priority, owner, start_date, end_date, progress } = req.body;
  if (!project_id || !name) {
    return res.status(400).json({ error: 'project_id and name are required' });
  }
  try {
    const result = await query(
      `INSERT INTO t_modules (project_id, name, description, sequence, status, priority, owner, start_date, end_date, progress, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW()) RETURNING ${FIELDS}`,
      [project_id, name, description, sequence || 0, status || 'planning', priority || 'medium', owner || null,
       start_date || null, end_date || null, progress ?? 0]
    );
    const row = result.rows[0];
    await logActivity('module', row.id, row.name, 'created', { status: row.status, priority: row.priority });
    res.status(201).json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { project_id, name, description, sequence, status, priority, owner, start_date, end_date, progress } = req.body;
  if (!project_id || !name) {
    return res.status(400).json({ error: 'project_id and name are required' });
  }
  try {
    const result = await query(
      `UPDATE t_modules SET project_id=$1, name=$2, description=$3, sequence=$4, status=$5, priority=$6,
       owner=$7, start_date=$8, end_date=$9, progress=$10, updated_at=NOW()
       WHERE id=$11 RETURNING ${FIELDS}`,
      [project_id, name, description, sequence || 0, status || 'planning', priority || 'medium', owner || null,
       start_date || null, end_date || null, progress ?? 0, id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Module not found' });
    const row = result.rows[0];
    await logActivity('module', row.id, row.name, 'updated', { status: row.status, priority: row.priority, progress: row.progress });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query('DELETE FROM t_modules WHERE id=$1 RETURNING id, name', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Module not found' });
    const row = result.rows[0];
    await logActivity('module', row.id, row.name, 'deleted', {});
    res.json({ message: 'Module deleted successfully', deleted: row });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
