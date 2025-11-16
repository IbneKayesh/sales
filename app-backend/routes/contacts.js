const express = require('express');
const { db } = require('../db/init');
const router = express.Router();

// Get all contacts
router.get('/', (req, res) => {
  db.all('SELECT c.*,0 AS ismodified FROM contacts c ORDER BY c.contact_id', [], (err, rows) => {
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
  const { contact_id, contact_name, contact_address, contact_type } = req.body;

  if (!contact_name) {
    return res.status(400).json({ error: 'Contact name is required' });
  }

  if (!contact_id) {
    return res.status(400).json({ error: 'Contact ID is required' });
  }

  const sql = `
    INSERT INTO contacts (contact_id, contact_name, contact_address, contact_type, current_balance)
    VALUES (?, ?, ?, ?, 0)
  `;
  const params = [contact_id, contact_name, contact_address || '', contact_type || ''];

  db.run(sql, params, function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(201).json({ contact_id, ...req.body });
  });
});

// Update contact
router.post('/update', (req, res) => {
  const { id, contact_name, contact_address, contact_type } = req.body;

  if (!id || !contact_name) {
    return res.status(400).json({ error: 'Contact ID and name are required' });
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
    res.json({ contact_id: id, contact_name, contact_address, contact_type });
  });
});

// Delete contact
router.post('/delete', (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Contact ID is required' });
  }

  db.run('DELETE FROM contacts WHERE contact_id = ? AND current_balance = 0', [id], function(err) {
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
