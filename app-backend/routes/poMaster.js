const express = require('express');
const { db } = require('../db/init');
const router = express.Router();

// Get all purchase order masters
router.get('/', (req, res) => {
  const sql = `
    SELECT pom.*, c.contact_name
    FROM po_master pom
    LEFT JOIN contacts c ON pom.contacts_id = c.contact_id
    ORDER BY pom.po_master_id DESC
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(rows);
  });
});

// Get purchase order master by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT pom.*, c.contact_name
    FROM po_master pom
    LEFT JOIN contacts c ON pom.contacts_id = c.contact_id
    WHERE pom.po_master_id = ?
  `;
  db.get(sql, [id], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Purchase order not found' });
    }
    res.json(row);
  });
});

// Create new purchase order master
router.post('/', (req, res) => {
  const { transaction_date, contacts_id, transaction_note, total_amount, paid_amount, is_paid } = req.body;

  if (!transaction_date || !contacts_id) {
    return res.status(400).json({ error: 'Transaction date and contacts are required' });
  }

  const sql = `
    INSERT INTO po_master (transaction_date, contacts_id, transaction_note, total_amount, paid_amount, is_paid)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const params = [transaction_date, contacts_id, transaction_note || '', total_amount || 0, paid_amount || 0, is_paid || 0];

  db.run(sql, params, function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(201).json({ po_master_id: this.lastID, ...req.body });
  });
});

// Update purchase order master
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { transaction_date, contacts_id, transaction_note, total_amount, paid_amount, is_paid } = req.body;

  if (!transaction_date || !contacts_id) {
    return res.status(400).json({ error: 'Transaction date and contacts are required' });
  }

  const sql = `
    UPDATE po_master SET
      transaction_date = ?,
      contacts_id = ?,
      transaction_note = ?,
      total_amount = ?,
      paid_amount = ?,
      is_paid = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE po_master_id = ?
  `;
  const params = [transaction_date, contacts_id, transaction_note || '', total_amount || 0, paid_amount || 0, is_paid || 0, id];

  db.run(sql, params, function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Purchase order not found' });
    }
    res.json({ po_master_id: id, ...req.body });
  });
});

// Delete purchase order master
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM po_master WHERE po_master_id = ?', [id], function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Purchase order not found' });
    }
    res.json({ message: 'Purchase order deleted successfully' });
  });
});

module.exports = router;
