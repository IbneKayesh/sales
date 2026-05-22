// server/tableRoute.js
import express from 'express';
import { pool } from './db.js';

const router = express.Router();

// get-all
router.post('/get-all', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM t_tables ORDER BY serial_number ASC, created_at DESC');
    res.json({ ok: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// add
router.post('/add', async (req, res) => {
  const { id, table_name, table_description, serial_number } = req.body;
  try {
    const query = `
      INSERT INTO t_tables (id, table_name, table_description, serial_number)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await pool.query(query, [id, table_name, table_description, serial_number]);
    res.json({ ok: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// edit
router.post('/edit', async (req, res) => {
  const { id, table_name, table_description, serial_number } = req.body;
  try {
    const query = `
      UPDATE t_tables 
      SET table_name = $2, table_description = $3, serial_number = $4, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(query, [id, table_name, table_description, serial_number]);
    res.json({ ok: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// delete
router.post('/delete', async (req, res) => {
  const { id } = req.body;
  try {
    await pool.query('DELETE FROM t_tables WHERE id = $1', [id]);
    res.json({ ok: true, message: 'Table record deleted successfully' });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

export default router;