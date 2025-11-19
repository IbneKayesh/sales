const express = require('express');
const { db } = require('../db/init');
const router = express.Router();

// Get all categories
router.get('/', (req, res) => {
  db.all(`
    SELECT c.*, 0 AS ismodified, COUNT(i.item_id) AS item_count
    FROM categories c
    LEFT JOIN items i ON c.category_id = i.category_id
    GROUP BY c.category_id
    ORDER BY c.category_id
  `, [], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(rows);
  });
});

// Get category by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM categories WHERE category_id = ?', [id], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(row);
  });
});

// Create new category
router.post('/', (req, res) => {
  const { category_id, category_name } = req.body;

  if (!category_name) {
    return res.status(400).json({ error: 'Category name is required' });
  }

  if (!category_id) {
    return res.status(400).json({ error: 'Category ID is required' });
  }

  const sql = `
    INSERT INTO categories (category_id, category_name)
    VALUES (?, ?)
  `;
  const params = [category_id, category_name];

  db.run(sql, params, function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(201).json({ category_id, ...req.body });
  });
});

// Update category
router.post('/update', (req, res) => {
  const { id, category_name } = req.body;

  if (!id || !category_name) {
    return res.status(400).json({ error: 'Category ID and name are required' });
  }

  const sql = `
    UPDATE categories SET
      category_name = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE category_id = ?
  `;
  const params = [category_name, id];

  db.run(sql, params, function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ category_id: id, category_name });
  });
});

// Delete category
router.post('/delete', (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Category ID is required' });
  }

  db.run('DELETE FROM categories WHERE category_id = ?', [id], function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  });
});

module.exports = router;
