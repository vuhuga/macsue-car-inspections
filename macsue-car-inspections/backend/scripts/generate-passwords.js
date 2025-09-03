const bcrypt = require('bcryptjs');

async function generatePasswords() {
    const adminPassword = await bcrypt.hash('admin123', 12);
    const userPassword = await bcrypt.hash('user123', 12);

    console.log('Admin password hash (admin123):', adminPassword);
    console.log('User password hash (user123):', userPassword);
}

generatePasswords();