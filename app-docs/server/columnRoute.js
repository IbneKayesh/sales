// server/columnRoute.js
import express from 'express';
import { pool } from './db.js';

const router = express.Router();

// get-by-table
router.post('/get-by-table', async (req, res) => {
  const { table_id } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM t_columns WHERE table_id = $1 ORDER BY serial_number ASC, created_at DESC',
      [table_id]
    );
    res.json({ ok: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// add
router.post('/add', async (req, res) => {
  const {
    id, table_id, column_name, data_type, data_length,
    is_nullable, default_value, is_primary, is_foreign,
    references_table, references_column, column_description, serial_number
  } = req.body;

  try {
    const query = `
      INSERT INTO t_columns (
        id, table_id, column_name, data_type, data_length,
        is_nullable, default_value, is_primary, is_foreign,
        references_table, references_column, column_description, serial_number
      ) VALUES ($1, $2, $3, $4, $5, COALESCE($6, TRUE), COALESCE($7, NULL), COALESCE($8, FALSE), COALESCE($9, FALSE), $10, $11, $12, $13)
      RETURNING *
    `;
    const values = [
      id, table_id, column_name, data_type, data_length,
      is_nullable, default_value, is_primary, is_foreign,
      references_table, references_column, column_description, serial_number
    ];
    const result = await pool.query(query, values);
    res.json({ ok: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// edit
router.post('/edit', async (req, res) => {
  const {
    id, column_name, data_type, data_length,
    is_nullable, default_value, is_primary, is_foreign,
    references_table, references_column, column_description, serial_number
  } = req.body;

  try {
    const query = `
      UPDATE t_columns SET
        column_name = $2, data_type = $3, data_length = $4,
        is_nullable = $5, default_value = $6, is_primary = $7, is_foreign = $8,
        references_table = $9, references_column = $10, column_description = $11, 
        serial_number = $12, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const values = [
      id, column_name, data_type, data_length,
      is_nullable, default_value, is_primary, is_foreign,
      references_table, references_column, column_description, serial_number
    ];
    const result = await pool.query(query, values);
    res.json({ ok: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// delete
router.post('/delete', async (req, res) => {
  const { id } = req.body;
  try {
    await pool.query('DELETE FROM t_columns WHERE id = $1', [id]);
    res.json({ ok: true, message: 'Column deleted successfully' });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

export default router;