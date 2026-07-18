require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
// 1. Import the new manager
const { closeAllPools, connectDB } = require("./db/sqlManagerpg");

const rateLimiter_mw = require("./middlewares/rateLimiter_mw");
const auth_mw = require("./middlewares/auth_mw");
const db_mw = require("./middlewares/db_mw");
//auth
const authRoutes = require("./routes/auth");
//settings
const settingsRoutes = require("./routes/settings");
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
//M05 :: Manufacturing
const m05Routes = require("./routes/M05");

const app = express();

// ✅ ADD THIS LINE RIGHT AFTER app initialization
app.set("trust proxy", 1); // trust first proxy

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: "*", methods: ["GET", "POST"] }));

app.use(rateLimiter_mw);
//stop massive JSON payload
app.use(bodyParser.json({ limit: '100kb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '100kb' }));

// 1. Multi-Tenant Database Context (scoped by x-tenant-id header)
app.use(db_mw);

// 2. JWT Authentication Middleware (runs within DB context)
app.use("/api", auth_mw);

// Routes

//auth
app.use("/api/auth", authRoutes);
//settings
app.use("/api/settings", settingsRoutes);
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
//M05 :: Manufacturing
app.use("/api/manufacturing", m05Routes);

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
    message:
      err.message || "An unexpected error occurred, Internal Server Error",
    data: null,
  });
});

const server = app.listen(PORT, async () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  
  // Verify default DB connection on startup
  try {
    await connectDB();
  } catch (err) {
    console.error("⚠️ Initial database connection check failed:", err.message);
  }
});

// Graceful Shutdown
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

async function shutdown() {
    console.log("🛑 Shutdown signal received. Closing server...");
    server.close(async () => {
        console.log("HTTP server closed.");
        await closeAllPools();
        process.exit(0);
    });
    
    // Force shutdown after 10s if graceful fails
    setTimeout(() => {
        console.error("Could not close connections in time, forcefully shutting down");
        process.exit(1);
    }, 10000);
}

module.exports = app;
