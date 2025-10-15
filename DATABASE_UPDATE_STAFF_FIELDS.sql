-- Add new columns to the staff table for enhanced provider information
-- Run this in your MySQL database (phpMyAdmin or command line)

ALTER TABLE staff 
ADD COLUMN years_experience INT DEFAULT NULL AFTER credentials,
ADD COLUMN email VARCHAR(255) DEFAULT NULL AFTER years_experience,
ADD COLUMN phone VARCHAR(50) DEFAULT NULL AFTER email,
ADD COLUMN linkedin_url VARCHAR(500) DEFAULT NULL AFTER phone,
ADD COLUMN education VARCHAR(500) DEFAULT NULL AFTER linkedin_url,
ADD COLUMN locations TEXT DEFAULT NULL AFTER education,
ADD COLUMN languages VARCHAR(500) DEFAULT NULL AFTER locations;

-- Verify the new structure
DESCRIBE staff;
