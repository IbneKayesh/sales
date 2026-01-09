const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { initData } = require('./db/initData.js');

//auth
const authRoutes = require('./routes/auth/auth.routes.js');
const businessRoutes = require('./routes/auth/business.routes.js');
const usersRoutes = require('./routes/auth/users.routes.js');
//crm
const contactsRoutes = require('./routes/crm/contacts.routes.js');
//accounts
const accountsRoutes = require('./routes/accounts/accounts.routes.js');
const accountsHeadsRoutes = require('./routes/accounts/accountsHeads.routes.js');
const accountsLedgerRoutes = require('./routes/accounts/accountsLedger.routes.js');
//setup
const grainRoutes = require('./routes/setup/grain.routes.js');
const closingRoutes = require('./routes/setup/closing.routes.js');


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
// initData();



// Routes
//auth
app.use('/api/auth', authRoutes);
app.use('/api/auth/business', businessRoutes);
app.use('/api/auth/users', usersRoutes);
//crm
app.use('/api/crm/contacts', contactsRoutes);
//accounts
app.use('/api/accounts/accounts', accountsRoutes);
app.use('/api/accounts/accounts-heads', accountsHeadsRoutes);
app.use('/api/accounts/accounts-ledgers', accountsLedgerRoutes);
//setup
app.use('/api/setup/grain', grainRoutes);
app.use('/api/setup/closing', closingRoutes);

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
