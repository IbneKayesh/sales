const express = require("express");
const { db } = require("../db/init");
const router = express.Router();
const { generateGuid } = require("../guid.js");
const {
  runScriptsSequentially,
  dbRun,
  dbGet,
  dbAll,
} = require("../db/asyncScriptsRunner");

// Login endpoint
router.post("/login", (req, res) => {
  const { user_email, user_password } = req.body;

  if (!user_email || !user_password) {
    return res
      .status(400)
      .json({ success: false, error: "User Email and password are required" });
  }
  const sql = `
  SELECT usr.*, shp.shop_name, shp.shop_address
  FROM users usr
  LEFT JOIN shops shp ON usr.shop_id = shp.shop_id
  WHERE usr.user_email = ? AND usr.user_password = ?`;

  db.get(sql, [user_email, user_password], (err, row) => {
    if (err) {
      console.error("Database error:", err);
      return res
        .status(500)
        .json({ success: false, error: "Internal server error" });
    }

    if (row) {
      // In a real app, you'd use JWT or sessions here
      res.json({
        success: true,
        message: "User logged in successfully!",
        user: {
          user_id: row.user_id,
          user_email: row.user_email,
          user_mobile: row.user_mobile,
          user_name: row.user_name,
          user_role: row.user_role,
          shop_id: row.shop_id,
          shop_name: row.shop_name,
          shop_address: row.shop_address,
        },
      });
    } else {
      res
        .status(401)
        .json({ success: false, error: "Invalid username or password" });
    }
  });
});

// Logout endpoint (for consistency, though not much needed with stateless auth)
router.post("/logout", (req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
});

// Register endpoint
router.post("/register", async (req, res) => {
  try {
    const { shop_name, user_email, user_password } = req.body;

    if (!shop_name || !user_email || !user_password) {
      return res.status(400).json({
        success: false,
        error: "Shop Name, User Email and password are required",
      });
    }

    const shop_id = generateGuid();
    const user_id = generateGuid();
    const recovery_code = user_email.split("@")[0];

    //build scripts
    const scripts = [];

    //insert shop

    scripts.push({
      label: "1 of 2 :: Register new shop",
      sql: `INSERT INTO shops (shop_id, shop_name) VALUES (?, ?)`,
      params: [shop_id, shop_name],
    });

    //insert user

    scripts.push({
      label: "2 of 2 :: Register new user",
      sql: `INSERT INTO users (user_id, user_email, user_password, recovery_code, user_role, shop_id)
    VALUES (?, ?, ?, ?, ?, ?)`,
      params: [
        user_id,
        user_email,
        user_password,
        recovery_code,
        "Admin",
        shop_id,
      ],
    });

    //run scripts
    const results = await runScriptsSequentially(scripts, {
      useTransaction: true,
    });

    if (!results.every((r) => r.success)) {
      return res.status(500).json({ error: "Failed to register user" });
    }
    // ❗ Only one response is sent
    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      user: {
        user_id: user_id,
        user_email: user_email,
        user_mobile: "",
        user_name: "",
        user_role: "Admin",
        shop_id: shop_id,
        shop_name: shop_name,
        shop_address: "",
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
