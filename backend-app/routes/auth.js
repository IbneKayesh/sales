const express = require('express');
const { db } = require('../db/init');
const router = express.Router();

// Login endpoint
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'Username and password are required' });
  }
  const sql = `SELECT * FROM users WHERE user_name = ? AND user_password = ?`;

  db.get(sql, [username, password], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }

    if (row) {
      // In a real app, you'd use JWT or sessions here
      res.json({ success: true, user: { user_name: row.user_name, user_id: row.user_id } });
    } else {
      res.status(401).json({ success: false, error: 'Invalid username or password' });
    }
  });
});

// Logout endpoint (for consistency, though not much needed with stateless auth)
router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;
