const jwt = require("jsonwebtoken");
const { getSession } = require("../sessionManager"); // import your session manager

const authMiddleware = (req, res, next) => {
  // Public paths whitelist
  const publicPaths = [
    "/api/auth/login",
    "/api/auth/logout",
    "/api/auth/register",
    "/api/auth/recover-password",
    "/api/auth/reset-password",
    "/api/health",
    "/api/ping",
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
    return res
      .status(401)
      .json({ success: false, message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1]; // Bearer <token>
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. Invalid token format.",
    });
  }

  try {
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in environment variables");
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if session exists and is active
    // const session = getSession(decoded.sessionId);
    // if (!session) {
    //   return res
    //     .status(401)
    //     .json({ success: false, message: "Session expired or invalid." });
    // }

    // Attach user info and session to request
    req.user = decoded;
    //req.session = session;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token." });
  }
};

module.exports = authMiddleware;
