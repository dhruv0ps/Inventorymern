const Role = require("../model/Role");
const User = require("../model/User"); 
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();

const addnewRole = async (req, res) => {
    const { role } = req.body;
    try {
        const existingProfile = await Role.findOne({ name: role });
        if (existingProfile) {
            return res.status(400).json({ msg: "Role already exists" });
        }
        
        const newRole = new Role({ name: role });
        await newRole.save();
        res.status(201).json({ message: 'Role added successfully', role: newRole }); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateUserRole = async (req, res) => {
    const { role } = req.body;
    const userId = req.params.userId;
    console.log(userId)
    try {
        const user = await User.findByIdAndUpdate(userId, { role }, { new: true });
        console.log(user)
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = role;
        await user.save();

        res.status(200).json({ message: 'User role updated successfully', user });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
}
const getRole = async(req,res) => {
    try{
        const role = await Role.find();
        res.status(200).json(role);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }

}
module.exports = { 
    addnewRole,
    updateUserRole,
    getRole
};
