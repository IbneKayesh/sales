// backend-app/db/contactsPgs.js
const contactsPgs = () => {
  const contacts = `
    CREATE TABLE IF NOT EXISTS contacts (
        contact_id TEXT PRIMARY KEY,
        contact_name TEXT NOT NULL,
        contact_mobile TEXT,
        contact_email TEXT,
        contact_address TEXT,
        contact_type TEXT DEFAULT 'Customer',
        credit_limit NUMERIC(18,4) DEFAULT 0,
        payable_balance NUMERIC(18,4) DEFAULT 0,
        advance_balance NUMERIC(18,4) DEFAULT 0,
        current_balance NUMERIC(18,4) DEFAULT 0,
        shop_id TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT fk_shop FOREIGN KEY (shop_id) REFERENCES shops(shop_id) ON DELETE SET NULL
    );
  `;

  const contactsData = [
    {
      contact_id: "internal",
      contact_name: "Internal A/C",
      contact_mobile: "0",
      contact_email: "0",
      contact_address: "Internal A/C",
      contact_type: "Internal",
      credit_limit: 0,
      payable_balance: 0,
      advance_balance: 0,
      current_balance: 0,
      shop_id: "1",
    },
    {
      contact_id: "both",
      contact_name: "Unknown A/C",
      contact_mobile: "0",
      contact_email: "0",
      contact_address: "Unknown A/C",
      contact_type: "Both",
      credit_limit: 0,
      payable_balance: 0,
      advance_balance: 0,
      current_balance: 0,
      shop_id: "1",
    },
    {
      contact_id: "customer",
      contact_name: "Customer A/C",
      contact_mobile: "0",
      contact_email: "0",
      contact_address: "Customer A/C",
      contact_type: "Customer",
      credit_limit: 0,
      payable_balance: 0,
      advance_balance: 0,
      current_balance: 0,
      shop_id: "1",
    },
    {
      contact_id: "supplier",
      contact_name: "Supplier A/C",
      contact_mobile: "0",
      contact_email: "0",
      contact_address: "Supplier A/C",
      contact_type: "Supplier",
      credit_limit: 0,
      payable_balance: 0,
      advance_balance: 0,
      current_balance: 0,
      shop_id: "1",
    },
  ];

  return { contacts, contactsData };
};

module.exports = contactsPgs;
