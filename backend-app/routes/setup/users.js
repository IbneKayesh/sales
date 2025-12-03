const express = require("express");
const router = express.Router();

const {
  runScriptsSequentially,
  dbRun,
  dbGet,
  dbAll,
} = require("../../db/asyncScriptsRunner");

//Get all users
router.get("/", async (req, res) => {
  try {
    const sql = `SELECT u.*, 0 as ismodified
    FROM users u ORDER BY user_id`;
    const rows = await dbAll(sql, []);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//get by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const sql =
      "SELECT u.*, 0 as ismodified FROM users u WHERE user_id = ?";
    const row = await dbGet(sql, [id]);
    if (!row) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(row);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//create new user
router.post("/", async (req, res) => {
  const {
    user_id,
    username,
    password,
    email,
    role,
  } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const sql = `INSERT INTO users (user_id, username, password, email, role)
    VALUES (?, ?, ?, ?, ?)`;
    const params = [
      user_id,
      username,
      password,
      email,
      role,
    ];
    await dbRun(sql, params, `Created user ${username}`);
    res.status(201).json({ user_id, ...req.body });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


//update user
router.post("/update", async (req, res) => {
  const {
    user_id,
    username,
    password,
    email,
    role,
  } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const sql = `UPDATE users SET
    username = ?,
    password = ?,
    email = ?,
    role = ?,
    updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ?`;
    const params = [
      username,
      password,
      email,
      role,
      user_id,
    ];
    const result = await dbRun(sql, params, `Updated user ${username}`);
    if (result.changes === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ user_id, ...req.body });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


//Delete user
router.post("/delete", async (req, res) => {
  const { user_id, username } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const sql = "DELETE FROM users WHERE user_id = ?";
    const result = await dbRun(sql, [user_id], `Deleted user ${username}`);
    if (result.changes === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});




//change password
router.post("/change-password", async (req, res) => {
  const {
    user_id,
    current_password,
    new_password,
  } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  if (!current_password) {
    return res.status(400).json({ error: "Current password is required" });
  }

  if (!new_password) {
    return res.status(400).json({ error: "New password is required" });
  }
  try {
    //fetch user with current password
    const user = await dbGet(
      "SELECT * FROM users WHERE user_id = ? AND password = ?",
      [user_id, current_password]
    );
    if (!user) {
      return res.status(400).json({ error: "Invalid current password" });
    }
    //update current password
    const sql = `UPDATE users SET
    password = ?,
    updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ?`;
    const params = [
      new_password,
      user_id,
    ];
    const result = await dbRun(sql, params, `Updated user password ${user_id}`);
    if (result.changes === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
