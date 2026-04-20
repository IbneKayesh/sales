const jwt = require("jsonwebtoken");
const { getSession } = require("../sessionManager"); // import your session manager

const authMiddleware = (req, res, next) => {
  const apiKey = req.headers["sgd-auth"];
  const validKey = process.env.APP_API_KEY;

  if (!apiKey || apiKey !== validKey) {
      return res.status(401).json({
      success: false,
      message: "Access denied. Invalid SGD Key.",
      data: null,
    });
  }

  // Public paths whitelist
  const publicPaths = [
    "/api/auth/login",
    "/api/auth/logout",
    "/api/auth/register",
    "/api/auth/recover-password",
    "/api/auth/reset-password",
    "/api/health",
    "/api/ping",
    "/api/mobile/auth/login",
    "/api/auth/v1/login",
  ];

  // Normalize path to ignore query parameters and trailing slashes
  const requestPath = req.originalUrl.split("?")[0].replace(/\/$/, "");

  // Check if strict match or starts with (for nested routes if needed, but strict is safer for now)
  if (publicPaths.includes(requestPath)) {
    return next();
  }

  // Check for Authorization header
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
      data: null,
    });
  }

  const token = authHeader.split(" ")[1]; // Bearer <token>
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. Invalid token format.",
      data: null,
    });
  }

  try {
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in environment variables");
      return res.status(500).json({
        success: false,
        message: "Access denied. JWT Interception is failed.",
        data: null,
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if session exists and is active
    const session = getSession(decoded.sessionId);
    if (!session) {
      return res.status(401).json({
      success: false,
      message: "Access denied. Session is expired or invalid.",
      data: null,
    });
    }

    // Attach user info and session to request
    req.user = decoded;
    //req.session = session;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Access denied. Invalid token format.",
      data: null,
    });
  }
};

module.exports = authMiddleware;
