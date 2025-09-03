const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function initializeDatabase() {
  let connection;
  
  try {
    // Connect to MySQL server (without specifying database)
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'Spicyp204',
      port: process.env.DB_PORT || 3306
    });

    console.log('Connected to MySQL server');

    // Create database if it doesn't exist
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'macsue_inspections'}`);
    console.log('✅ Database created/verified');

    // Use the database
    await connection.execute(`USE ${process.env.DB_NAME || 'macsue_inspections'}`);

    // Create users table
    await connection.execute(`
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
      )
    `);
    console.log('✅ Users table created/verified');

    // Create inspections table
    await connection.execute(`
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
      )
    `);
    console.log('✅ Inspections table created/verified');

    // Create pricing table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS pricing (
        id INT AUTO_INCREMENT PRIMARY KEY,
        car_type ENUM('sedan', 'suv', 'truck', 'other') NOT NULL,
        inspection_type ENUM('body', 'mechanical', 'full') NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_pricing (car_type, inspection_type)
      )
    `);
    console.log('✅ Pricing table created/verified');

    // Create contact_messages table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        subject VARCHAR(200) NOT NULL,
        message TEXT NOT NULL,
        status ENUM('new', 'read', 'replied') DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Contact messages table created/verified');

    // Insert default pricing data
    const pricingData = [
      ['sedan', 'body', 49.99],
      ['sedan', 'mechanical', 79.99],
      ['sedan', 'full', 119.99],
      ['suv', 'body', 59.99],
      ['suv', 'mechanical', 89.99],
      ['suv', 'full', 139.99],
      ['truck', 'body', 69.99],
      ['truck', 'mechanical', 99.99],
      ['truck', 'full', 159.99],
      ['other', 'body', 79.99],
      ['other', 'mechanical', 109.99],
      ['other', 'full', 179.99]
    ];

    for (const [carType, inspectionType, price] of pricingData) {
      await connection.execute(`
        INSERT IGNORE INTO pricing (car_type, inspection_type, price) 
        VALUES (?, ?, ?)
      `, [carType, inspectionType, price]);
    }
    console.log('✅ Default pricing data inserted');

    // Create default admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    await connection.execute(`
      INSERT IGNORE INTO users (username, email, password, full_name, phone, is_admin) 
      VALUES (?, ?, ?, ?, ?, ?)
    `, ['admin', 'admin@macsue.com', adminPassword, 'Admin User', '123-456-7890', true]);

    // Create default regular user
    const userPassword = await bcrypt.hash('password123', 12);
    await connection.execute(`
      INSERT IGNORE INTO users (username, email, password, full_name, phone, is_admin) 
      VALUES (?, ?, ?, ?, ?, ?)
    `, ['john_doe', 'john@example.com', userPassword, 'John Doe', '555-0123', false]);

    console.log('✅ Default users created');

    // Insert sample inspection data
    await connection.execute(`
      INSERT IGNORE INTO inspections (user_id, car_make, car_model, car_year, car_type, inspection_type, appointment_date, appointment_time, notes, status) 
      VALUES (2, 'Toyota', 'Camry', 2018, 'sedan', 'full', '2024-12-15', '10:00:00', 'Please check the transmission carefully', 'scheduled')
    `);
    console.log('✅ Sample inspection data inserted');

    console.log('\n🎉 Database initialization completed successfully!');
    console.log('\nDefault users created:');
    console.log('Admin: username=admin, password=admin123');
    console.log('User: username=john_doe, password=password123');

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run initialization
initializeDatabase();