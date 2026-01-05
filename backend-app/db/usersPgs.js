// backend-app/db/usersPgs.js
const usersPgs = () => {
  const user = `
    CREATE TABLE IF NOT EXISTS users (
      user_id TEXT PRIMARY KEY,
      user_email TEXT UNIQUE NOT NULL,
      user_password TEXT NOT NULL,
      user_mobile TEXT,
      user_name TEXT,
      recovery_code TEXT,
      user_role TEXT DEFAULT 'User',
      shop_id TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT now(),
      updated_at TIMESTAMP NOT NULL DEFAULT now(),
      CONSTRAINT fk_shop FOREIGN KEY (shop_id) REFERENCES shops(shop_id) ON DELETE SET NULL
    );
  `;


  return { user };
};

module.exports = usersPgs;
