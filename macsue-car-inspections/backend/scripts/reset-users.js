const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function resetUsers() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'macsue_inspections'
    });

    console.log('Connected to database');

    // Delete existing users
    await connection.execute('DELETE FROM users WHERE username IN (?, ?)', ['admin', 'user']);
    console.log('Deleted existing admin and user accounts');

    // Generate password hashes
    const adminPasswordHash = await bcrypt.hash('admin123', 12);
    const userPasswordHash = await bcrypt.hash('user123', 12);

    // Insert new users
    await connection.execute(
      'INSERT INTO users (username, email, password, full_name, phone, is_admin) VALUES (?, ?, ?, ?, ?, ?)',
      ['admin', 'admin@macsue.com', adminPasswordHash, 'Admin User', '123-456-7890', true]
    );

    await connection.execute(
      'INSERT INTO users (username, email, password, full_name, phone, is_admin) VALUES (?, ?, ?, ?, ?, ?)',
      ['user', 'user@macsue.com', userPasswordHash, 'Regular User', '555-0123', false]
    );

    console.log('Created new users:');
    console.log('- Admin: username=admin, password=admin123');
    console.log('- User: username=user, password=user123');

    await connection.end();
    console.log('Database connection closed');

  } catch (error) {
    console.error('Error resetting users:', error);
  }
}

resetUsers();