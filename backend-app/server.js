const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { initTables, initData } = require('./db/init');

// Import routes
const authRoutes = require('./routes/auth');
const unitRoutes = require('./routes/inventory/units.js');
const categoryRoutes = require('./routes/inventory/categories.js');
const productRoutes = require('./routes/inventory/products.js');
const salesRoutes = require('./routes/sales/sales.js');
const backupRoutes = require('./routes/setup/backup.js');
const contactRoutes = require('./routes/setup/contacts.js');
const usersRoutes = require('./routes/setup/users.js');
const closingProcessRoutes = require('./routes/setup/closingProcess.js');
const configsRoutes = require('./routes/setup/configs.js');

//account modules
const banksRoutes = require('./routes/accounts/banks.js');
const ledgerRoutes = require('./routes/accounts/ledger.js');
const payablesRoutes = require('./routes/accounts/payables.js');
const accountsHeadsRoutes = require('./routes/accounts/accountsHeads.js');



//purchase modules
const pobookingRoutes = require('./routes/purchase/pobooking.js');
const poinvoiceRoutes = require('./routes/purchase/poinvoice.js');
const poorderRoutes = require('./routes/purchase/poorder.js');
const poreturnRoutes = require('./routes/purchase/poreturn.js');

//setup
const settingsRoutes = require('./routes/setup/settings.js');

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
initData();



// Routes
app.use('/api/auth', authRoutes);
app.use('/api/inventory/units', unitRoutes);
app.use('/api/inventory/categories', categoryRoutes);
app.use('/api/inventory/products', productRoutes);
app.use('/api/setup/contacts', contactRoutes);
app.use('/api/setup/closing-process', closingProcessRoutes);
//app.use('/api/purchase/orders', purchaseRoutes);


app.use('/api/sales/orders', salesRoutes);
app.use('/api/setup/users', usersRoutes);
app.use('/api/setup', backupRoutes);
app.use('/api/setup/configs', configsRoutes);


//accounts modules
app.use('/api/accounts/banks', banksRoutes);
app.use('/api/accounts/ledger', ledgerRoutes);
app.use('/api/accounts/payables', payablesRoutes);
app.use('/api/accounts/accounts-heads', accountsHeadsRoutes);


//purchase modules
app.use('/api/purchase/booking', pobookingRoutes);
app.use('/api/purchase/invoice', poinvoiceRoutes);
app.use('/api/purchase/order', poorderRoutes);
app.use('/api/purchase/return', poreturnRoutes);


//setup
app.use('/api/setup/settings', settingsRoutes);


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
