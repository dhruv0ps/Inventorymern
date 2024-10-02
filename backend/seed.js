const User = require('./model/User');
const bcrypt = require('bcryptjs');

const seedSuperAdmin = async () => {
    try {
        const existingAdmin = await User.findOne({ username: 'superadmin' });
        if (existingAdmin) {
            console.log('Super Admin already exists.');
            return;
        }

        const hashedPassword = await bcrypt.hash('superadminpassword', 10); 
        const superAdmin = new User({
            username: 'superadmin',
            password: hashedPassword,
            role: 'superadmin'
        });

        await superAdmin.save();
        console.log('Super Admin created successfully.');
    } catch (err) {
        console.error('Error seeding Super Admin:', err);
    }
};
seedSuperAdmin();
module.exports = seedSuperAdmin;