
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv")
dotenv.config();
const registerUser = async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
       
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        
        const hashedPassword = await bcrypt.hash(password, 10);

        
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role,
        });
            const token = jwt.sign(
              {userId : newUser._id , role : newUser.role},
              process.env.JWT_SECRET,
              { expiresIn: '1h' }
            )
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




const getAllUsers = async (req, res) => {
  try {
      const users = await User.find();

      
      const filteredUsers = users.filter(user => user.role !== 'superadmin');

      res.status(200).json(filteredUsers);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

const activateUser = async (req, res) => {
  const { id } = req.params;
  try {
      const user = await User.findById(id);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      user.status = 'active'; 
      await user.save();
      res.status(200).json({ message: 'User activated successfully', user });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};


const suspendUser = async (req, res) => {
  const { id } = req.params;
  try {
      const user = await User.findById(id);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      user.status = 'suspended'; 
      await user.save();
      res.status(200).json({ message: 'User suspended successfully', user });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};


const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
      const user = await User.findByIdAndDelete(id);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};


module.exports = {
    registerUser,
    getAllUsers,
    activateUser,
    suspendUser,
    deleteUser,
};
