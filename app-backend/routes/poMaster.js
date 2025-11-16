const express = require('express');
const { db } = require('../db/init');
const router = express.Router();

// Function to generate order number
function generate_order_number(order_type, callback) {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yy = String(now.getFullYear()).slice(-2);
  const datePart = dd + mm + yy;
  const prefix = order_type.split(' ').map(word => word[0]).join('').toUpperCase();

  const sql = `
    SELECT MAX(CAST(SUBSTR(order_no, -5) AS INTEGER)) as max_seq
    FROM po_master
    WHERE order_type = ?
    AND strftime('%Y-%m', order_date) = strftime('%Y-%m', 'now')
  `;

  db.get(sql, [order_type], (err, row) => {
    if (err) {
      return callback(err);
    }
    const max_seq = row.max_seq || 0;
    const next_seq = max_seq + 1;
    const seq = String(next_seq).padStart(5, '0');
    const order_no = `${prefix}-${datePart}-${seq}`;
    callback(null, order_no);
  });
}

// Get all purchase order masters
router.get('/', (req, res) => {
  const sql = `
    SELECT pom.*, c.contact_name, 0 AS ismodified
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
  const { po_master_id, order_type, order_date, contacts_id, ref_no, order_note, total_amount, paid_amount, is_paid } = req.body;

  if (!po_master_id || !order_type || !order_date || !contacts_id || !ref_no) {
    return res.status(400).json({ error: 'PO Master ID, order type, order date, contacts, and ref no are required' });
  }

  generate_order_number(order_type, (err, order_no) => {
    if (err) {
      console.error('Error generating order number:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const sql = `
      INSERT INTO po_master (po_master_id, order_type, order_no, order_date, contacts_id, ref_no, order_note, total_amount, paid_amount, is_paid)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [po_master_id, order_type, order_no, order_date, contacts_id, ref_no, order_note || '', total_amount || 0, paid_amount || 0, is_paid || 0];

    db.run(sql, params, function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.status(201).json({ po_master_id, order_no, ...req.body });
    });
  });
});

// Update purchase order master
router.post('/update', (req, res) => {
  const { id, order_type, order_no, order_date, contacts_id, ref_no, order_note, total_amount, paid_amount, is_paid } = req.body;

  if (!id || !order_type || !order_no || !order_date || !contacts_id || !ref_no) {
    return res.status(400).json({ error: 'ID, order type, order no, order date, contacts, and ref no are required' });
  }

  const sql = `
    UPDATE po_master SET
      order_type = ?,
      order_no = ?,
      order_date = ?,
      contacts_id = ?,
      ref_no = ?,
      order_note = ?,
      total_amount = ?,
      paid_amount = ?,
      is_paid = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE po_master_id = ?
  `;
  const params = [order_type, order_no, order_date, contacts_id, ref_no, order_note || '', total_amount || 0, paid_amount || 0, is_paid || 0, id];

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
router.post('/delete', (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }

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
