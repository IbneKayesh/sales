const user_tables = () => ({
  shops: `
          CREATE TABLE IF NOT EXISTS shops (
            shop_id TEXT PRIMARY KEY,
            shop_name TEXT,
            shop_address TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `,

  users: `
          CREATE TABLE IF NOT EXISTS users (
            user_id TEXT PRIMARY KEY,
            user_email TEXT UNIQUE NOT NULL,
            user_password TEXT NOT NULL,
            user_mobile TEXT,
            user_name TEXT,
            recovery_code TEXT,
            user_role TEXT DEFAULT 'User',
            shop_id TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `,
});

module.exports = user_tables;
