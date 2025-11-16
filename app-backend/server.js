const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { initTables } = require('./db/init');

// Import routes
const authRoutes = require('./routes/auth');
const bankRoutes = require('./routes/banks');
const bankAccountRoutes = require('./routes/bankAccounts');
const bankTransactionRoutes = require('./routes/bankTransactions');
const poMasterRoutes = require('./routes/poMaster');
const poChildRoutes = require('./routes/poChild');
const soMasterRoutes = require('./routes/soMaster');
const soChildRoutes = require('./routes/soChild');
const contactRoutes = require('./routes/contacts');
const unitRoutes = require('./routes/units');
const itemRoutes = require('./routes/items');
const categoryRoutes = require('./routes/categories');
const userRoutes = require('./routes/users');
const closingProcessRoutes = require('./routes/closingProcess');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API Key validation middleware
app.use('/api', (req, res, next) => {
  const apiKey = req.headers['app-api-key'];
  const validKey = 'sand-grain-digital-2025';

  if (!apiKey || apiKey !== validKey) {
    return res.status(401).json({ error: 'Invalid or missing API key' });
  }

  next();
});

// Initialize database
initTables();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/banks', bankRoutes);
app.use('/api/bank-accounts', bankAccountRoutes);
app.use('/api/bank-transactions', bankTransactionRoutes);
app.use('/api/po-master', poMasterRoutes);
app.use('/api/po-child', poChildRoutes);
app.use('/api/so-master', soMasterRoutes);
app.use('/api/so-child', soChildRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/closing-process', closingProcessRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
