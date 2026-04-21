const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");


const rateLimiter = require("./middlewares/rateLimiter.js");
//auth
const authRoutes = require("./routes/auth");
//crm
const crmRoutes = require("./routes/crm");
//hrms
const hrmsRoutes = require("./routes/hrms");
//accounts
const accountsRoutes = require("./routes/accounts");
//setup
const setupRoutes = require("./routes/setup");
//inventory
const inventoryRoutes = require("./routes/inventory");
//support
const supportRoutes = require("./routes/support");
//purchase
const purchaseRoutes = require("./routes/purchase");
//sales
const salesRoutes = require("./routes/sales");
//reports
const reportsRoutes = require("./routes/reports");
//mobile
const mobileRoutes = require("./routes/mobile");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: "*", methods: ["GET", "POST"] }));
app.use(rateLimiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require("dotenv").config();
const authMiddleware = require("./middlewares/authMiddleware");

// JWT Authentication Middleware
app.use("/api", authMiddleware);

// Initialize database

//initData();

// Routes

//auth
app.use("/api/auth", authRoutes);
//crm
app.use("/api/crm", crmRoutes);
//hrms
app.use("/api/hrms", hrmsRoutes);
//accounts
app.use("/api/accounts", accountsRoutes);
//setup
app.use("/api/setup", setupRoutes);
//inventory
app.use("/api/inventory", inventoryRoutes);
//support
app.use("/api/support", supportRoutes);
//purchase
app.use("/api/purchase", purchaseRoutes);
//sales
app.use("/api/sales", salesRoutes);
//reports
app.use("/api/reports", reportsRoutes);
//mobile
app.use("/api/mobile", mobileRoutes);


// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Backend server is running", data: null });
});
app.get("/api/ping", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Ping successful",
    data: {
      timestamp: Date.now(),
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    data: null,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "An unexpected error occurred, Internal Server Error",
    data: null,
  });
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
