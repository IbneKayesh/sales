CREATE TABLE IF NOT EXISTS t_tables (
    id VARCHAR(50) PRIMARY KEY,
    table_name VARCHAR(255) NOT NULL,
    table_description TEXT,
    serial_number INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);