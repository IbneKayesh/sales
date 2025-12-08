const express = require('express');
const router = express.Router();
const { backupDB, restoreDB } = require('../../db/backup');
const { exportTableToCSV, exportAllTablesToCSV } = require('../../db/export');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');



// Backup database
router.post('/backup', (req, res) => {
  backupDB((err, backupPath) => {
    if (err) {
      return res.status(500).json({ error: 'Backup failed', details: err.message });
    }
    res.json({ message: 'Backup created successfully', path: backupPath });
  });
});

// Restore database
router.post('/restore', (req, res) => {
  const { backupPath } = req.body;
  if (!backupPath) {
    return res.status(400).json({ error: 'Backup path is required' });
  }

  // Validate backup path exists
  if (!fs.existsSync(backupPath)) {
    return res.status(400).json({ error: 'Backup file does not exist' });
  }

  restoreDB(backupPath, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Restore failed', details: err.message });
    }
    res.json({ message: 'Database restored successfully' });
  });
});

// Export single table to CSV
router.post('/export/:table', (req, res) => {
  const { table } = req.params;
  
  const validTables = [
    'users', 'units', 'categories', 'products', 'contacts', 'accounts_heads', 'bank_accounts', 'bank_payments', 'accounts_ledger', 'payments', 'payment_details', 'po_master', 'po_details', 'so_master', 'so_details'
  ];

  if (!validTables.includes(table)) {
    return res.status(400).json({ error: 'Invalid table name' });
  }

  exportTableToCSV(table, (err, exportPath) => {
    if (err) {
      return res.status(500).json({ error: 'Export failed', details: err.message });
    }
    res.json({ message: `Table ${table} exported successfully`, path: exportPath });
  });
});

// Export all tables to CSV
router.post('/export-all', (req, res) => {
  exportAllTablesToCSV((err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Export failed', details: err.message });
    }
    res.json({ message: 'All tables exported successfully', exports: results });
  });
});

// List backup files
router.get('/backups', (req, res) => {
  const backupDir = path.join(__dirname, '../../backups');
  console.log("backupDir " + backupDir)
  if (!fs.existsSync(backupDir)) {
    return res.json({ backups: [] });
  }

  fs.readdir(backupDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to list backups' });
    }
    const backups = files.filter(file => file.endsWith('.db')).map(file => ({
      name: file,
      path: path.join(backupDir, file),
      size: fs.statSync(path.join(backupDir, file)).size
    }));

    res.json({ data: backups });
  });
});

// List export files and folders
router.get('/exports', (req, res) => {
  const exportDir = path.join(__dirname, '../../exports');
  if (!fs.existsSync(exportDir)) {
    return res.json({ exports: [] });
  }

  fs.readdir(exportDir, (err, items) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to list exports' });
    }

    const exports = items.map(item => {
      const itemPath = path.join(exportDir, item);
      const stats = fs.statSync(itemPath);

      if (stats.isDirectory()) {
        // Calculate folder size by summing all files inside
        let folderSize = 0;
        const files = fs.readdirSync(itemPath);
        files.forEach(file => {
          const filePath = path.join(itemPath, file);
          if (fs.statSync(filePath).isFile()) {
            folderSize += fs.statSync(filePath).size;
          }
        });

        return {
          name: item,
          path: itemPath,
          size: folderSize,
          type: 'folder'
        };
      } else {
        // Individual CSV file
        return {
          name: item,
          path: itemPath,
          size: stats.size,
          type: 'file'
        };
      }
    });

    console.log("exports " + JSON.stringify(exports))
    res.json({ data: exports });
  });
});

// Delete backup file
router.delete('/backups/:filename', (req, res) => {
  const { filename } = req.params;
  const backupDir = path.join(__dirname, '../../backups');
  const filePath = path.join(backupDir, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Backup file not found' });
  }

  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete backup', details: err.message });
    }
    res.json({ message: 'Backup deleted successfully' });
  });
});

// Delete export file or folder
router.delete('/exports/:filename', (req, res) => {
  const { filename } = req.params;
  const exportDir = path.join(__dirname, '../../exports');
  const itemPath = path.join(exportDir, filename);

  if (!fs.existsSync(itemPath)) {
    return res.status(404).json({ error: 'Export item not found' });
  }

  const stats = fs.statSync(itemPath);
  if (stats.isDirectory()) {
    // Delete folder recursively
    fs.rmdirSync(itemPath, { recursive: true });
    res.json({ message: 'Export folder deleted successfully' });
  } else {
    // Delete single file
    fs.unlink(itemPath, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete export', details: err.message });
      }
      res.json({ message: 'Export file deleted successfully' });
    });
  }
});

// Download backup file
router.get('/download/backups/:filename', (req, res) => {
  const { filename } = req.params;
  const backupDir = path.join(__dirname, '../../backups');
  const filePath = path.join(backupDir, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Backup file not found' });
  }

  const stats = fs.statSync(filePath);
  if (!stats.isFile()) {
    return res.status(400).json({ error: 'Item is not a file' });
  }

  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Length', stats.size);

  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
});

// Download export file or folder
router.get('/download/exports/:filename', (req, res) => {
  const { filename } = req.params;
  const exportDir = path.join(__dirname, '../../exports');
  const itemPath = path.join(exportDir, filename);

  if (!fs.existsSync(itemPath)) {
    return res.status(404).json({ error: 'Export item not found' });
  }

  const stats = fs.statSync(itemPath);
  if (stats.isFile()) {
    // Download single file
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', stats.size);

    const fileStream = fs.createReadStream(itemPath);
    fileStream.pipe(res);
  } else if (stats.isDirectory()) {
    // Download folder as ZIP
    const zipFilename = `${filename}.zip`;
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${zipFilename}"`);

    const archive = archiver('zip', {
      zlib: { level: 9 } // Best compression
    });

    archive.on('error', (err) => {
      throw err;
    });

    archive.pipe(res);

    // Add all files from the folder to the ZIP
    archive.directory(itemPath, filename);
    archive.finalize();
  } else {
    return res.status(400).json({ error: 'Invalid item type' });
  }
});

module.exports = router;