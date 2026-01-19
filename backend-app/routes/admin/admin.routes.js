const express = require("express");
const router = express.Router();
const { getAllSessions, killSession } = require("../../sessionManager");
const authMiddleware = require("../../middlewares/authMiddleware");

// Admin-only middleware
function adminOnly(req, res, next) {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
  next();
}

// List all active sessions
router.get("/sessions", authMiddleware, adminOnly, (req, res) => {
  const sessions = getAllSessions();
  res.json({ success: true, sessions });
});

// Kill a session by sessionId
router.delete("/sessions/:sessionId", authMiddleware, adminOnly, (req, res) => {
  const { sessionId } = req.params;
  killSession(sessionId);
  res.json({ success: true, message: "Session killed" });
});

module.exports = router;
