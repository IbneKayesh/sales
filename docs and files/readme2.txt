Below is a clean, production-ready table format for your full purchase + supplier accounting system.

This design is simple, scalable, ERP-grade, and supports:

✔ Invoice totals, discount, due
✔ Partial payment
✔ Overpayment → credit
✔ Advance payment
✔ Pay old dues
✔ Pay without invoice
✔ Auto invoice status
✔ Full ledger accounting

CREATE TABLE suppliers (
    supplier_id      INT AUTO_INCREMENT PRIMARY KEY,
    name             VARCHAR(255) NOT NULL,
    phone            VARCHAR(50),
    email            VARCHAR(255),
    address          TEXT,
    opening_balance  DECIMAL(12,2) DEFAULT 0,
    created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE purchase_invoices (
    invoice_id      INT AUTO_INCREMENT PRIMARY KEY,
    supplier_id     INT NOT NULL,
    
    order_amount    DECIMAL(12,2) NOT NULL,   -- total of item amounts
    discount_amount DECIMAL(12,2) DEFAULT 0,
    total_amount    DECIMAL(12,2) NOT NULL,   -- order_amount - discount_amount
    
    paid_amount     DECIMAL(12,2) DEFAULT 0,  -- auto updated
    due_amount      DECIMAL(12,2) DEFAULT 0,  -- total_amount - paid_amount
    
    status          ENUM('Unpaid', 'Partial', 'Paid') DEFAULT 'Unpaid',
    
    invoice_no      VARCHAR(100),
    invoice_date    DATE NOT NULL,
    note            TEXT,
    
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id)
);


CREATE TABLE purchase_invoice_items (
    item_id        INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id     INT NOT NULL,
    product_name   VARCHAR(255) NOT NULL,
    qty            DECIMAL(12,2) NOT NULL,
    unit_price     DECIMAL(12,2) NOT NULL,
    discount       DECIMAL(12,2) DEFAULT 0,
    tax            DECIMAL(12,2) DEFAULT 0,
    total          DECIMAL(12,2) NOT NULL,

    FOREIGN KEY (invoice_id) REFERENCES purchase_invoices(invoice_id)
);


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






Step A — Get all unpaid/partial invoices (oldest first)

SELECT invoice_id, total_amount, paid_amount, due_amount
FROM purchase_invoices
WHERE supplier_id = ?
AND due_amount > 0
ORDER BY invoice_date ASC, invoice_id ASC;


Step B — Loop in code:
if payment_amount <= 0: stop

If payment_amount >= due_amount:
    allocated = due_amount
    payment_amount -= due_amount
Else:
    allocated = payment_amount
    payment_amount = 0


INSERT INTO payment_allocations (payment_id, invoice_id, allocated_amount)
VALUES (?, ?, ?);


UPDATE purchase_invoices
SET paid_amount = paid_amount + ?,
    due_amount  = total_amount - (paid_amount + ?)
WHERE invoice_id = ?;
