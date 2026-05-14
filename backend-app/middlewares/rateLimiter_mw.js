const rateLimit = require('express-rate-limit');

const rateLimiter_mw = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 5000 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Access denied. Too many requests from this IP, please try again after 15 minutes.",
      data: null,
    });
  },
});



module.exports = rateLimiter_mw;