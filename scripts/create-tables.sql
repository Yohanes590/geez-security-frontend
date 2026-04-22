-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
    id SERIAL PRIMARY KEY,
    course_id VARCHAR(100) NOT NULL,
    course_title VARCHAR(255) NOT NULL,
    course_price DECIMAL(10,2) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    date_of_birth DATE NOT NULL,
    education VARCHAR(50) NOT NULL,
    experience VARCHAR(50) NOT NULL,
    motivation TEXT NOT NULL,
    programming_languages VARCHAR(255),
    operating_system VARCHAR(50),
    networking_knowledge VARCHAR(50),
    payment_method VARCHAR(20) NOT NULL,
    account_holder_name VARCHAR(255) NOT NULL,
    account_number VARCHAR(50) NOT NULL,
    reference_number VARCHAR(100) NOT NULL,
    payment_link TEXT,
    coupon_code VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending',
    verification_url TEXT,
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add extracted_data column to registrations table
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS extracted_data JSONB;

-- Create index for better performance on extracted data queries
CREATE INDEX IF NOT EXISTS idx_registrations_extracted_data ON registrations USING GIN (extracted_data);

-- Create coupons table
CREATE TABLE IF NOT EXISTS coupons (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type VARCHAR(20) NOT NULL, -- 'percentage' or 'fixed'
    discount_value DECIMAL(10,2) NOT NULL,
    max_uses INTEGER DEFAULT NULL,
    used_count INTEGER DEFAULT 0,
    valid_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create payment_verifications table
CREATE TABLE IF NOT EXISTS payment_verifications (
    id SERIAL PRIMARY KEY,
    registration_id INTEGER REFERENCES registrations(id),
    verification_url TEXT NOT NULL,
    verification_response TEXT,
    is_verified BOOLEAN DEFAULT false,
    verified_amount DECIMAL(10,2),
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add confidence_score column to payment_verifications table
ALTER TABLE payment_verifications ADD COLUMN IF NOT EXISTS confidence_score INTEGER DEFAULT 0;

-- Create receipt_extractions table for logging all extraction attempts
CREATE TABLE IF NOT EXISTS receipt_extractions (
    id SERIAL PRIMARY KEY,
    registration_id INTEGER REFERENCES registrations(id),
    file_name VARCHAR(255),
    file_size INTEGER,
    payment_method VARCHAR(20),
    extraction_success BOOLEAN DEFAULT false,
    extracted_data JSONB,
    confidence_score INTEGER DEFAULT 0,
    processing_time_ms INTEGER,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample coupons
INSERT INTO coupons (code, discount_type, discount_value, max_uses, valid_until) VALUES
('EARLY2025', 'percentage', 20.00, 100, '2025-03-31 23:59:59'),
('STUDENT50', 'fixed', 50.00, 50, '2025-12-31 23:59:59'),
('WELCOME10', 'percentage', 10.00, NULL, '2025-06-30 23:59:59');
