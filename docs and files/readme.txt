Purchase Booking :: Cancel will be refund amount


POS :: dropdown item select to add to list


CREATE TABLE supplier_payments (
    payment_id      INT AUTO_INCREMENT PRIMARY KEY,
    supplier_id     INT NOT NULL,
    payment_date    DATE NOT NULL,
    amount          DECIMAL(12,2) NOT NULL,
    payment_method  ENUM('Cash','Bank','UPI','Card','Cheque','Other') NOT NULL,
    reference_no    VARCHAR(255),
    note            TEXT,
    
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id)
);


CREATE TABLE payment_allocations (
    allocation_id     INT AUTO_INCREMENT PRIMARY KEY,
    payment_id        INT NOT NULL,
    invoice_id        INT NULL,              -- NULL = advance or credit
    allocated_amount  DECIMAL(12,2) NOT NULL,

    FOREIGN KEY (payment_id) REFERENCES supplier_payments(payment_id),
    FOREIGN KEY (invoice_id) REFERENCES purchase_invoices(invoice_id)
);


CREATE TABLE supplier_ledger (
    ledger_id        INT AUTO_INCREMENT PRIMARY KEY,
    supplier_id      INT NOT NULL,
    transaction_type ENUM('Invoice','Payment','Credit','Debit','Advance','Adjustment') NOT NULL,
    transaction_id   INT NULL,
    
    date             DATE NOT NULL,
    debit            DECIMAL(12,2) DEFAULT 0,    -- invoice, debit note
    credit           DECIMAL(12,2) DEFAULT 0,   -- payments, credit note
    
    note             TEXT,
    
    created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id)
);