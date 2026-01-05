const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun } = require("../../db/database");

// ---------------- GET ALL USERS ----------------
router.get("/", async (req, res) => {
  try {
    const sql = `SELECT u.*, s.shop_name, 0 as edit_stop
    FROM users u
    LEFT JOIN shops s ON u.shop_id = s.shop_id
    ORDER BY user_name`;
    const rows = await dbGetAll(sql, [], "Get all users");

    res.json({
      message: "Fetched all users",
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({
      message: "Internal server error",
      data: [],
    });
  }
});

// ---------------- GET USER BY ID ----------------
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "SELECT u.*, 0 as edit_stop FROM users u WHERE user_id = $1";
    const row = await dbGet(sql, [id], "Get user by id");

    if (!row) {
      return res.status(404).json({
        message: "User not found",
        data: {},
      });
    }

    res.json({
      message: "Fetched user",
      data: row,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({
      message: "Internal server error",
      data: {},
    });
  }
});

// ---------------- CREATE USER ----------------
router.post("/", async (req, res) => {
  const {
    user_id,
    user_email,
    user_password,
    user_mobile,
    user_name,
    recovery_code,
    user_role,
    shop_id,
  } = req.body;

  //console.log("user_id: " + JSON.stringify(req.body));

  if (!user_id || !user_email || !user_password || !user_mobile || !user_name || !recovery_code || !shop_id) {
    return res.status(400).json({
      message: "user_id, user_email, user_password, user_mobile, user_name, recovery_code, and shop_id are required",
      data: req.body,
    });
  }

  try {
    const sql = `
      INSERT INTO users (user_id, user_email, user_password, user_mobile, user_name, recovery_code, user_role, shop_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;
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

    res.status(201).json({
      message: "User created successfully",
      data: req.body,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      message: "Internal server error",
      data: {},
    });
  }
});

// ---------------- UPDATE USER ----------------
router.post("/update", async (req, res) => {
  const { user_id, user_email, user_mobile, user_name, recovery_code, user_role, shop_id } =
    req.body;

  if (!user_id || !user_email || !recovery_code || !user_role || !shop_id) {
    return res.status(400).json({
      message: "user_id, user_email, recovery_code, user_role, shop_id are required",
      data: req.body,
    });
  }

  try {
    const sql = `
      UPDATE users
      SET user_email = $1,
          user_mobile = $2,
          user_name = $3,
          user_role = $4,
          recovery_code = $5,
          shop_id = $6,
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $7
    `;
    const params = [
      user_email,
      user_mobile,
      user_name,
      user_role,
      recovery_code,
      shop_id,
      user_id,
    ];

    const resultCount = await dbRun(sql, params, `Updated user ${user_name}`);

    if (resultCount === 0) {
      return res.status(404).json({
        message: "User not found",
        data: req.body,
      });
    }

    res.json({
      message: "User updated successfully",
      data: req.body,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      message: "Internal server error",
      data: {},
    });
  }
});

// ---------------- DELETE USER ----------------
router.post("/delete", async (req, res) => {
  const { user_id, user_name } = req.body;

  if (!user_id) {
    return res.status(400).json({
      message: "user_id is required",
      data: req.body,
    });
  }

  try {
    const sql = "DELETE FROM users WHERE user_id = $1";
    const resultCount = await dbRun(sql, [user_id], `Deleted user ${user_name}`);

    if (resultCount === 0) {
      return res.status(404).json({
        message: "User not found",
        data: req.body,
      });
    }

    res.json({
      message: "User deleted successfully",
      data: req.body,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      message: "Internal server error",
      data: {},
    });
  }
});

// ---------------- CHANGE PASSWORD ----------------
router.post("/change-password", async (req, res) => {
  const { user_id, current_password, new_password } = req.body;

  if (!user_id || !current_password || !new_password) {
    return res.status(400).json({
      message: "user_id, current_password, and new_password are required",
      data: req.body,
    });
  }

  try {
    //fetch user with current password
    const user = await dbGet(
      "SELECT * FROM users WHERE user_id = ? AND user_password = ?",
      [user_id, current_password]
    );
    if (!user) {
      return res.status(400).json({
        message: "Invalid current password",
        data: req.body,
      });
    }
    //update current password
    const sql = `UPDATE users SET
    user_password = ?,
    updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ?`;
    const params = [new_password, user_id];

    const resultCount = await dbRun(
      sql,
      params,
      `Updated user password ${user_id}`
    );

    if (resultCount === 0) {
      return res.status(404).json({
        message: "User not found",
        data: req.body,
      });
    }

    res.json({
      message: "Password updated successfully",
      data: req.body,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      message: "Internal server error",
      data: {},
    });
  }
});

module.exports = router;
