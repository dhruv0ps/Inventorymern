const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const auth = require('../middleware/auth');
const {addAdmin} = require("../controller/adminController")
const router = express.Router();



// router.post('/add-admin', async (req, res) => {
//     const { username, password } = req.body;

//     try {
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const newUser = new User({ username, password: hashedPassword, role: 'admin' });
//         await newUser.save();
//         res.status(201).json({ message: 'Admin added successfully' });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

router.post('/add-admin', addAdmin);
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (user.role !== 'superadmin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET,  { expiresIn: '2d' } );
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 
