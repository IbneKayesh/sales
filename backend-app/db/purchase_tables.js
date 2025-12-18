// is_paid : [Paid, Unpaid, Partial]
// is_posted : [0,1]
// is_returned : [0,1]
// is_closed : [0,1]


const purchase_tables = () => ({
  po_master: `
    CREATE TABLE IF NOT EXISTS po_master (
        master_id TEXT PRIMARY KEY,
        shop_id TEXT NOT NULL,
        contact_id TEXT NOT NULL,
        order_type TEXT NOT NULL,
        order_no TEXT NOT NULL,
        order_date TEXT NOT NULL,
        order_note TEXT,
        order_amount REAL DEFAULT 0,
        discount_amount REAL DEFAULT 0,
        vat_amount REAL DEFAULT 0,
        is_vat_payable BOOLEAN DEFAULT 0,
        include_cost REAL DEFAULT 0,
        exclude_cost REAL DEFAULT 0,
        total_amount REAL DEFAULT 0,
        payable_amount REAL DEFAULT 0,
        paid_amount REAL DEFAULT 0,
        due_amount REAL DEFAULT 0,
        is_paid TEXT NOT NULL,
        is_posted BOOLEAN DEFAULT 0,
        is_returned BOOLEAN DEFAULT 0,
        is_closed BOOLEAN DEFAULT 0,
        vat_collected BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (contact_id) REFERENCES contacts (contact_id) ON DELETE RESTRICT
    )
    `,

  po_booking: `
    CREATE TABLE IF NOT EXISTS po_booking (
        booking_id TEXT PRIMARY KEY,
        master_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        product_price REAL DEFAULT 0,
        product_qty REAL DEFAULT 0,
        discount_percent REAL DEFAULT 0,
        discount_amount REAL DEFAULT 0,
        vat_percent REAL DEFAULT 0,
        vat_amount REAL DEFAULT 0,
        cost_price REAL DEFAULT 0,
        total_amount REAL DEFAULT 0,
        product_note TEXT,  
        cancelled_qty REAL DEFAULT 0,
        invoice_qty REAL DEFAULT 0,
        pending_qty REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (master_id) REFERENCES po_master (master_id) ON DELETE RESTRICT,
        FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE RESTRICT
    )
    `,

  po_receive: `
    CREATE TABLE IF NOT EXISTS po_invoice (
        invoice_id TEXT PRIMARY KEY,
        master_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        product_price REAL DEFAULT 0,
        product_qty REAL DEFAULT 0,
        discount_percent REAL DEFAULT 0,
        discount_amount REAL DEFAULT 0,
        vat_percent REAL DEFAULT 0,
        vat_amount REAL DEFAULT 0,
        cost_price REAL DEFAULT 0,
        total_amount REAL DEFAULT 0,
        product_note TEXT,  
        returned_qty REAL DEFAULT 0,
        sales_qty REAL DEFAULT 0,
        stock_qty REAL DEFAULT 0,
        booking_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (master_id) REFERENCES po_master (master_id) ON DELETE RESTRICT,
        FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE RESTRICT
    )
    `,

  po_order: `
    CREATE TABLE IF NOT EXISTS po_order (
        order_id TEXT PRIMARY KEY,
        master_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        product_price REAL DEFAULT 0,
        product_qty REAL DEFAULT 0,
        discount_percent REAL DEFAULT 0,
        discount_amount REAL DEFAULT 0,
        vat_percent REAL DEFAULT 0,
        vat_amount REAL DEFAULT 0,
        cost_price REAL DEFAULT 0,
        total_amount REAL DEFAULT 0,
        product_note TEXT,  
        returned_qty REAL DEFAULT 0,
        sales_qty REAL DEFAULT 0,
        stock_qty REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (master_id) REFERENCES po_master (master_id) ON DELETE RESTRICT,
        FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE RESTRICT
    )
    `,

  po_return: `
    CREATE TABLE IF NOT EXISTS po_return (
        return_id TEXT PRIMARY KEY,
        master_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        product_price REAL DEFAULT 0,
        product_qty REAL DEFAULT 0,
        discount_percent REAL DEFAULT 0,
        discount_amount REAL DEFAULT 0,
        vat_percent REAL DEFAULT 0,
        vat_amount REAL DEFAULT 0,
        cost_price REAL DEFAULT 0,
        total_amount REAL DEFAULT 0,
        product_note TEXT,
        invoice_order_id TEXT NOT NULL,
        source_type TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (master_id) REFERENCES po_master (master_id) ON DELETE RESTRICT,
        FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE RESTRICT
    )
    `,
});

module.exports = purchase_tables;
