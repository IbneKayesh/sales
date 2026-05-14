const { dbContext, getPoolForKey } = require("../db/sqlManagerpg");

/**
 * Multi-tenant Middleware
 * Extracts the tenant ID from the 'x-tenant-id' header and sets the database context.
 */
const db_mw = (req, res, next) => {
  const dbKey = req.headers["x-tenant-id"] || "default";

  try {
    // Get the correct connection pool for this specific key
    const pool = getPoolForKey(dbKey);
    
    // IMPORTANT: Every function called inside this 'run' block 
    // will automatically use this 'pool' via AsyncLocalStorage
    dbContext.run(pool, () => {
      next();
    });
  } catch (err) {
    console.error(`❌ Multi-tenant Context Error [${dbKey}]:`, err.message);
    res.status(500).json({ 
      success: false, 
      message: "Could not connect to the assigned database instance." 
    });
  }
};

module.exports = db_mw;
