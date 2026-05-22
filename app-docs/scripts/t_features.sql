CREATE TABLE IF NOT EXISTS t_features (
    id VARCHAR(50) PRIMARY KEY,
    feature_id VARCHAR(50),
    feature_type VARCHAR(50) NOT NULL, -- e.g., "level 1 : project", "level 2 : module", "level 3 : submodule", "level 4 (end) : features"
    feature_name VARCHAR(255) NOT NULL,
    feature_description TEXT,
    feature_status VARCHAR(20) NOT NULL, --e.g., 'planned', 'working', 'in-progress', 'review', 'done', 'blocked'
    feature_priority VARCHAR(20) NOT NULL, -- e.g., "low", "medium", "high", "critical"
    work_type VARCHAR(20) NOT NULL, -- e.g., "development", "testing", "documentation", "bug", "feature", "improvement"
    work_user VARCHAR(50) NOT NULL, -- e.g., "developer", "tester", "documenter", "designer"
    start_date DATE,
    end_date DATE,
    progress_percent INT,
    serial_number INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);