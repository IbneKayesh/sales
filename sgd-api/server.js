const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

//api import
const inventoryRoutes = require("./routes/inventory");

const app = express();
const PORT = 3002;

// Connect to database

// Middleware
app.use(cors({ origin: "*", methods: ["GET", "POST"] }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Inventory routes
app.use("/api/inventory", inventoryRoutes);

app.get("/api/v1/ping", (req, res) => {
  res.status(200).json({
    status: true,
    message: "Ping successful",
    data: {
      timestamp: Date.now(),
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);

  res.status(500).json({
    status: false,
    message: err.message || "Internal server error",
    data: null,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: false,
    message: "Route is not found",
    data: null,
  });
});

app.listen(PORT, () => {
  console.log(`Server http://localhost:${PORT}`);
});

module.exports = app;
