// Import routes

const bankAccountRoutes = require('./routes/bankAccounts');
const bankTransactionRoutes = require('./routes/bankTransactions');
const poMasterRoutes = require('./routes/poMaster');
const poChildRoutes = require('./routes/poChild');
const soMasterRoutes = require('./routes/soMaster');
const soChildRoutes = require('./routes/soChild');
const contactRoutes = require('./routes/contacts');
const itemRoutes = require('./routes/items');
const categoryRoutes = require('./routes/categories');
const userRoutes = require('./routes/users');
const closingProcessRoutes = require('./routes/closingProcess');
const paymentRoutes = require('./routes/payments');
const backupRoutes = require('./routes/backup');



// Routes

app.use('/api/bank-accounts', bankAccountRoutes);
app.use('/api/bank-transactions', bankTransactionRoutes);
app.use('/api/po-master', poMasterRoutes);
app.use('/api/po-child', poChildRoutes);
app.use('/api/so-master', soMasterRoutes);
app.use('/api/so-child', soChildRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/closing-process', closingProcessRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/db', backupRoutes);
