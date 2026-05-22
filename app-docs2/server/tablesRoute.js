import express from 'express';
import { pool } from './db.js';

const router = express.Router();

router.post('/list', async (req, res) => {
  try {
    const q = 'SELECT * FROM t_tables ORDER BY serial_number ASC NULLS LAST, created_at DESC';
    const { rows } = await pool.query(q);
    res.json({ tables: rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/create', async (req, res) => {
  try {
    const { table_name, table_description = null, serial_number = null } = req.body || {};
    if (!table_name) return res.status(400).json({ error: 'table_name required' });

    const id = `tbl_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const q = `INSERT INTO t_tables (id, table_name, table_description, serial_number) VALUES ($1,$2,$3,$4) RETURNING *`;
    const { rows } = await pool.query(q, [id, table_name, table_description, serial_number]);
    res.json({ table: rows[0] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/update', async (req, res) => {
  try {
    const { tableId, patch } = req.body || {};
    if (!tableId) return res.status(400).json({ error: 'tableId required' });

    const p = patch || {};
    const fields = [];
    const params = [];
    let idx = 1;

    for (const key of ['table_name', 'table_description', 'serial_number']) {
      if (Object.prototype.hasOwnProperty.call(p, key)) {
        fields.push(`${key} = $${idx++}`);
        params.push(p[key]);
      }
    }

    if (!fields.length) return res.json({ ok: true });

    params.push(tableId);
    const q = `UPDATE t_tables SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${idx} RETURNING *`;
    const { rows } = await pool.query(q, params);
    res.json({ table: rows[0] || null });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/delete', async (req, res) => {
  try {
    const { tableId } = req.body || {};
    if (!tableId) return res.status(400).json({ error: 'tableId required' });
    await pool.query('DELETE FROM t_tables WHERE id=$1', [tableId]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;

