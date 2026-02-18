const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const rateLimiter = require("./middlewares/rateLimiter.js");
const { initData } = require("./db/initData.js");

//auth
const authRoutes = require("./routes/auth/auth.routes.js");
//crm
const contactsRoutes = require("./routes/crm/contacts.routes.js");
const orderRoutes = require("./routes/crm/orderRoute.routes.js");
const dzoneRoutes = require("./routes/crm/dzone.routes.js");
const tareaRoutes = require("./routes/crm/tarea.routes.js");
const territoryRoutes = require("./routes/crm/territory.routes.js");
const deliveryVanRoutes = require("./routes/crm/deliveryVan.routes.js");
//hrms
const employeesRoutes = require("./routes/hrms/employees.routes.js");
//accounts
const accountsRoutes = require("./routes/accounts/accounts.routes.js");
const accountsHeadsRoutes = require("./routes/accounts/accountsHeads.routes.js");
const accountsLedgerRoutes = require("./routes/accounts/accountsLedger.routes.js");
const payablesRoutes = require("./routes/accounts/payables.routes.js");
const receivablesRoutes = require("./routes/accounts/receivables.routes.js");
const expensesRoutes = require("./routes/accounts/expenses.routes.js");
//setup
const businessRoutes = require("./routes/setup/business.routes.js");
const usersRoutes = require("./routes/setup/users.routes.js");
const databaseRoutes = require("./routes/setup/database.routes.js");
const closingRoutes = require("./routes/setup/closing.routes.js");
const configsRoutes = require("./routes/setup/configs.routes.js");
//inventory
const unitsRoutes = require("./routes/inventory/units.routes.js");
const categoriesRoutes = require("./routes/inventory/categories.routes.js");
const productsRoutes = require("./routes/inventory/products.routes.js");
const attributesRoutes = require("./routes/inventory/attributes.routes.js");
const stockreportsRoutes = require("./routes/inventory/stockreports.routes.js");
const itransferRoutes = require("./routes/inventory/itransfer.routes.js");
//support
const grainsRoutes = require("./routes/support/grains.routes.js");
const notesRoutes = require("./routes/support/notes.routes.js");
const sessionsRoutes = require("./routes/support/sessions.routes.js");
const ticketsRoutes = require("./routes/support/tickets.routes.js");
const socialsRoutes = require("./routes/support/socials.routes.js");
const defaultDataRoutes = require("./routes/setup/defaultData.routes.js");
//purchase
const pbookingRoutes = require("./routes/purchase/pbooking.routes.js");
const preceiptRoutes = require("./routes/purchase/preceipt.routes.js");
const pinvoiceRoutes = require("./routes/purchase/pinvoice.routes.js");
//sales
const sbookingRoutes = require("./routes/sales/sbooking.routes.js");
const sreceiptRoutes = require("./routes/sales/sreceipt.routes.js");
const sinvoiceRoutes = require("./routes/sales/sinvoice.routes.js");
//reports
const shopRoutes = require("./routes/reports/shop.routes.js");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: "*", methods: ["GET", "POST"] }));
app.use(rateLimiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API Key validation middleware
require("dotenv").config();
const authMiddleware = require("./middlewares/authMiddleware");

app.use("/api", (req, res, next) => {
  const apiKey = req.headers["app-api-key"];
  const validKey = process.env.APP_API_KEY;

  //console.log("apiKey", apiKey);

  if (!apiKey || apiKey !== validKey) {
    return res.status(401).json({ error: "Invalid or missing API key" });
  }

  next();
});

// JWT Authentication Middleware
app.use("/api", authMiddleware);

// Initialize database
//initData();

// Routes

//auth
app.use("/api/auth", authRoutes);
//crm
app.use("/api/crm/contacts", contactsRoutes);
app.use("/api/crm/order-route", orderRoutes);
app.use("/api/crm/dzone", dzoneRoutes);
app.use("/api/crm/tarea", tareaRoutes);
app.use("/api/crm/territory", territoryRoutes);
app.use("/api/crm/delivery-van", deliveryVanRoutes);
//hrms
app.use("/api/hrms/employees", employeesRoutes);
//accounts
app.use("/api/accounts/accounts", accountsRoutes);
app.use("/api/accounts/accounts-heads", accountsHeadsRoutes);
app.use("/api/accounts/accounts-ledgers", accountsLedgerRoutes);
app.use("/api/accounts/payables", payablesRoutes);
app.use("/api/accounts/receivables", receivablesRoutes);
app.use("/api/accounts/expenses", expensesRoutes);
//setup
app.use("/api/setup/business", businessRoutes);
app.use("/api/setup/users", usersRoutes);
app.use("/api/setup/database", databaseRoutes);
app.use("/api/setup/closing", closingRoutes);
app.use("/api/setup/configs", configsRoutes);
app.use("/api/setup/default-data", defaultDataRoutes);
//inventory
app.use("/api/inventory/units", unitsRoutes);
app.use("/api/inventory/categories", categoriesRoutes);
app.use("/api/inventory/products", productsRoutes);
app.use("/api/inventory/attributes", attributesRoutes);
app.use("/api/inventory/stockreports", stockreportsRoutes);
app.use("/api/inventory/itransfer", itransferRoutes);
//support
app.use("/api/support/grains", grainsRoutes);
app.use("/api/support/notes", notesRoutes);
app.use("/api/support/sessions", sessionsRoutes);
app.use("/api/support/tickets", ticketsRoutes);
app.use("/api/support/socials", socialsRoutes);
//purchase
app.use("/api/purchase/pbooking", pbookingRoutes);
app.use("/api/purchase/preceipt", preceiptRoutes);
app.use("/api/purchase/pinvoice", pinvoiceRoutes);
//sales
app.use("/api/sales/sbooking", sbookingRoutes);
app.use("/api/sales/sreceipt", sreceiptRoutes);
app.use("/api/sales/sinvoice", sinvoiceRoutes);
//reports
app.use("/api/reports/shop", shopRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Backend server is running" });
});
app.get("/api/ping", (req, res) => {
  res.status(200).send({ timestamp: Date.now() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});
// Use error handling middleware
const errorHandler = require("./middlewares/errorHandler");
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
