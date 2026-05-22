import { Router } from 'express';
import { query } from '../db.js';
import { logActivity } from '../activityLogger.js';

const router = Router();

// GET /api/columns — list all columns, optionally filtered by ?table_id=X
router.get('/', async (req, res) => {
  try {
    let result;
    if (req.query.table_id) {
      result = await query(
        'SELECT * FROM t_columns WHERE table_id = $1 ORDER BY sequence ASC, id ASC',
        [req.query.table_id]
      );
    } else {
      result = await query(
        'SELECT * FROM t_columns ORDER BY table_id ASC, sequence ASC, id ASC'
      );
    }
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/columns/:id — get a single column
router.get('/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM t_columns WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Column not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/columns — create a new column
router.post('/', async (req, res) => {
  const {
    table_id,
    column_name,
    data_type,
    length,
    nullable,
    default_value,
    is_primary,
    is_foreign,
    references_table,
    sequence,
  } = req.body;

  if (!table_id || !column_name?.trim() || !data_type) {
    return res.status(400).json({ error: 'table_id, column_name, and data_type are required' });
  }

  try {
    const result = await query(
      `INSERT INTO t_columns
         (table_id, column_name, data_type, length, nullable, default_value,
          is_primary, is_foreign, references_table, sequence)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        table_id,
        column_name.trim(),
        data_type,
        length || null,
        nullable !== false,
        default_value || null,
        is_primary === true,
        is_foreign === true,
        references_table || null,
        sequence ?? 0,
      ]
    );
    const row = result.rows[0];
    await logActivity('column', row.id, row.column_name, 'created', {
      column_name: row.column_name,
      table_id: row.table_id,
      data_type: row.data_type,
    });
    res.status(201).json(row);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: `Column "${column_name}" already exists in this table` });
    }
    if (err.code === '23503') {
      return res.status(400).json({ error: 'Referenced table_id does not exist' });
    }
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/columns/:id — update a column
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    table_id,
    column_name,
    data_type,
    length,
    nullable,
    default_value,
    is_primary,
    is_foreign,
    references_table,
    sequence,
  } = req.body;

  if (!column_name?.trim() || !data_type) {
    return res.status(400).json({ error: 'column_name and data_type are required' });
  }

  try {
    const result = await query(
      `UPDATE t_columns
       SET column_name = $1, data_type = $2, length = $3, nullable = $4,
           default_value = $5, is_primary = $6, is_foreign = $7,
           references_table = $8, sequence = $9
       WHERE id = $10
       RETURNING *`,
      [
        column_name.trim(),
        data_type,
        length || null,
        nullable !== false,
        default_value || null,
        is_primary === true,
        is_foreign === true,
        references_table || null,
        sequence ?? 0,
        id,
      ]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Column not found' });
    const row = result.rows[0];
    await logActivity('column', row.id, row.column_name, 'updated', {
      column_name: row.column_name,
      data_type: row.data_type,
    });
    res.json(row);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: `Column "${column_name}" already exists in this table` });
    }
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/columns/:id — delete a column
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query('DELETE FROM t_columns WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Column not found' });
    const row = result.rows[0];
    await logActivity('column', row.id, row.column_name, 'deleted', {
      column_name: row.column_name,
      table_id: row.table_id,
    });
    res.json({ message: 'Column deleted successfully', deleted: row });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
