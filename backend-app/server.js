const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const rateLimiter = require("./middlewares/rateLimiter.js");
const { initData } = require("./db/initData.js");

//auth
const authRoutes = require("./routes/auth/auth.routes.js");
const businessRoutes = require("./routes/auth/business.routes.js");
const usersRoutes = require("./routes/auth/users.routes.js");
//crm
const contactsRoutes = require("./routes/crm/contacts.routes.js");
//accounts
const accountsRoutes = require("./routes/accounts/accounts.routes.js");
const accountsHeadsRoutes = require("./routes/accounts/accountsHeads.routes.js");
const accountsLedgerRoutes = require("./routes/accounts/accountsLedger.routes.js");
//setup
const closingRoutes = require("./routes/setup/closing.routes.js");
//inventory
const unitsRoutes = require("./routes/inventory/units.routes.js");
const categoriesRoutes = require("./routes/inventory/categories.routes.js");
const productsRoutes = require("./routes/inventory/products.routes.js");
//support
const grainsRoutes = require("./routes/support/grains.routes.js");
const notesRoutes = require("./routes/support/notes.routes.js");
//purchase
const pbookingRoutes = require("./routes/purchase/pbooking.routes.js");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(rateLimiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API Key validation middleware
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
app.use("/api/auth/business", businessRoutes);
app.use("/api/auth/users", usersRoutes);
//crm
app.use("/api/crm/contacts", contactsRoutes);
//accounts
app.use("/api/accounts/accounts", accountsRoutes);
app.use("/api/accounts/accounts-heads", accountsHeadsRoutes);
app.use("/api/accounts/accounts-ledgers", accountsLedgerRoutes);
//setup
app.use("/api/setup/closing", closingRoutes);
//inventory
app.use("/api/inventory/units", unitsRoutes);
app.use("/api/inventory/categories", categoriesRoutes);
app.use("/api/inventory/products", productsRoutes);
//support
app.use("/api/support/grains", grainsRoutes);
app.use("/api/support/notes", notesRoutes);
//purchase
app.use("/api/purchase/pbooking", pbookingRoutes);

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
