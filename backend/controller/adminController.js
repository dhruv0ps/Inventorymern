const bcrypt = require("bcryptjs");
const User = require("../model/User");

const addAdmin = async (req, res) => { 
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword, role: 'admin' });
        await newUser.save();
        res.status(201).json({ message: 'Admin added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { addAdmin }; 
