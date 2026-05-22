import { Router } from 'express';
import { query } from '../db.js';
import { logActivity } from '../activityLogger.js';

const router = Router();

// GET /api/tables — list all tables ordered by sequence
router.get('/', async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM t_tables ORDER BY sequence ASC, id ASC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/tables/:id — get a single table
router.get('/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM t_tables WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Table not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/tables — create a new table
router.post('/', async (req, res) => {
  const { table_name, description, sequence } = req.body;
  if (!table_name?.trim()) {
    return res.status(400).json({ error: 'table_name is required' });
  }
  try {
    const result = await query(
      `INSERT INTO t_tables (table_name, description, sequence)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [table_name.trim(), description || null, sequence ?? 0]
    );
    const row = result.rows[0];
    await logActivity('table', row.id, row.table_name, 'created', { table_name: row.table_name });
    res.status(201).json(row);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: `Table name "${table_name}" already exists` });
    }
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/tables/:id — update a table
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { table_name, description, sequence } = req.body;
  if (!table_name?.trim()) {
    return res.status(400).json({ error: 'table_name is required' });
  }
  try {
    const result = await query(
      `UPDATE t_tables
       SET table_name = $1, description = $2, sequence = $3
       WHERE id = $4
       RETURNING *`,
      [table_name.trim(), description || null, sequence ?? 0, id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Table not found' });
    const row = result.rows[0];
    await logActivity('table', row.id, row.table_name, 'updated', { table_name: row.table_name });
    res.json(row);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: `Table name "${table_name}" already exists` });
    }
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/tables/:id — delete a table (cascades columns + table_features via FK)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query('DELETE FROM t_tables WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Table not found' });
    const row = result.rows[0];
    await logActivity('table', row.id, row.table_name, 'deleted', { table_name: row.table_name });
    res.json({ message: 'Table deleted successfully', deleted: row });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
