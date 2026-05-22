import express from 'express';
import { pool } from './db.js';

const router = express.Router();

function columnsToClient(rows) {
  return rows.map((r) => ({
    ...r,
    is_nullable: r.is_nullable,
    is_primary: r.is_primary,
    is_foreign: r.is_foreign,
  }));
}

router.post('/list', async (req, res) => {
  try {
    const { tableId } = req.body || {};
    if (!tableId) return res.status(400).json({ error: 'tableId required' });

    const q1 = 'SELECT table_name FROM t_tables WHERE id=$1';
    const { rows: trows } = await pool.query(q1, [tableId]);
    const tableName = trows[0]?.table_name || null;

    const q2 = 'SELECT * FROM t_columns WHERE table_id=$1 ORDER BY serial_number ASC NULLS LAST, created_at DESC';
    const { rows } = await pool.query(q2, [tableId]);

    res.json({ tableName, columns: columnsToClient(rows) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/create', async (req, res) => {
  try {
    const { tableId, column } = req.body || {};
    if (!tableId || !column?.column_name || !column?.data_type) {
      return res.status(400).json({ error: 'tableId, column_name, data_type required' });
    }

    const id = `col_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const c = column;

    const q = `INSERT INTO t_columns (
      id, table_id, column_name, data_type, data_length, is_nullable, default_value, is_primary, is_foreign,
      references_table, references_column, column_description, serial_number
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`;

    const params = [
      id,
      tableId,
      c.column_name,
      c.data_type,
      c.data_length ?? null,
      c.is_nullable ?? true,
      c.default_value ?? null,
      c.is_primary ?? false,
      c.is_foreign ?? false,
      c.references_table ?? null,
      c.references_column ?? null,
      c.column_description ?? null,
      c.serial_number ?? null,
    ];

    const { rows } = await pool.query(q, params);
    res.json({ column: rows[0] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/update', async (req, res) => {
  try {
    const { columnId, patch } = req.body || {};
    if (!columnId) return res.status(400).json({ error: 'columnId required' });

    const p = patch || {};
    const fields = [];
    const params = [];
    let idx = 1;

    for (const key of [
      'column_name',
      'data_type',
      'data_length',
      'is_nullable',
      'default_value',
      'is_primary',
      'is_foreign',
      'references_table',
      'references_column',
      'column_description',
      'serial_number',
    ]) {
      if (Object.prototype.hasOwnProperty.call(p, key)) {
        fields.push(`${key} = $${idx++}`);
        params.push(p[key]);
      }
    }

    if (!fields.length) return res.json({ ok: true });

    params.push(columnId);
    const q = `UPDATE t_columns SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${idx} RETURNING *`;
    const { rows } = await pool.query(q, params);
    res.json({ column: rows[0] || null });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/delete', async (req, res) => {
  try {
    const { columnId } = req.body || {};
    if (!columnId) return res.status(400).json({ error: 'columnId required' });
    await pool.query('DELETE FROM t_columns WHERE id=$1', [columnId]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;

