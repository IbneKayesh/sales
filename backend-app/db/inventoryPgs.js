// backend-app/db/inventoryPgs.js
const inventoryPgs = () => {
  const units = `
    CREATE TABLE IF NOT EXISTS units (
      unit_id TEXT PRIMARY KEY,
      unit_name TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT now(),
      updated_at TIMESTAMP NOT NULL DEFAULT now()
    );
  `;

  const categories = `
    CREATE TABLE IF NOT EXISTS categories (
      category_id TEXT PRIMARY KEY,
      category_name TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT now(),
      updated_at TIMESTAMP NOT NULL DEFAULT now()
    );
  `;

  const products = `
  CREATE TABLE IF NOT EXISTS products (
    product_id TEXT PRIMARY KEY,
    product_code TEXT,
    product_name TEXT NOT NULL,
    product_desc TEXT,

    category_id TEXT NOT NULL,
    small_unit_id TEXT NOT NULL,
    unit_difference_qty INTEGER DEFAULT 1,
    large_unit_id TEXT NOT NULL,

    stock_qty NUMERIC(18,4) DEFAULT 0,
    purchase_price NUMERIC(18,4) DEFAULT 0,
    sales_price NUMERIC(18,4) DEFAULT 0,
    discount_percent NUMERIC(10,4) DEFAULT 0,
    vat_percent NUMERIC(10,4) DEFAULT 0,
    cost_price_percent NUMERIC(10,4) DEFAULT 0,
    margin_price NUMERIC(18,4) DEFAULT 0,

    purchase_booking_qty NUMERIC(18,4) DEFAULT 0,
    sales_booking_qty NUMERIC(18,4) DEFAULT 0,

    shop_id TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now(),

    CONSTRAINT fk_product_category 
        FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE RESTRICT,

    CONSTRAINT fk_product_small_unit 
        FOREIGN KEY (small_unit_id) REFERENCES units(unit_id) ON DELETE RESTRICT,

    CONSTRAINT fk_product_large_unit 
        FOREIGN KEY (large_unit_id) REFERENCES units(unit_id) ON DELETE RESTRICT,

    CONSTRAINT fk_product_shop 
        FOREIGN KEY (shop_id) REFERENCES shops(shop_id) ON DELETE SET NULL
);
`

  return { units, categories, products };
};

module.exports = inventoryPgs;
