const express = require('express');
const { db } = require('../db/init');
const router = express.Router();

// Get all payments
router.get('/', (req, res) => {
  db.all('SELECT * FROM payments ORDER BY payment_id', [], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(rows);
  });
});

// Get payment by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM payments WHERE payment_id = ?', [id], (err, row) => {
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

// Get payment by ref no
router.get('/refno/:refNo', (req, res) => {
  const { refNo } = req.params;
  db.all('SELECT * FROM payments WHERE ref_no = ?', [refNo], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(rows);
  });
});

// Create new payment
router.post('/', (req, res) => {
  const { payment_id, payment_name } = req.body;

  if (!payment_name) {
    return res.status(400).json({ error: 'Payment name is required' });
  }

  if (!payment_id) {
    return res.status(400).json({ error: 'Payment ID is required' });
  }

  const sql = `
    INSERT INTO payments (payment_id, payment_name)
    VALUES (?, ?)
  `;
  const params = [payment_id, payment_name];

  db.run(sql, params, function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(201).json({ unit_id, ...req.body });
  });
});

// Update payment
router.post('/update', (req, res) => {
  const { id, payment_name } = req.body;

  if (!id || !payment_name) {
    return res.status(400).json({ error: 'Payment ID and name are required' });
  }

  const sql = `
    UPDATE payments SET
      payment_name = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE payment_id = ?
  `;
  const params = [payment_name, id];

  db.run(sql, params, function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.json({ payment_id: id, payment_name });
  });
});

// Delete payment
router.post('/delete', (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Payment ID is required' });
  }

  db.run('DELETE FROM payments WHERE payment_id = ?', [id], function(err) {
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
