const express = require('express');
const { db } = require('../db/init');
const router = express.Router();

// Get all users
router.get('/', (req, res) => {
  db.all('SELECT user_id, username, email, role, created_at, updated_at FROM users ORDER BY user_id', [], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(rows);
  });
});

// Get user by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT user_id, username, email, role, created_at, updated_at FROM users WHERE user_id = ?', [id], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (!row) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(row);
  });
});

// Create new user
router.post('/', (req, res) => {
  const { user_id, username, password, email, role } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  if (!user_id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const sql = `
    INSERT INTO users (user_id, username, password, email, role)
    VALUES (?, ?, ?, ?, ?)
  `;
  const params = [user_id, username, password, email, role || 'User'];

  db.run(sql, params, function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(201).json({ user_id, username, email, role: role || 'User' });
  });
});

// Update user
router.post('/update', (req, res) => {
  const { id, username, password, email, role } = req.body;

  if (!id || !username) {
    return res.status(400).json({ error: 'User ID and username are required' });
  }

  const sql = `
    UPDATE users SET
      username = ?,
      password = ?,
      email = ?,
      role = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ?
  `;
  const params = [username, password, email, role, id];

  db.run(sql, params, function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user_id: id, username, email, role });
  });
});

// Delete user
router.post('/delete', (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  db.run('DELETE FROM users WHERE user_id = ?', [id], function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  });
});

module.exports = router;
