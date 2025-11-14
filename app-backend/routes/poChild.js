const express = require('express');
const { db } = require('../db/init');
const router = express.Router();

// Get all purchase order children
router.get('/', (req, res) => {
  const sql = `
    SELECT poc.*, i.item_name, u1.unit_name as small_unit_name, u2.unit_name as big_unit_name
    FROM po_child poc
    LEFT JOIN items i ON poc.item_id = i.item_id
    LEFT JOIN units u1 ON i.small_unit_id = u1.unit_id
    LEFT JOIN units u2 ON i.big_unit_id = u2.unit_id
    ORDER BY poc.id
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(rows);
  });
});

// Get purchase order children by master ID
router.get('/master/:masterId', (req, res) => {
  const { masterId } = req.params;
  const sql = `
    SELECT poc.*, i.item_name, u1.unit_name as small_unit_name, u2.unit_name as big_unit_name
    FROM po_child poc
    LEFT JOIN items i ON poc.item_id = i.item_id
    LEFT JOIN units u1 ON i.small_unit_id = u1.unit_id
    LEFT JOIN units u2 ON i.big_unit_id = u2.unit_id
    WHERE poc.po_master_id = ?
    ORDER BY poc.id
  `;
  db.all(sql, [masterId], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(rows);
  });
});

// Get purchase order child by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT poc.*, i.item_name, u1.unit_name as small_unit_name, u2.unit_name as big_unit_name
    FROM po_child poc
    LEFT JOIN items i ON poc.item_id = i.item_id
    LEFT JOIN units u1 ON i.small_unit_id = u1.unit_id
    LEFT JOIN units u2 ON i.big_unit_id = u2.unit_id
    WHERE poc.id = ?
  `;
  db.get(sql, [id], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Purchase order item not found' });
    }
    res.json(row);
  });
});

// Create new purchase order child
router.post('/', (req, res) => {
  const { po_master_id, item_id, item_rate, item_qty, discount_amount, item_amount, item_note } = req.body;

  if (!po_master_id || !item_id || !item_rate || !item_qty || !item_amount) {
    return res.status(400).json({ error: 'Master ID, item ID, rate, quantity, and amount are required' });
  }

  const sql = `
    INSERT INTO po_child (po_master_id, item_id, item_rate, item_qty, discount_amount, item_amount, item_note)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [po_master_id, item_id, item_rate, item_qty, discount_amount || 0, item_amount, item_note || ''];

  db.run(sql, params, function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(201).json({ id: this.lastID, ...req.body });
  });
});

// Update purchase order child
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { po_master_id, item_id, item_rate, item_qty, discount_amount, item_amount, item_note } = req.body;

  if (!po_master_id || !item_id || !item_rate || !item_qty || !item_amount) {
    return res.status(400).json({ error: 'Master ID, item ID, rate, quantity, and amount are required' });
  }

  const sql = `
    UPDATE po_child SET
      po_master_id = ?,
      item_id = ?,
      item_rate = ?,
      item_qty = ?,
      discount_amount = ?,
      item_amount = ?,
      item_note = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  const params = [po_master_id, item_id, item_rate, item_qty, discount_amount || 0, item_amount, item_note || '', id];

  db.run(sql, params, function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Purchase order item not found' });
    }
    res.json({ id: id, ...req.body });
  });
});

// Delete purchase order child
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM po_child WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Purchase order item not found' });
    }
    res.json({ message: 'Purchase order item deleted successfully' });
  });
});

module.exports = router;
