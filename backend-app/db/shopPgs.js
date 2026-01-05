// backend-app/db/shopPgs.js
const shopPgs = () => {
  const shop = `
    CREATE TABLE IF NOT EXISTS shops (
      shop_id TEXT PRIMARY KEY,
      shop_name TEXT NOT NULL,
      shop_address TEXT,
      bin_no TEXT,
      open_date TIMESTAMP,
      created_at TIMESTAMP NOT NULL DEFAULT now(),
      updated_at TIMESTAMP NOT NULL DEFAULT now()
    );
  `;

  return { shop };
};

module.exports = shopPgs;
