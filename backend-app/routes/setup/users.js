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
    const sql = `SELECT u.*, 0 as edit_stop
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
    const sql = "SELECT u.*, 0 as edit_stop FROM users u WHERE user_id = ?";
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
    user_email,
    user_password,
    user_mobile,
    user_name,
    user_role,
    shop_id,
  } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }
  if (!user_email) {
    return res.status(400).json({ error: "User email is required" });
  }

  if (!user_password) {
    return res.status(400).json({ error: "User password is required" });
  }

  if (!user_role) {
    return res.status(400).json({ error: "User role is required" });
  }

  if (!shop_id) {
    return res.status(400).json({ error: "Shop ID is required" });
  }

  const recovery_code = user_email.split("@")[0];

  try {
    const sql = `INSERT INTO users (user_id, user_email, user_password, user_mobile, user_name, recovery_code, user_role, shop_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [
      user_id,
      user_email,
      user_password,
      user_mobile,
      user_name,
      recovery_code,
      user_role,
      shop_id,
    ];
    await dbRun(sql, params, `Created user ${user_name}`);
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
    user_email,
    user_password,
    user_mobile,
    user_name,
    user_role,
  } = req.body;

  
  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }
  if (!user_email) {
    return res.status(400).json({ error: "User email is required" });
  }

  if (!user_password) {
    return res.status(400).json({ error: "User password is required" });
  }

  if (!user_role) {
    return res.status(400).json({ error: "User role is required" });
  }

  try {
    const sql = `UPDATE users SET
    user_email = ?,
    user_password = ?,
    user_mobile = ?,
    user_name = ?,
    user_role = ?,
    updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ?`;
    const params = [
      user_email,
      user_password,
      user_mobile,
      user_name,
      user_role,
      user_id,
    ];
    const result = await dbRun(sql, params, `Updated user ${user_name}`);
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
  const { user_id, user_name } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const sql = "DELETE FROM users WHERE user_id = ?";
    const result = await dbRun(sql, [user_id], `Deleted user ${user_name}`);
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
  const { user_id, current_password, new_password } = req.body;

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
      "SELECT * FROM users WHERE user_id = ? AND user_password = ?",
      [user_id, current_password]
    );
    if (!user) {
      return res.status(400).json({ error: "Invalid current password" });
    }
    //update current password
    const sql = `UPDATE users SET
    user_password = ?,
    updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ?`;
    const params = [new_password, user_id];

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
