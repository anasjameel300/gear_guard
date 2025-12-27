-- GearGuard Database Schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    role VARCHAR(50) NOT NULL DEFAULT 'technician',
    avatar_url TEXT,
    department VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Maintenance Teams table
CREATE TABLE IF NOT EXISTS teams (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    lead_technician_id VARCHAR(50) REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Team Members junction table
CREATE TABLE IF NOT EXISTS team_members (
    team_id VARCHAR(50) REFERENCES teams(id) ON DELETE CASCADE,
    user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (team_id, user_id)
);

-- Equipment table
CREATE TABLE IF NOT EXISTS equipment (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    serial_number VARCHAR(100),
    location VARCHAR(255),
    status VARCHAR(50) DEFAULT 'operational',
    last_maintenance DATE,
    category VARCHAR(100),
    department VARCHAR(100),
    assigned_to VARCHAR(255),
    maintenance_team_id VARCHAR(50) REFERENCES teams(id),
    technician_id VARCHAR(50) REFERENCES users(id),
    purchase_date DATE,
    warranty_expiration DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Maintenance Requests/Tickets table
CREATE TABLE IF NOT EXISTS tickets (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    equipment_id VARCHAR(50) REFERENCES equipment(id),
    equipment_name VARCHAR(255),
    priority VARCHAR(50) DEFAULT 'medium',
    status VARCHAR(50) DEFAULT 'new',
    type VARCHAR(50),
    assignee_id VARCHAR(50) REFERENCES users(id),
    date_created DATE DEFAULT CURRENT_DATE,
    description TEXT,
    scheduled_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activities table for audit log
CREATE TABLE IF NOT EXISTS activities (
    id VARCHAR(50) PRIMARY KEY,
    type VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_name VARCHAR(255)
);

-- System Options table
CREATE TABLE IF NOT EXISTS system_options (
    id SERIAL PRIMARY KEY,
    option_type VARCHAR(50) NOT NULL,
    option_value VARCHAR(255) NOT NULL,
    UNIQUE(option_type, option_value)
);
