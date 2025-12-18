// is_paid : [Paid, Unpaid, Partial]
// is_posted : [0,1]
// is_returned : [0,1]
// is_closed : [0,1]

const vat_tables = () => ({
  vat_master: `
    CREATE TABLE IF NOT EXISTS vat_master (
        master_id TEXT PRIMARY KEY,
        shop_id TEXT NOT NULL,
        source_name TEXT NOT NULL,
        collect_date TEXT,
        collect_note TEXT,
        advance_collection REAL DEFAULT 0,
        due_collection REAL DEFAULT 0,
        total_collection REAL DEFAULT 0,
        rebate_amount REAL DEFAULT 0,
        rebate_note TEXT,
        refund_amount REAL DEFAULT 0,
        refund_note TEXT,
        payable_amount REAL DEFAULT 0,
        paid_amount REAL DEFAULT 0,
        due_amount REAL DEFAULT 0,
        challan_no TEXT,
        challan_date TEXT,
        challan_note TEXT,
        is_paid TEXT DEFAULT 'Unpaid',
        is_posted BOOLEAN DEFAULT 0,
        is_closed BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    `,

  vat_details: `
    CREATE TABLE IF NOT EXISTS vat_details (
        details_id TEXT PRIMARY KEY,
        master_id TEXT NOT NULL,
        shop_id TEXT NOT NULL,
        contact_id TEXT NOT NULL,
        advance_amount REAL DEFAULT 0,
        due_amount REAL DEFAULT 0,
        reference_no TEXT,
        reference_date TEXT,
        reference_note TEXT,
        source_name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (master_id) REFERENCES vat_master (master_id) ON DELETE RESTRICT,
        FOREIGN KEY (contact_id) REFERENCES contacts (contact_id) ON DELETE RESTRICT
    )
    `,
});

module.exports = vat_tables;
