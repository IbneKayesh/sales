// sessionManager.js
const sessions = {}; // sessionId -> session data

function createSession(user) {
  const sessionId = require("uuid").v4();
  const now = Date.now();
  const session = {
    sessionId,
    userId: user.id,
    email: user.users_email,
    role: user.users_drole,
    createdAt: now,
    lastActivity: now,
    expiresAt: now + 24 * 60 * 60 * 1000, // 24h
  };
  sessions[sessionId] = session;
  return session;
}

function getSession(sessionId) {
  const session = sessions[sessionId];
  if (!session) return null;
  if (session.expiresAt < Date.now()) {
    delete sessions[sessionId];
    return null;
  }
  session.lastActivity = Date.now();
  return session;
}

function getAllSessions() {
  // return only active sessions
  const now = Date.now();
  return Object.values(sessions).filter(s => s.expiresAt > now);
}

function killSession(sessionId) {
  delete sessions[sessionId];
}

setInterval(() => {
    const now = Date.now();
    Object.keys(sessions).forEach(id => {
      if (sessions[id].expiresAt < now) delete sessions[id];
    });
  }, 60_000);

module.exports = { createSession, getSession, getAllSessions, killSession };
