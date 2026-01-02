const inventory_tables = () => ({
  units: `
        CREATE TABLE IF NOT EXISTS units (
          unit_id TEXT PRIMARY KEY,
          unit_name TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `,

  categories: `
    CREATE TABLE IF NOT EXISTS categories (
        category_id TEXT PRIMARY KEY,
        category_name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    `,
  products: `
          CREATE TABLE IF NOT EXISTS products (
            product_id TEXT PRIMARY KEY,
            product_code TEXT,
            product_name TEXT NOT NULL,
            product_desc TEXT,
            category_id TEXT NOT NULL,
            small_unit_id TEXT NOT NULL,
            unit_difference_qty INTEGER DEFAULT 1,
            large_unit_id TEXT NOT NULL,
            stock_qty REAL DEFAULT 0,
            purchase_price REAL DEFAULT 0,
            sales_price REAL DEFAULT 0,
            discount_percent REAL DEFAULT 0,
            vat_percent REAL DEFAULT 0,
            cost_price_percent REAL DEFAULT 0,
            margin_price REAL DEFAULT 0,
            purchase_booking_qty REAL DEFAULT 0,
            sales_booking_qty REAL DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE RESTRICT,
            FOREIGN KEY (small_unit_id) REFERENCES units(unit_id) ON DELETE RESTRICT,
            FOREIGN KEY (large_unit_id) REFERENCES units(unit_id) ON DELETE RESTRICT
          )
        `,
});

module.exports = inventory_tables;
