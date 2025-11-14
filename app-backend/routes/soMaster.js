const express = require('express');
const { db } = require('../db/init');
const router = express.Router();

// Get all sales order masters
router.get('/', (req, res) => {
  const sql = `
    SELECT som.*, c.contact_name
    FROM so_master som
    LEFT JOIN contacts c ON som.contacts_id = c.contact_id
    ORDER BY som.so_master_id DESC
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(rows);
  });
});

// Get sales order master by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT som.*, c.contact_name
    FROM so_master som
    LEFT JOIN contacts c ON som.contacts_id = c.contact_id
    WHERE som.so_master_id = ?
  `;
  db.get(sql, [id], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Sales order not found' });
    }
    res.json(row);
  });
});

// Create new sales order master
router.post('/', (req, res) => {
  const { transaction_date, contacts_id, transaction_note, total_amount, paid_amount, is_paid } = req.body;

  if (!transaction_date || !contacts_id) {
    return res.status(400).json({ error: 'Transaction date and contacts are required' });
  }

  const sql = `
    INSERT INTO so_master (transaction_date, contacts_id, transaction_note, total_amount, paid_amount, is_paid)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const params = [transaction_date, contacts_id, transaction_note || '', total_amount || 0, paid_amount || 0, is_paid || 0];

  db.run(sql, params, function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(201).json({ so_master_id: this.lastID, ...req.body });
  });
});

// Update sales order master
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { transaction_date, contacts_id, transaction_note, total_amount, paid_amount, is_paid } = req.body;

  if (!transaction_date || !contacts_id) {
    return res.status(400).json({ error: 'Transaction date and contacts are required' });
  }

  const sql = `
    UPDATE so_master SET
      transaction_date = ?,
      contacts_id = ?,
      transaction_note = ?,
      total_amount = ?,
      paid_amount = ?,
      is_paid = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE so_master_id = ?
  `;
  const params = [transaction_date, contacts_id, transaction_note || '', total_amount || 0, paid_amount || 0, is_paid || 0, id];

  db.run(sql, params, function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Sales order not found' });
    }
    res.json({ so_master_id: id, ...req.body });
  });
});

// Delete sales order master
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM so_master WHERE so_master_id = ?', [id], function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Sales order not found' });
    }
    res.json({ message: 'Sales order deleted successfully' });
  });
});

module.exports = router;
