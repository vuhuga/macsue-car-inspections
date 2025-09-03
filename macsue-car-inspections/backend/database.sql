-- Create database
CREATE DATABASE IF NOT EXISTS macsue_inspections;
USE macsue_inspections;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create inspections table
CREATE TABLE IF NOT EXISTS inspections (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  car_make VARCHAR(50) NOT NULL,
  car_model VARCHAR(50) NOT NULL,
  car_year INT NOT NULL,
  car_type ENUM('sedan', 'suv', 'truck', 'other') NOT NULL,
  inspection_type ENUM('body', 'mechanical', 'full') NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  notes TEXT,
  status ENUM('pending', 'scheduled', 'in-progress', 'completed', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create pricing table
CREATE TABLE IF NOT EXISTS pricing (
  id INT AUTO_INCREMENT PRIMARY KEY,
  car_type ENUM('sedan', 'suv', 'truck', 'other') NOT NULL,
  inspection_type ENUM('body', 'mechanical', 'full') NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_pricing (car_type, inspection_type)
);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('new', 'read', 'replied') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default pricing data
INSERT IGNORE INTO pricing (car_type, inspection_type, price) VALUES
('sedan', 'body', 49.99),
('sedan', 'mechanical', 79.99),
('sedan', 'full', 119.99),
('suv', 'body', 59.99),
('suv', 'mechanical', 89.99),
('suv', 'full', 139.99),
('truck', 'body', 69.99),
('truck', 'mechanical', 99.99),
('truck', 'full', 159.99),
('other', 'body', 79.99),
('other', 'mechanical', 109.99),
('other', 'full', 179.99);

-- Create default admin user (username: admin, password: admin123)
INSERT IGNORE INTO users (username, email, password, full_name, phone, is_admin) 
VALUES ('admin', 'admin@macsue.com', '$2a$12$pxw1f8zx4kLx2JiNVtBHb.FS4CXxxrHgit/mncAFJbr8mEp/uWJNK', 'Admin User', '123-456-7890', true);

-- Create default regular user (username: user, password: user123)
INSERT IGNORE INTO users (username, email, password, full_name, phone, is_admin) 
VALUES ('user', 'user@macsue.com', '$2a$12$5oxapV6jSXMrB.5vgQAW3uHXF6GjV.KMQnqKlSR4ZSm/Q0C/JPLR6', 'Regular User', '555-0123', false);

-- Insert sample inspection data
INSERT IGNORE INTO inspections (user_id, car_make, car_model, car_year, car_type, inspection_type, appointment_date, appointment_time, notes, status) 
VALUES (2, 'Toyota', 'Camry', 2018, 'sedan', 'full', '2024-12-15', '10:00:00', 'Please check the transmission carefully', 'scheduled');