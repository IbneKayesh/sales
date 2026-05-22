import { Router } from 'express';
import { query } from '../db.js';
import { logActivity } from '../activityLogger.js';

const router = Router();

const FIELDS = `id, name, description, sequence, status, priority, owner,
  start_date, end_date, progress, created_at, updated_at`;

router.get('/', async (req, res) => {
  try {
    const result = await query(`SELECT ${FIELDS} FROM t_projects ORDER BY sequence ASC, id ASC`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { name, description, sequence, status, priority, owner, start_date, end_date, progress } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  try {
    const result = await query(
      `INSERT INTO t_projects (name, description, sequence, status, priority, owner, start_date, end_date, progress, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW()) RETURNING ${FIELDS}`,
      [name, description, sequence || 0, status || 'planning', priority || 'medium', owner || null,
       start_date || null, end_date || null, progress ?? 0]
    );
    const row = result.rows[0];
    await logActivity('project', row.id, row.name, 'created', { status: row.status, priority: row.priority });
    res.status(201).json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, sequence, status, priority, owner, start_date, end_date, progress } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  try {
    const result = await query(
      `UPDATE t_projects SET name=$1, description=$2, sequence=$3, status=$4, priority=$5,
       owner=$6, start_date=$7, end_date=$8, progress=$9, updated_at=NOW()
       WHERE id=$10 RETURNING ${FIELDS}`,
      [name, description, sequence || 0, status || 'planning', priority || 'medium', owner || null,
       start_date || null, end_date || null, progress ?? 0, id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Project not found' });
    const row = result.rows[0];
    await logActivity('project', row.id, row.name, 'updated', { status: row.status, priority: row.priority, progress: row.progress });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query('DELETE FROM t_projects WHERE id=$1 RETURNING id, name', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Project not found' });
    const row = result.rows[0];
    await logActivity('project', row.id, row.name, 'deleted', {});
    res.json({ message: 'Project deleted successfully', deleted: row });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
