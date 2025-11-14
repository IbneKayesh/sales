const express = require('express');
const { db } = require('../db/init');
const router = express.Router();

// Get all contacts
router.get('/', (req, res) => {
  db.all('SELECT * FROM contacts ORDER BY contact_id', [], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(rows);
  });
});

// Get contact by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM contacts WHERE contact_id = ?', [id], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json(row);
  });
});

// Create new contact
router.post('/', (req, res) => {
  const { contact_name, contact_address, contact_type } = req.body;

  if (!contact_name) {
    return res.status(400).json({ error: 'Contact name is required' });
  }

  const sql = `
    INSERT INTO contacts (contact_name, contact_address, contact_type)
    VALUES (?, ?, ?)
  `;
  const params = [contact_name, contact_address || '', contact_type || ''];

  db.run(sql, params, function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(201).json({ contact_id: this.lastID, ...req.body });
  });
});

// Update contact
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { contact_name, contact_address, contact_type } = req.body;

  if (!contact_name) {
    return res.status(400).json({ error: 'Contact name is required' });
  }

  const sql = `
    UPDATE contacts SET
      contact_name = ?,
      contact_address = ?,
      contact_type = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE contact_id = ?
  `;
  const params = [contact_name, contact_address || '', contact_type || '', id];

  db.run(sql, params, function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json({ contact_id: id, ...req.body });
  });
});

// Delete contact
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM contacts WHERE contact_id = ?', [id], function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json({ message: 'Contact deleted successfully' });
  });
});

module.exports = router;
