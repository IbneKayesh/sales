const express = require("express");
const router = express.Router();
const { getAllSessions, killSession } = require("../../sessionManager");
const authMiddleware = require("../../middlewares/authMiddleware");

// Admin-only middleware
function adminOnly(req, res, next) {
  // if (req.user.role.toLowerCase() !== "admin")
  //   return res.status(403).json({ error: "Forbidden" });
  next();
}

// List all active sessions
router.post("/all", authMiddleware, adminOnly, (req, res) => {
  try {
    const { users } = req.body;
    const sessions = getAllSessions(users);
    res.json({
      success: true,
      message: "Sessions fetched successfully",
      data: sessions,
    });
  } catch (error) {
    console.error("database action error:", error);
    res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: null,
    });
  }
});

// Kill a session by sessionId
router.post("/delete", authMiddleware, adminOnly, (req, res) => {
  try {
    const { sessionId } = req.body;
    killSession(sessionId);
    res.json({
      success: true,
      message: "Session killed successfully",
      data: null,
    });
  } catch (error) {
    console.error("database action error:", error);
    res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: null,
    });
  }
});

module.exports = router;
