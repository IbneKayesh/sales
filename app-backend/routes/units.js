const express = require('express');
const { db } = require('../db/init');
const router = express.Router();

// Get all units
router.get('/', (req, res) => {
  db.all('SELECT * FROM units ORDER BY unit_id', [], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(rows);
  });
});

// Get unit by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM units WHERE unit_id = ?', [id], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Unit not found' });
    }
    res.json(row);
  });
});

// Create new unit
router.post('/', (req, res) => {
  const { unit_name } = req.body;

  if (!unit_name) {
    return res.status(400).json({ error: 'Unit name is required' });
  }

  const sql = `
    INSERT INTO units (unit_name)
    VALUES (?)
  `;
  const params = [unit_name];

  db.run(sql, params, function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(201).json({ unit_id: this.lastID, ...req.body });
  });
});

// Update unit
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { unit_name } = req.body;

  if (!unit_name) {
    return res.status(400).json({ error: 'Unit name is required' });
  }

  const sql = `
    UPDATE units SET
      unit_name = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE unit_id = ?
  `;
  const params = [unit_name, id];

  db.run(sql, params, function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Unit not found' });
    }
    res.json({ unit_id: id, ...req.body });
  });
});

// Delete unit
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM units WHERE unit_id = ?', [id], function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Unit not found' });
    }
    res.json({ message: 'Unit deleted successfully' });
  });
});

module.exports = router;
