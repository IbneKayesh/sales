const express = require('express');
const { db } = require('../db/init');
const router = express.Router();

// Get all sales order children
router.get('/', (req, res) => {
  const sql = `
    SELECT soc.*, i.item_name, u1.unit_name as small_unit_name, u2.unit_name as big_unit_name
    FROM so_child soc
    LEFT JOIN items i ON soc.item_id = i.item_id
    LEFT JOIN units u1 ON i.small_unit_id = u1.unit_id
    LEFT JOIN units u2 ON i.big_unit_id = u2.unit_id
    ORDER BY soc.id
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(rows);
  });
});

// Get sales order children by master ID
router.get('/master/:masterId', (req, res) => {
  const { masterId } = req.params;
  const sql = `
    SELECT soc.*, i.item_name, u1.unit_name as small_unit_name, u2.unit_name as big_unit_name
    FROM so_child soc
    LEFT JOIN items i ON soc.item_id = i.item_id
    LEFT JOIN units u1 ON i.small_unit_id = u1.unit_id
    LEFT JOIN units u2 ON i.big_unit_id = u2.unit_id
    WHERE soc.so_master_id = ?
    ORDER BY soc.id
  `;
  db.all(sql, [masterId], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(rows);
  });
});

// Get sales order child by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT soc.*, i.item_name, u1.unit_name as small_unit_name, u2.unit_name as big_unit_name
    FROM so_child soc
    LEFT JOIN items i ON soc.item_id = i.item_id
    LEFT JOIN units u1 ON i.small_unit_id = u1.unit_id
    LEFT JOIN units u2 ON i.big_unit_id = u2.unit_id
    WHERE soc.id = ?
  `;
  db.get(sql, [id], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Sales order item not found' });
    }
    res.json(row);
  });
});

// Create new sales order child
router.post('/', (req, res) => {
  const { so_master_id, item_id, item_rate, order_item_qty, return_item_qty, item_qty, discount_amount, item_amount, item_note } = req.body;

  if (!so_master_id || !item_id || !item_rate || !order_item_qty || !item_qty || !item_amount) {
    return res.status(400).json({ error: 'Master ID, item ID, rate, quantities, and amount are required' });
  }

  const sql = `
    INSERT INTO so_child (so_master_id, item_id, item_rate, order_item_qty, return_item_qty, item_qty, discount_amount, item_amount, item_note)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [so_master_id, item_id, item_rate, order_item_qty, return_item_qty || 0, item_qty, discount_amount || 0, item_amount, item_note || ''];

  db.run(sql, params, function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(201).json({ id: this.lastID, ...req.body });
  });
});

// Update sales order child
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { so_master_id, item_id, item_rate, order_item_qty, return_item_qty, item_qty, discount_amount, item_amount, item_note } = req.body;

  if (!so_master_id || !item_id || !item_rate || !order_item_qty || !item_qty || !item_amount) {
    return res.status(400).json({ error: 'Master ID, item ID, rate, quantities, and amount are required' });
  }

  const sql = `
    UPDATE so_child SET
      so_master_id = ?,
      item_id = ?,
      item_rate = ?,
      order_item_qty = ?,
      return_item_qty = ?,
      item_qty = ?,
      discount_amount = ?,
      item_amount = ?,
      item_note = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  const params = [so_master_id, item_id, item_rate, order_item_qty, return_item_qty || 0, item_qty, discount_amount || 0, item_amount, item_note || '', id];

  db.run(sql, params, function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Sales order item not found' });
    }
    res.json({ id: id, ...req.body });
  });
});

// Delete sales order child
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM so_child WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Sales order item not found' });
    }
    res.json({ message: 'Sales order item deleted successfully' });
  });
});

module.exports = router;
