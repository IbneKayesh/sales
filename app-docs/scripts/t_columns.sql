CREATE TABLE IF NOT EXISTS t_columns (
    id VARCHAR(50) PRIMARY KEY,
    table_id VARCHAR(50) NOT NULL REFERENCES t_tables(id) ON DELETE CASCADE,
    column_name VARCHAR(255) NOT NULL,
    data_type VARCHAR(50) NOT NULL,
    data_length INT,
    is_nullable BOOLEAN DEFAULT TRUE,
    default_value VARCHAR(255),    
    is_primary BOOLEAN DEFAULT FALSE,
    is_foreign BOOLEAN DEFAULT FALSE,
    references_table VARCHAR(50),
    references_column VARCHAR(50),
    column_description TEXT,
    serial_number INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (table_id, column_name)
);