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
//M01 :: Setup
const m01Routes = require("./routes/M01");
//M02 :: Sales
const m02Routes = require("./routes/M02");
//M03 :: Purchase
const m03Routes = require("./routes/M03");
//M04 :: Inventory
const m04Routes = require("./routes/M04");
//M05 :: Manufacturing
const m05Routes = require("./routes/M05");
//M06 :: CRM
const m06Routes = require("./routes/M06");
//M07 :: HRMS
const m07Routes = require("./routes/M07");
//M08 :: Accounts
const m08Routes = require("./routes/M08");

const app = express();

// ✅ ADD THIS LINE RIGHT AFTER app initialization
app.set("trust proxy", 1); // trust first proxy

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: "*", methods: ["GET", "POST"] }));

app.use(rateLimiter_mw);
//stop massive JSON payload
app.use(bodyParser.json({ limit: "100kb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "100kb" }));

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
//M01 :: Setup
app.use("/api/M01", m01Routes);
//M02 :: Sales
app.use("/api/M02", m02Routes);
//M03 :: Purchase
app.use("/api/M03", m03Routes);
//M04 :: Inventory
app.use("/api/M04", m04Routes);
//M05 :: Manufacturing
app.use("/api/M05", m05Routes);
//M06 :: CRM
app.use("/api/M06", m06Routes);
//M07 :: HR
app.use("/api/M07", m07Routes);
//M08 :: Accounts
app.use("/api/M08", m08Routes);

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

//Home Page
app.get("/", (req, res) => {
  res.type("html").send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>bSuite API</title>

  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      font-family: Inter, Arial, sans-serif;
      background: #eef2f7;
      color: #fff;
    }

    .card {
      width: 100%;
      max-width: 760px;
      min-height: 400px;
      display: flex;
      overflow: hidden;
      border-radius: 24px;
      background: #111827;
      box-shadow: 0 25px 60px rgba(15, 23, 42, 0.2);
    }

    .card-left {
      width: 38%;
      padding: 45px 35px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: linear-gradient(145deg, #2563eb, #1d4ed8);
      position: relative;
      overflow: hidden;
    }

    .card-left::before,
    .card-left::after {
      content: "";
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.08);
    }

    .card-left::before {
      width: 220px;
      height: 220px;
      top: -100px;
      right: -100px;
    }

    .card-left::after {
      width: 180px;
      height: 180px;
      bottom: -90px;
      left: -90px;
    }

    .logo {
      position: relative;
      z-index: 1;
      width: 70px;
      height: 70px;
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.25);
      font-size: 28px;
      font-weight: 800;
      letter-spacing: -2px;
    }

    .brand {
      position: relative;
      z-index: 1;
    }

    .brand h1 {
      font-size: 34px;
      margin-bottom: 8px;
      letter-spacing: -1.5px;
    }

    .brand p {
      color: rgba(255, 255, 255, 0.75);
      font-size: 13px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }

    .version {
      position: relative;
      z-index: 1;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.65);
    }

    .card-right {
      flex: 1;
      padding: 45px 42px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      background: #111827;
    }

    .welcome {
      margin-bottom: 30px;
    }

    .welcome span {
      display: block;
      margin-bottom: 8px;
      color: #60a5fa;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
    }

    .welcome h2 {
      font-size: 26px;
      line-height: 1.2;
      color: #f9fafb;
    }

    .details {
      display: grid;
      gap: 16px;
    }

    .detail {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .icon {
      width: 40px;
      height: 40px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      background: #1f2937;
      color: #60a5fa;
      font-size: 17px;
    }

    .detail-content small {
      display: block;
      margin-bottom: 2px;
      color: #6b7280;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    .detail-content p,
    .detail-content a {
      color: #e5e7eb;
      font-size: 14px;
      text-decoration: none;
    }

    .detail-content a:hover {
      color: #60a5fa;
    }

    .footer {
      margin-top: 30px;
      padding-top: 18px;
      border-top: 1px solid #1f2937;
      color: #6b7280;
      font-size: 11px;
    }

    @media (max-width: 650px) {
      body {
        padding: 16px;
      }

      .card {
        flex-direction: column;
        min-height: auto;
      }

      .card-left {
        width: 100%;
        min-height: 240px;
        padding: 30px;
      }

      .card-right {
        padding: 32px 26px;
      }
    }
  </style>
</head>

<body>

  <div class="card">

    <div class="card-left">
      <div class="logo">bS</div>

      <div class="brand">
        <h1>bSuite</h1>
        <p>Business Solutions</p>
      </div>

      <div class="version">
        API v1.0.0
      </div>
    </div>

    <div class="card-right">

      <div class="welcome">
        <span>Digital Business Card</span>
        <h2>Welcome to the bSuite</h2>
      </div>

      <div class="details">

        <div class="detail">
          <div class="icon">👤</div>
          <div class="detail-content">
            <small>Founder / Author</small>
            <p>Kayesh</p>
          </div>
        </div>

        <div class="detail">
          <div class="icon">☎</div>
          <div class="detail-content">
            <small>Phone</small>
            <a href="tel:+8801713003745">
              +8801713-003745
            </a>
          </div>
        </div>

        <div class="detail">
          <div class="icon">✉</div>
          <div class="detail-content">
            <small>Email</small>
            <a href="mailto:sandgraindigital@gmail.com">
              sandgraindigital@gmail.com
            </a>
          </div>
        </div>

        <div class="detail">
          <div class="icon">⌖</div>
          <div class="detail-content">
            <small>Location</small>
            <p>Dhaka, Bangladesh</p>
          </div>
        </div>

      </div>

      <div class="footer">
        Sand Grain Digital © 2026. All rights reserved.
      </div>

    </div>

  </div>

</body>
</html>
  `);
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
    console.error(
      "Could not close connections in time, forcefully shutting down",
    );
    process.exit(1);
  }, 10000);
}

module.exports = app;
